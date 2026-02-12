import { NextResponse } from 'next/server';
import { getMyths } from '@/lib/store';

export async function GET() {
    const myths = getMyths();
    return NextResponse.json({ myths });
}
