import { NextResponse } from 'next/server';
import { moderateQuestion, getModerationQueue } from '@/lib/store';

export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { action, editedText, answer, tags, reviewBadge, routeToExpert } = body;

        if (!action) {
            return NextResponse.json({ error: 'Action is required.' }, { status: 400 });
        }

        const question = moderateQuestion(id, { action, editedText, answer, tags, reviewBadge, routeToExpert });

        if (!question) {
            return NextResponse.json({ error: 'Question not found.' }, { status: 404 });
        }

        return NextResponse.json({ question });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to moderate.' }, { status: 500 });
    }
}

export async function GET() {
    const queue = getModerationQueue();
    return NextResponse.json({ queue });
}
