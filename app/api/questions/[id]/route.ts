import { NextResponse } from 'next/server';
import { getQuestion, voteHelpful, moderateQuestion } from '@/lib/store';
import { hashToken } from '@/lib/session';

export async function GET(request, { params }) {
    const { id } = await params;
    const question = await getQuestion(id);

    if (!question) {
        return NextResponse.json({ error: 'Question not found.' }, { status: 404 });
    }

    return NextResponse.json({ question });
}
