import { NextResponse } from 'next/server';
import { createJournalEntry, getJournalEntries, deleteJournalEntries } from '@/lib/store';
import { hashToken } from '@/lib/session';

export async function POST(request) {
    try {
        const body = await request.json();
        const { sessionToken, entryText, moodTag, prompt } = body;

        if (!entryText || entryText.length < 3) {
            return NextResponse.json({ error: 'Entry text is required.' }, { status: 400 });
        }

        const sessionTokenHash = sessionToken ? hashToken(sessionToken) : 'anonymous';
        const entry = await createJournalEntry({ sessionTokenHash, entryText, moodTag, prompt });

        return NextResponse.json({ entry }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save journal entry.' }, { status: 500 });
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const sessionToken = searchParams.get('token');
    const sessionTokenHash = sessionToken ? hashToken(sessionToken) : 'anonymous';

    const entries = await getJournalEntries(sessionTokenHash);
    return NextResponse.json({ entries });
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const sessionToken = searchParams.get('token');
    const sessionTokenHash = sessionToken ? hashToken(sessionToken) : 'anonymous';

    await deleteJournalEntries(sessionTokenHash);
    return NextResponse.json({ success: true });
}
