import { NextResponse } from 'next/server';
import { saveSurveyResults, getSurveyResults, generateSurveyRecommendations } from '@/lib/store';
import { hashToken } from '@/lib/session';

export async function POST(req: Request) {
    try {
        const { sessionToken, answers } = await req.json();
        const sessionTokenHash = sessionToken ? hashToken(sessionToken) : 'anonymous';

        if (!answers || !Array.isArray(answers)) {
            return NextResponse.json({ error: 'Invalid survey data' }, { status: 400 });
        }

        const recommendations = generateSurveyRecommendations(answers);
        await saveSurveyResults({ sessionTokenHash, answers, recommendations });

        return NextResponse.json({ recommendations, saved: true });
    } catch (err) {
        console.error('Survey POST error:', err);
        return NextResponse.json({ error: 'Failed to save survey' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionToken = searchParams.get('token');
        const sessionTokenHash = sessionToken ? hashToken(sessionToken) : 'anonymous';
        const results = await getSurveyResults(sessionTokenHash);
        return NextResponse.json({ results });
    } catch (err) {
        console.error('Survey GET error:', err);
        return NextResponse.json({ results: null });
    }
}
