import { NextResponse } from 'next/server';
import { createQuestion, getQuestions, getPublishedQAs } from '@/lib/store';
import { processSafetyPipeline } from '@/lib/safety';
import { hashToken } from '@/lib/session';

export async function POST(request) {
    try {
        const body = await request.json();
        const { category, tags, text, context, sessionToken } = body;

        if (!text || !category) {
            return NextResponse.json(
                { error: 'Question text and category are required.' },
                { status: 400 }
            );
        }

        if (text.length < 10) {
            return NextResponse.json(
                { error: 'Question must be at least 10 characters long.' },
                { status: 400 }
            );
        }

        if (text.length > 1000) {
            return NextResponse.json(
                { error: 'Question must be under 1000 characters.' },
                { status: 400 }
            );
        }

        // Run safety pipeline
        const safety = processSafetyPipeline(text, category);

        if (!safety.policyResult.allowed) {
            return NextResponse.json(
                { error: safety.policyResult.reason, blocked: true },
                { status: 403 }
            );
        }

        const sessionTokenHash = sessionToken ? hashToken(sessionToken) : 'anonymous';

        const question = await createQuestion({
            category,
            tags: tags || [],
            text: safety.cleanText,
            context: context || {},
            sessionTokenHash,
        });

        // Add safety metadata
        const enrichedQuestion = {
            ...question,
            safetyRoute: safety.route,
            piiRedacted: safety.piiFound.length > 0,
        };

        return NextResponse.json({
            question: enrichedQuestion,
            safetyNote: safety.route === 'see-clinician'
                ? 'Your question may relate to a health concern. We recommend consulting a healthcare provider.'
                : safety.route === 'abuse-risk'
                    ? 'If you or someone you know is in danger, please contact Women Helpline (181) or Police (100) immediately.'
                    : null,
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create question.' }, { status: 500 });
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const type = searchParams.get('type');

    if (type === 'published') {
        const qas = await getPublishedQAs({
            category: category || undefined,
            search: searchParams.get('search') || undefined,
        });
        return NextResponse.json({ questions: qas });
    }

    const questions = await getQuestions({
        status: status || undefined,
        category: category || undefined,
    });
    return NextResponse.json({ questions });
}
