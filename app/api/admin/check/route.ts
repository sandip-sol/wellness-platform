import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/admin-auth';

export async function GET(request: Request) {
    const authenticated = verifyAdminRequest(request);
    return NextResponse.json({ authenticated });
}
