import { NextResponse } from 'next/server';
import { signAdminToken, getAdminPassword, COOKIE_NAME } from '@/lib/admin-auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { password } = body;

        const adminPassword = getAdminPassword();
        if (!adminPassword) {
            return NextResponse.json(
                { error: 'Admin password not configured on server.' },
                { status: 500 }
            );
        }

        if (!password || password !== adminPassword) {
            return NextResponse.json(
                { error: 'Invalid password.' },
                { status: 401 }
            );
        }

        const token = signAdminToken();
        const response = NextResponse.json({ success: true });

        response.cookies.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60, // 24 hours
        });

        return response;
    } catch {
        return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
    }
}
