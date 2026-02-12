import { NextResponse } from 'next/server';
import { createConsult } from '@/lib/store';
import { hashToken } from '@/lib/session';

export async function POST(request) {
    try {
        const body = await request.json();
        const { sessionToken, topic, urgency, expertType, message } = body;

        if (!topic || !expertType || !message) {
            return NextResponse.json({ error: 'Topic, expert type, and message are required.' }, { status: 400 });
        }

        const sessionTokenHash = sessionToken ? hashToken(sessionToken) : 'anonymous';
        const consult = createConsult({
            sessionTokenHash,
            topic,
            urgency: urgency || 'normal',
            expertType,
            message,
        });

        return NextResponse.json({
            consult,
            message: 'Your consultation request has been submitted. An expert will respond within 24-48 hours.',
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create consultation request.' }, { status: 500 });
    }
}
