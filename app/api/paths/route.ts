import { NextResponse } from 'next/server';
import { getPaths } from '@/lib/store';

export async function GET() {
    const paths = getPaths();
    return NextResponse.json({ paths });
}
