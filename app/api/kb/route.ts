import { NextResponse } from 'next/server';
import { getPublishedQAs, getPublishedQABySlug } from '@/lib/store';
import { getCategories } from '@/lib/store';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    if (slug) {
        const qa = getPublishedQABySlug(slug);
        if (!qa) {
            return NextResponse.json({ error: 'Q&A not found.' }, { status: 404 });
        }
        // Get related QAs
        const related = getPublishedQAs({ category: qa.category })
            .filter(q => q.id !== qa.id)
            .slice(0, 4);
        return NextResponse.json({ qa, related });
    }

    const qas = getPublishedQAs({ category: category || undefined, search: search || undefined });
    const categories = getCategories();

    return NextResponse.json({ qas, categories });
}
