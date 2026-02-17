import { NextResponse } from 'next/server';
import { addFollowUp } from '@/lib/store';
import { processSafetyPipeline } from '@/lib/safety';
import { hashToken } from '@/lib/session';

export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { text, sessionToken } = body;

        if (!text || text.length < 5) {
            return NextResponse.json({ error: 'Follow-up must be at least 5 characters.' }, { status: 400 });
        }

        const safety = processSafetyPipeline(text, '');
        if (!safety.policyResult.allowed) {
            return NextResponse.json({ error: safety.policyResult.reason, blocked: true }, { status: 403 });
        }

        const sessionTokenHash = sessionToken ? hashToken(sessionToken) : 'anonymous';
        const followUp = await addFollowUp(id, { text: safety.cleanText, sessionTokenHash });

        if (!followUp) {
            return NextResponse.json({ error: 'Question not found.' }, { status: 404 });
        }

        return NextResponse.json({ followUp }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add follow-up.' }, { status: 500 });
    }
}
