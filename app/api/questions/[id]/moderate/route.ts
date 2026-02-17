import { NextResponse } from 'next/server';
import { moderateQuestion, getModerationQueue } from '@/lib/store';
import { verifyAdminRequest } from '@/lib/admin-auth';

export async function POST(request, { params }) {
    // Auth check
    if (!verifyAdminRequest(request)) {
        return NextResponse.json({ error: 'Unauthorized. Admin login required.' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const { action, editedText, answer, tags, reviewBadge, routeToExpert } = body;

        if (!action) {
            return NextResponse.json({ error: 'Action is required.' }, { status: 400 });
        }

        const question = await moderateQuestion(id, { action, editedText, answer, tags, reviewBadge, routeToExpert });

        if (!question) {
            return NextResponse.json({ error: 'Question not found.' }, { status: 404 });
        }

        return NextResponse.json({ question });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to moderate.' }, { status: 500 });
    }
}

export async function GET(request) {
    // Auth check
    if (!verifyAdminRequest(request)) {
        return NextResponse.json({ error: 'Unauthorized. Admin login required.' }, { status: 401 });
    }

    const queue = await getModerationQueue();
    return NextResponse.json({ queue });
}
