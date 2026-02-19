import Link from 'next/link';
import { notFound } from 'next/navigation';
import literatureData from '@/data/literature.json';
import Badge from '@/components/kit/Badge';
import Alert from '@/components/kit/Alert';

// Dynamic metadata for SEO
export async function generateMetadata({ params }: any) {
    const { slug } = await params;
    const entry = literatureData.find((l: any) => l.slug === slug);
    if (!entry) return { title: 'Not Found — Safe Space' };

    return {
        title: `${entry.title} — Ancient Literature — Safe Space`,
        description: entry.summary.slice(0, 160),
        openGraph: {
            title: `${entry.title} — ${entry.subtitle}`,
            description: entry.summary.slice(0, 160),
            type: 'article',
        },
    };
}

export default async function LiteratureDetailPage({ params }: any) {
    const { slug } = await params;
    const entry = literatureData.find((l: any) => l.slug === slug);

    if (!entry) notFound();

    const otherTexts = literatureData.filter((l: any) => l.id !== entry.id);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-12) var(--space-6)' }}>
            <Link
                href="/literature"
                style={{
                    color: 'var(--color-ink-muted)',
                    fontSize: 'var(--font-size-sm)',
                    display: 'inline-block',
                    marginBottom: 'var(--space-6)',
                }}
            >
                ← Back to Literature Library
            </Link>

            {/* Header */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Badge variant="category" label={entry.tradition} />
                <Badge variant="moderated" label={entry.era} />
            </div>

            <h1 style={{
                fontSize: 'var(--font-size-3xl)',
                marginBottom: 'var(--space-2)',
                lineHeight: 'var(--line-height-tight)',
                fontFamily: 'var(--font-heading)',
            }}>
                <span style={{ marginRight: 'var(--space-3)' }}>{entry.icon}</span>
                {entry.title}
            </h1>

            <p style={{
                fontSize: 'var(--font-size-lg)',
                color: 'var(--color-ink-muted)',
                marginBottom: 'var(--space-2)',
                fontStyle: 'italic',
            }}>
                {entry.subtitle}
            </p>

            <p style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-ink-muted)',
                marginBottom: 'var(--space-8)',
            }}>
                By <strong>{entry.author}</strong> · {entry.era}
            </p>

            {/* Disclaimer */}
            <Alert variant="disclaimer" title="Content Disclaimer" icon="⚠️">
                {entry.disclaimer}
            </Alert>

            {/* Summary */}
            <div style={{
                marginTop: 'var(--space-8)',
                background: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8)',
                border: '1px solid var(--color-border-light)',
                lineHeight: 'var(--line-height-relaxed)',
                fontSize: 'var(--font-size-base)',
            }}>
                <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-4)', fontFamily: 'var(--font-heading)' }}>
                    Overview
                </h2>
                {entry.summary}
            </div>

            {/* Key Teachings */}
            <div style={{ marginTop: 'var(--space-8)' }}>
                <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-6)', fontFamily: 'var(--font-heading)' }}>
                    Key Teachings & Insights
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {entry.keyTeachings.map((teaching: any, i: number) => (
                        <div
                            key={i}
                            style={{
                                background: 'var(--color-bg-card)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 'var(--space-6)',
                                border: '1px solid var(--color-border-light)',
                            }}
                        >
                            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                                {teaching.title}
                            </h3>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-ink-light)', lineHeight: 'var(--line-height-relaxed)' }}>
                                {teaching.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modern Relevance */}
            <div style={{
                marginTop: 'var(--space-8)',
                background: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8)',
                border: '1px solid var(--color-border-light)',
            }}>
                <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-4)', fontFamily: 'var(--font-heading)' }}>
                    🌏 Modern Relevance
                </h2>
                <p style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-relaxed)' }}>
                    {entry.modernRelevance}
                </p>
            </div>

            {/* When to Seek Help */}
            {entry.whenToSeekHelp && (
                <div style={{ marginTop: 'var(--space-6)' }}>
                    <Alert variant="warning" title="When to Seek Professional Help">
                        {entry.whenToSeekHelp}
                    </Alert>
                </div>
            )}

            {/* Sources */}
            {entry.sources && entry.sources.length > 0 && (
                <div style={{
                    marginTop: 'var(--space-8)',
                    padding: 'var(--space-6)',
                    background: 'var(--color-bg-alt)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border-light)',
                }}>
                    <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
                        📚 Academic Sources
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {entry.sources.map((source: string, i: number) => (
                            <li key={i} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-ink-muted)', lineHeight: 'var(--line-height-relaxed)' }}>
                                • {source}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Related Texts */}
            {otherTexts.length > 0 && (
                <div style={{
                    marginTop: 'var(--space-12)',
                    paddingTop: 'var(--space-8)',
                    borderTop: '1px solid var(--color-border-light)',
                }}>
                    <h3 style={{ marginBottom: 'var(--space-6)' }}>Explore Other Texts</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {otherTexts.map((r: any) => (
                            <Link
                                key={r.id}
                                href={`/literature/${r.slug}`}
                                style={{
                                    padding: 'var(--space-4)',
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-border-light)',
                                    borderRadius: 'var(--radius-lg)',
                                    textDecoration: 'none',
                                    color: 'var(--color-ink)',
                                    fontSize: 'var(--font-size-sm)',
                                    display: 'block',
                                }}
                            >
                                {r.icon} <strong>{r.title}</strong> — {r.subtitle}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
