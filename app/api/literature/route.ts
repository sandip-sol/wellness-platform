import { NextResponse } from 'next/server';
import literatureData from '@/data/literature.json';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
        const entry = literatureData.find((l: any) => l.slug === slug);
        if (!entry) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        return NextResponse.json({ entry });
    }

    return NextResponse.json({ entries: literatureData });
}
