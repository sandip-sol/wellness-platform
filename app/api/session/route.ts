import { NextResponse } from 'next/server';
import { generateSessionToken, hashToken } from '@/lib/session';

export async function POST() {
    const token = generateSessionToken();
    const hash = hashToken(token);

    return NextResponse.json({
        token,
        hash,
        message: 'Anonymous session created. Store this token locally — it is your only way to access your data.'
    });
}
