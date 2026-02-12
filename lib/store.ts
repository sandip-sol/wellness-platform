// @ts-nocheck
// In-memory data store for the POC
// In production, this would be replaced with a proper database

import categoriesData from '@/data/categories.json';
import mythsData from '@/data/myths.json';
import pathsData from '@/data/paths.json';
import faqsData from '@/data/faqs.json';

// ===== DATA COLLECTIONS =====
let questions = [];
let answers = [];
let threads = [];
let journalEntries = [];
let couplesCheckins = [];
let consults = [];
let votes = {};

// Seed published Q&As from FAQs
let publishedQAs = faqsData.map(faq => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    tags: faq.tags,
    whenToSeekHelp: faq.whenToSeekHelp,
    emergencyRedFlags: faq.emergencyRedFlags || null,
    slug: faq.slug,
    helpfulCount: faq.helpfulCount,
    status: 'published',
    reviewBadge: 'moderated',
    createdAt: new Date('2025-01-01').toISOString(),
    publishedAt: new Date('2025-01-15').toISOString()
}));

let questionIdCounter = 100;

// ===== CATEGORIES =====
export function getCategories() {
    // Update question counts
    return categoriesData.map(cat => ({
        ...cat,
        questionCount: publishedQAs.filter(q => q.category === cat.id).length +
            questions.filter(q => q.category === cat.id).length
    }));
}

// ===== QUESTIONS =====
export function createQuestion({ category, tags, text, context, sessionTokenHash }) {
    const id = `q-${++questionIdCounter}`;
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
        publishedAt: null
    };
    questions.push(question);
    return question;
}

export function getQuestion(id) {
    const q = questions.find(q => q.id === id);
    if (q) return q;
    // Check published QAs
    return publishedQAs.find(qa => qa.id === id) || null;
}

export function getQuestions(filters: any = {}) {
    let result = [...questions];
    if (filters.status) result = result.filter(q => q.status === filters.status);
    if (filters.category) result = result.filter(q => q.category === filters.category);
    if (filters.sessionTokenHash) result = result.filter(q => q.sessionTokenHash === filters.sessionTokenHash);
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function addFollowUp(questionId, { text, sessionTokenHash }) {
    const question = questions.find(q => q.id === questionId);
    if (!question) return null;
    const followUp = {
        id: `fu-${Date.now()}`,
        text,
        sessionTokenHash,
        createdAt: new Date().toISOString()
    };
    question.followUps.push(followUp);
    return followUp;
}

export function voteHelpful(questionId, sessionTokenHash) {
    const key = `${questionId}-${sessionTokenHash}`;
    if (votes[key]) return false; // Already voted
    votes[key] = true;

    // Check in questions
    const q = questions.find(q => q.id === questionId);
    if (q) { q.helpfulCount++; return true; }

    // Check in published QAs
    const qa = publishedQAs.find(qa => qa.id === questionId);
    if (qa) { qa.helpfulCount++; return true; }

    return false;
}

// ===== MODERATION =====
export function getModerationQueue() {
    return questions
        .filter(q => q.status === 'pending')
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

export function moderateQuestion(id, { action, editedText, answer, tags, reviewBadge, routeToExpert }) {
    const question = questions.find(q => q.id === id);
    if (!question) return null;

    switch (action) {
        case 'approve':
            question.status = 'approved';
            if (answer) {
                question.answers.push({
                    id: `a-${Date.now()}`,
                    text: answer,
                    authorRole: 'moderator',
                    reviewBadge: reviewBadge || 'moderated',
                    createdAt: new Date().toISOString()
                });
            }
            break;
        case 'reject':
            question.status = 'rejected';
            break;
        case 'edit':
            if (editedText) question.text = editedText;
            if (tags) question.tags = tags;
            break;
        case 'publish':
            question.status = 'published';
            const slug = question.text
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-')
                .slice(0, 80);
            const publishedQA = {
                id: question.id,
                question: question.text,
                answer: answer || question.answers[0]?.text || '',
                category: question.category,
                tags: tags || question.tags,
                whenToSeekHelp: '',
                slug,
                helpfulCount: question.helpfulCount,
                status: 'published',
                reviewBadge: reviewBadge || 'moderated',
                createdAt: question.createdAt,
                publishedAt: new Date().toISOString()
            };
            publishedQAs.push(publishedQA);
            break;
        case 'route-to-expert':
            question.moderationFlags.push('expert-review-required');
            break;
    }

    return question;
}

// ===== PUBLISHED Q&As (Knowledge Base) =====
export function getPublishedQAs(filters: any = {}) {
    let result = [...publishedQAs];
    if (filters.category) result = result.filter(qa => qa.category === filters.category);
    if (filters.search) {
        const term = filters.search.toLowerCase();
        result = result.filter(qa =>
            qa.question.toLowerCase().includes(term) ||
            qa.answer.toLowerCase().includes(term) ||
            qa.tags.some(t => t.toLowerCase().includes(term))
        );
    }
    return result.sort((a, b) => b.helpfulCount - a.helpfulCount);
}

export function getPublishedQABySlug(slug) {
    return publishedQAs.find(qa => qa.slug === slug) || null;
}

// ===== MYTHS =====
export function getMyths() {
    return mythsData;
}

// ===== LEARNING PATHS =====
export function getPaths() {
    return pathsData;
}

// ===== JOURNAL =====
export function createJournalEntry({ sessionTokenHash, entryText, moodTag, prompt }) {
    const entry = {
        id: `j-${Date.now()}`,
        sessionTokenHash,
        entryText,
        moodTag,
        prompt: prompt || null,
        createdAt: new Date().toISOString()
    };
    journalEntries.push(entry);
    return entry;
}

export function getJournalEntries(sessionTokenHash) {
    return journalEntries
        .filter(e => e.sessionTokenHash === sessionTokenHash)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function deleteJournalEntries(sessionTokenHash) {
    journalEntries = journalEntries.filter(e => e.sessionTokenHash !== sessionTokenHash);
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
    { id: 'cp-7', text: "How satisfied are you with the quality of time you spent together this week?", type: 'scale' }
];

const conversationScripts = [
    { id: 'cs-1', title: "Expressing a Need", script: "I've been feeling [emotion] lately, and I think it's because I need more [need]. Can we talk about how we might make that happen?", category: 'needs' },
    { id: 'cs-2', title: "Setting a Boundary", script: "I care about us, and I want to be honest. I'm not comfortable with [situation]. It would mean a lot if we could [alternative].", category: 'boundaries' },
    { id: 'cs-3', title: "Initiating Intimacy Conversation", script: "I've been thinking about our intimacy, and I'd love for us to talk about what feels good for both of us. There's no pressure — I just want us to feel closer.", category: 'intimacy' },
    { id: 'cs-4', title: "Checking In After Conflict", script: "I know we had a disagreement about [topic]. I want to understand your perspective better. Can you help me see how you felt?", category: 'conflict' },
    { id: 'cs-5', title: "Appreciating Your Partner", script: "I wanted to tell you that I really appreciate how you [specific action]. It made me feel [emotion], and I'm grateful to have you.", category: 'appreciation' },
    { id: 'cs-6', title: "Discussing Consent", script: "I love being close to you. I want to make sure we're both always comfortable. How do you feel about us checking in with each other more during intimate moments?", category: 'consent' }
];

export function getCouplesPrompts() {
    // Return random 5 prompts
    const shuffled = [...couplesPrompts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
}

export function getConversationScripts() {
    return conversationScripts;
}

export function submitCouplesCheckin({ sessionTokenHash, responses }) {
    const checkin = {
        id: `cc-${Date.now()}`,
        sessionTokenHash,
        responses,
        createdAt: new Date().toISOString()
    };
    couplesCheckins.push(checkin);

    // Generate recommendations based on responses
    const recommendations = generateCouplesRecommendations(responses);
    return { checkin, recommendations };
}

function generateCouplesRecommendations(responses) {
    const recs = [];
    const avgScore = responses.filter(r => r.type === 'scale').reduce((sum, r) => sum + r.value, 0) /
        Math.max(1, responses.filter(r => r.type === 'scale').length);

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
export function createConsult({ sessionTokenHash, topic, urgency, expertType, message }) {
    const consult = {
        id: `con-${Date.now()}`,
        sessionTokenHash,
        topic,
        urgency,
        expertType,
        message,
        status: 'pending', // pending | paid | scheduled | completed
        createdAt: new Date().toISOString()
    };
    consults.push(consult);
    return consult;
}

export function getConsults(sessionTokenHash) {
    return consults
        .filter(c => c.sessionTokenHash === sessionTokenHash)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
