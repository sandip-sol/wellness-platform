import { NextResponse } from 'next/server';
import { getCouplesPrompts, getConversationScripts, submitCouplesCheckin } from '@/lib/store';
import { hashToken } from '@/lib/session';

export async function GET() {
    const prompts = getCouplesPrompts();
    const scripts = getConversationScripts();
    return NextResponse.json({ prompts, scripts });
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { sessionToken, responses } = body;

        if (!responses || !Array.isArray(responses) || responses.length === 0) {
            return NextResponse.json({ error: 'Responses are required.' }, { status: 400 });
        }

        const sessionTokenHash = sessionToken ? hashToken(sessionToken) : 'anonymous';
        const result = await submitCouplesCheckin({ sessionTokenHash, responses });

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to submit check-in.' }, { status: 500 });
    }
}
