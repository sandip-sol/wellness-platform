'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/kit/Badge';
import Button from '@/components/kit/Button';
import Alert from '@/components/kit/Alert';

export default function QAPage() {
    const { slug } = useParams();
    const [qa, setQa] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQA();
    }, [slug]);

    const fetchQA = async () => {
        try {
            const res = await fetch(`/api/kb?slug=${slug}`);
            if (res.ok) {
                const data = await res.json();
                setQa(data.qa);
                setRelated(data.related || []);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading...</div>;
    if (!qa) return <div style={{ padding: '5rem', textAlign: 'center' }}><h2>Not Found</h2><Button href="/kb">Browse Knowledge Base</Button></div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-12) var(--space-6)' }}>
            <Link href="/kb" style={{ color: 'var(--color-ink-muted)', fontSize: 'var(--font-size-sm)', display: 'inline-block', marginBottom: 'var(--space-6)' }}>← Back to Knowledge Base</Link>

            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Badge variant="category" label={qa.category} />
                <Badge variant={qa.reviewBadge || 'moderated'} />
            </div>

            <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-8)', lineHeight: 'var(--line-height-tight)' }}>{qa.question}</h1>

            <div style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', border: '1px solid var(--color-border-light)', marginBottom: 'var(--space-6)', lineHeight: 'var(--line-height-relaxed)', fontSize: 'var(--font-size-base)' }}>
                {qa.answer}
            </div>

            {qa.whenToSeekHelp && (
                <Alert variant="warning" title="When to Seek Professional Help">
                    {qa.whenToSeekHelp}
                </Alert>
            )}

            {qa.emergencyRedFlags && (
                <div style={{ marginTop: 'var(--space-4)' }}>
                    <Alert variant="danger" title="Emergency Red Flags">{qa.emergencyRedFlags}</Alert>
                </div>
            )}

            <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-ink-muted)' }}>
                <span>👍 {qa.helpfulCount} found this helpful</span>
                {qa.tags && qa.tags.map(t => <Badge key={t} variant="category" label={t} />)}
            </div>

            <Alert variant="disclaimer" title="Disclaimer" icon="📋">
                This content is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
            </Alert>

            <div style={{ marginTop: 'var(--space-8)', textAlign: 'center' }}>
                <Button href="/ask">Have a follow up? Ask Anonymously →</Button>
            </div>

            {related.length > 0 && (
                <div style={{ marginTop: 'var(--space-12)', paddingTop: 'var(--space-8)', borderTop: '1px solid var(--color-border-light)' }}>
                    <h3 style={{ marginBottom: 'var(--space-6)' }}>Related Questions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {related.map(r => (
                            <Link key={r.id} href={`/kb/${r.slug}`} style={{ padding: 'var(--space-4)', background: 'var(--color-bg-card)', border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-lg)', textDecoration: 'none', color: 'var(--color-ink)', fontSize: 'var(--font-size-sm)', display: 'block' }}>
                                {r.question}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
