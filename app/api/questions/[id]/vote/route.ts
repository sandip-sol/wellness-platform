import { NextResponse } from 'next/server';
import { voteHelpful } from '@/lib/store';
import { hashToken } from '@/lib/session';

export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { sessionToken } = body;

        const sessionTokenHash = sessionToken ? hashToken(sessionToken) : 'anonymous';
        const success = await voteHelpful(id, sessionTokenHash);

        if (!success) {
            return NextResponse.json({ error: 'Already voted or question not found.' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to vote.' }, { status: 500 });
    }
}
