// @ts-nocheck
// MongoDB-backed data store
// Replaces the previous in-memory store for persistence across restarts

import { getDb } from '@/lib/mongodb';
import categoriesData from '@/data/categories.json';
import mythsData from '@/data/myths.json';
import pathsData from '@/data/paths.json';

// ===== HELPER: Get collections =====
async function col(name: string) {
    const db = await getDb();
    return db.collection(name);
}

// ===== CATEGORIES (static JSON — no DB needed) =====
export async function getCategories() {
    const questionsCol = await col('questions');
    const publishedCol = await col('publishedQAs');

    // Build counts per category
    const countsMap: Record<string, number> = {};
    for (const cat of categoriesData) {
        const qCount = await questionsCol.countDocuments({ category: cat.id });
        const pCount = await publishedCol.countDocuments({ category: cat.id });
        countsMap[cat.id] = qCount + pCount;
    }

    return categoriesData.map(cat => ({
        ...cat,
        questionCount: countsMap[cat.id] || 0,
    }));
}

// ===== QUESTIONS =====
export async function createQuestion({ category, tags, text, context, sessionTokenHash }) {
    const questionsCol = await col('questions');

    // Generate a sequential-ish ID
    const count = await questionsCol.countDocuments();
    const id = `q-${100 + count + 1}`;

    const question = {
        id,
        category,
        tags: tags || [],
        text,
        context: context || {},
        sessionTokenHash,
        status: 'pending', // pending | approved | rejected | published
        moderationFlags: [],
        answers: [],
        followUps: [],
        helpfulCount: 0,
        createdAt: new Date().toISOString(),
        publishedAt: null,
    };

    await questionsCol.insertOne(question);
    return question;
}

export async function getQuestion(id) {
    const questionsCol = await col('questions');
    const q = await questionsCol.findOne({ id }, { projection: { _id: 0 } });
    if (q) return q;

    // Check published QAs
    const publishedCol = await col('publishedQAs');
    return await publishedCol.findOne({ id }, { projection: { _id: 0 } }) || null;
}

export async function getQuestions(filters: any = {}) {
    const questionsCol = await col('questions');
    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.category) query.category = filters.category;
    if (filters.sessionTokenHash) query.sessionTokenHash = filters.sessionTokenHash;

    return await questionsCol
        .find(query, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .toArray();
}

export async function addFollowUp(questionId, { text, sessionTokenHash }) {
    const questionsCol = await col('questions');
    const question = await questionsCol.findOne({ id: questionId });
    if (!question) return null;

    const followUp = {
        id: `fu-${Date.now()}`,
        text,
        sessionTokenHash,
        createdAt: new Date().toISOString(),
    };

    await questionsCol.updateOne(
        { id: questionId },
        { $push: { followUps: followUp } }
    );

    return followUp;
}

export async function voteHelpful(questionId, sessionTokenHash) {
    const votesCol = await col('votes');
    const key = `${questionId}-${sessionTokenHash}`;

    // Check if already voted
    const existing = await votesCol.findOne({ key });
    if (existing) return false;

    // Record vote
    await votesCol.insertOne({ key, createdAt: new Date().toISOString() });

    // Increment on questions
    const questionsCol = await col('questions');
    const qResult = await questionsCol.updateOne(
        { id: questionId },
        { $inc: { helpfulCount: 1 } }
    );
    if (qResult.matchedCount > 0) return true;

    // Try published QAs
    const publishedCol = await col('publishedQAs');
    const pResult = await publishedCol.updateOne(
        { id: questionId },
        { $inc: { helpfulCount: 1 } }
    );
    return pResult.matchedCount > 0;
}

// ===== MODERATION =====
export async function getModerationQueue() {
    const questionsCol = await col('questions');
    return await questionsCol
        .find({ status: 'pending' }, { projection: { _id: 0 } })
        .sort({ createdAt: 1 })
        .toArray();
}

export async function moderateQuestion(id, { action, editedText, answer, tags, reviewBadge, routeToExpert }) {
    const questionsCol = await col('questions');
    const question = await questionsCol.findOne({ id });
    if (!question) return null;

    switch (action) {
        case 'approve': {
            const update: any = { $set: { status: 'approved' } };
            if (answer) {
                update.$push = {
                    answers: {
                        id: `a-${Date.now()}`,
                        text: answer,
                        authorRole: 'moderator',
                        reviewBadge: reviewBadge || 'moderated',
                        createdAt: new Date().toISOString(),
                    }
                };
            }
            await questionsCol.updateOne({ id }, update);
            break;
        }
        case 'reject':
            await questionsCol.updateOne({ id }, { $set: { status: 'rejected' } });
            break;
        case 'edit': {
            const setFields: any = {};
            if (editedText) setFields.text = editedText;
            if (tags) setFields.tags = tags;
            if (Object.keys(setFields).length > 0) {
                await questionsCol.updateOne({ id }, { $set: setFields });
            }
            break;
        }
        case 'publish': {
            await questionsCol.updateOne({ id }, { $set: { status: 'published' } });

            // Refresh the question to get latest answers
            const updated = await questionsCol.findOne({ id });

            const slug = question.text
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-')
                .slice(0, 80);

            const publishedQA = {
                id: question.id,
                question: question.text,
                answer: answer || updated?.answers?.[0]?.text || '',
                category: question.category,
                tags: tags || question.tags,
                whenToSeekHelp: '',
                slug,
                helpfulCount: question.helpfulCount,
                status: 'published',
                reviewBadge: reviewBadge || 'moderated',
                createdAt: question.createdAt,
                publishedAt: new Date().toISOString(),
            };

            const publishedCol = await col('publishedQAs');
            await publishedCol.insertOne(publishedQA);
            break;
        }
        case 'route-to-expert':
            await questionsCol.updateOne(
                { id },
                { $push: { moderationFlags: 'expert-review-required' } }
            );
            break;
    }

    // Return updated question
    return await questionsCol.findOne({ id }, { projection: { _id: 0 } });
}

// ===== PUBLISHED Q&As (Knowledge Base) =====
export async function getPublishedQAs(filters: any = {}) {
    const publishedCol = await col('publishedQAs');
    const query: any = {};

    if (filters.category) query.category = filters.category;
    if (filters.search) {
        const term = filters.search;
        query.$or = [
            { question: { $regex: term, $options: 'i' } },
            { answer: { $regex: term, $options: 'i' } },
            { tags: { $regex: term, $options: 'i' } },
        ];
    }

    return await publishedCol
        .find(query, { projection: { _id: 0 } })
        .sort({ helpfulCount: -1 })
        .toArray();
}

export async function getPublishedQABySlug(slug) {
    const publishedCol = await col('publishedQAs');
    return await publishedCol.findOne({ slug }, { projection: { _id: 0 } }) || null;
}

// ===== MYTHS (static JSON — no DB needed) =====
export function getMyths() {
    return mythsData;
}

// ===== LEARNING PATHS (static JSON — no DB needed) =====
export function getPaths() {
    return pathsData;
}

// ===== JOURNAL =====
export async function createJournalEntry({ sessionTokenHash, entryText, moodTag, prompt }) {
    const journalCol = await col('journalEntries');
    const entry = {
        id: `j-${Date.now()}`,
        sessionTokenHash,
        entryText,
        moodTag,
        prompt: prompt || null,
        createdAt: new Date().toISOString(),
    };
    await journalCol.insertOne(entry);
    return entry;
}

export async function getJournalEntries(sessionTokenHash) {
    const journalCol = await col('journalEntries');
    return await journalCol
        .find({ sessionTokenHash }, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .toArray();
}

export async function deleteJournalEntries(sessionTokenHash) {
    const journalCol = await col('journalEntries');
    await journalCol.deleteMany({ sessionTokenHash });
    return true;
}

// ===== COUPLES =====
const couplesPrompts = [
    { id: 'cp-1', text: "On a scale of 1-5, how emotionally connected did you feel to your partner this week?", type: 'scale' },
    { id: 'cp-2', text: "Did you and your partner have a meaningful conversation about your relationship this week?", type: 'yesno' },
    { id: 'cp-3', text: "How comfortable do you feel expressing your needs to your partner right now?", type: 'scale' },
    { id: 'cp-4', text: "Did you show physical affection (hugs, hand-holding, etc.) at least once today?", type: 'yesno' },
    { id: 'cp-5', text: "How would you rate your stress level this week? (1=low, 5=high)", type: 'scale' },
    { id: 'cp-6', text: "Is there something you'd like to tell your partner but haven't yet?", type: 'yesno' },
    { id: 'cp-7', text: "How satisfied are you with the quality of time you spent together this week?", type: 'scale' },
];

const conversationScripts = [
    { id: 'cs-1', title: "Expressing a Need", script: "I've been feeling [emotion] lately, and I think it's because I need more [need]. Can we talk about how we might make that happen?", category: 'needs' },
    { id: 'cs-2', title: "Setting a Boundary", script: "I care about us, and I want to be honest. I'm not comfortable with [situation]. It would mean a lot if we could [alternative].", category: 'boundaries' },
    { id: 'cs-3', title: "Initiating Intimacy Conversation", script: "I've been thinking about our intimacy, and I'd love for us to talk about what feels good for both of us. There's no pressure — I just want us to feel closer.", category: 'intimacy' },
    { id: 'cs-4', title: "Checking In After Conflict", script: "I know we had a disagreement about [topic]. I want to understand your perspective better. Can you help me see how you felt?", category: 'conflict' },
    { id: 'cs-5', title: "Appreciating Your Partner", script: "I wanted to tell you that I really appreciate how you [specific action]. It made me feel [emotion], and I'm grateful to have you.", category: 'appreciation' },
    { id: 'cs-6', title: "Discussing Consent", script: "I love being close to you. I want to make sure we're both always comfortable. How do you feel about us checking in with each other more during intimate moments?", category: 'consent' },
];

export function getCouplesPrompts() {
    const shuffled = [...couplesPrompts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
}

export function getConversationScripts() {
    return conversationScripts;
}

export async function submitCouplesCheckin({ sessionTokenHash, responses }) {
    const checkinsCol = await col('couplesCheckins');
    const checkin = {
        id: `cc-${Date.now()}`,
        sessionTokenHash,
        responses,
        createdAt: new Date().toISOString(),
    };
    await checkinsCol.insertOne(checkin);

    const recommendations = generateCouplesRecommendations(responses);
    return { checkin, recommendations };
}

function generateCouplesRecommendations(responses) {
    const recs = [];
    const scaleResponses = responses.filter(r => r.type === 'scale');
    const avgScore = scaleResponses.reduce((sum, r) => sum + r.value, 0) /
        Math.max(1, scaleResponses.length);

    if (avgScore <= 2.5) {
        recs.push({ type: 'action', text: "Schedule 15 minutes of device-free time together today." });
        recs.push({ type: 'script', scriptId: 'cs-1' });
        recs.push({ type: 'learning', text: "Check out the 'Starting the Conversation' module in Communication & Relationships." });
    } else if (avgScore <= 3.5) {
        recs.push({ type: 'action', text: "Share one thing you appreciate about your partner today." });
        recs.push({ type: 'script', scriptId: 'cs-5' });
        recs.push({ type: 'learning', text: "Explore the 'Love Languages & Intimacy' module for deeper connection." });
    } else {
        recs.push({ type: 'action', text: "Try a new experience together this week — it could be as simple as cooking a meal." });
        recs.push({ type: 'script', scriptId: 'cs-3' });
        recs.push({ type: 'learning', text: "You're doing well! Consider the 'Deepening Connection' path for even more growth." });
    }

    return recs;
}

// ===== CONSULTS =====
export async function createConsult({ sessionTokenHash, topic, urgency, expertType, message }) {
    const consultsCol = await col('consults');
    const consult = {
        id: `con-${Date.now()}`,
        sessionTokenHash,
        topic,
        urgency,
        expertType,
        message,
        status: 'pending', // pending | paid | scheduled | completed
        createdAt: new Date().toISOString(),
    };
    await consultsCol.insertOne(consult);
    return consult;
}

export async function getConsults(sessionTokenHash) {
    const consultsCol = await col('consults');
    return await consultsCol
        .find({ sessionTokenHash }, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .toArray();
}
