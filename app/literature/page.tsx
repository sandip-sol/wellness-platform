'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import literatureData from '@/data/literature.json';
import { SectionTitle } from '@/components/ws/WsDivider';
import Alert from '@/components/kit/Alert';

export default function LiteraturePage() {
    const [ageConfirmed, setAgeConfirmed] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const confirmed = localStorage.getItem('ss-age-confirmed');
        if (confirmed === 'true') setAgeConfirmed(true);
        setChecking(false);
    }, []);

    const handleConfirmAge = () => {
        localStorage.setItem('ss-age-confirmed', 'true');
        setAgeConfirmed(true);
    };

    if (checking) {
        return (
            <main className="bg-background min-h-screen pt-28 pb-20">
                <div className="max-w-3xl mx-auto px-6 text-center text-muted-foreground">Loading…</div>
            </main>
        );
    }

    /* ---------- AGE GATE MODAL ---------- */
    if (!ageConfirmed) {
        return (
            <main className="bg-background min-h-screen flex items-center justify-center px-6">
                <div className="max-w-md w-full rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
                    <span className="text-4xl">📜</span>
                    <h1 className="mt-4 font-serif text-2xl text-warm-charcoal">
                        Ancient Literature Library
                    </h1>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        This section contains scholarly discussion of ancient Indian texts on intimacy and wellness.
                        Content is presented in an academic context and is intended for adults aged 18 and above.
                    </p>

                    <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-left text-sm text-amber-900">
                        <strong>⚠️ Content Notice</strong>
                        <p className="mt-1">
                            These texts discuss topics related to sexuality, relationships, and the human body.
                            All content is framed through a wellness and academic lens — not eroticization.
                        </p>
                    </div>

                    <button
                        onClick={handleConfirmAge}
                        className="mt-6 w-full bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground font-semibold px-7 py-3.5 rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        I am 18+ — Enter Library
                    </button>

                    <Link
                        href="/"
                        className="mt-3 block text-sm text-muted-foreground hover:underline"
                    >
                        ← Go back to homepage
                    </Link>
                </div>
            </main>
        );
    }

    /* ---------- LIBRARY GRID ---------- */
    return (
        <main className="bg-background min-h-screen pt-28 pb-20">
            <div className="max-w-5xl mx-auto px-6 lg:px-8">
                <SectionTitle
                    eyebrow="Cultural Wisdom"
                    heading="Ancient Literature Library"
                    subtitle="Scholarly, responsibly framed explorations of India's classical texts on intimacy, wellness, and the art of living."
                    align="center"
                    headingAs="h1"
                    className="mb-6 animate-fade-up"
                />

                {/* Global disclaimer */}
                <div className="max-w-2xl mx-auto mb-10">
                    <Alert variant="disclaimer" title="Important Disclaimer" icon="📋">
                        All content in this section is presented for educational and historical purposes only.
                        It is drawn from peer-reviewed scholarship and is not intended as instructional material for sexual activity.
                        This platform does not endorse any specific sexual practices.
                    </Alert>
                </div>

                {/* Literature cards */}
                <div className="grid sm:grid-cols-2 gap-6">
                    {literatureData.map((entry) => (
                        <Link
                            key={entry.id}
                            href={`/literature/${entry.slug}`}
                            className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/60 hover:shadow-md"
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                    style={{ backgroundColor: entry.coverColor + '18' }}
                                >
                                    {entry.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-serif text-lg text-warm-charcoal group-hover:text-primary transition-colors">
                                        {entry.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {entry.author} · {entry.era}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-warm-secondary leading-relaxed line-clamp-3">
                                {entry.subtitle} — {entry.summary.slice(0, 150).trimEnd()}…
                            </p>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                                    {entry.tradition}
                                </span>
                                <span className="text-sm font-semibold text-warm-charcoal group-hover:text-primary transition-colors">
                                    Read →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer note */}
                <div className="max-w-lg mx-auto mt-10 rounded-2xl bg-card p-6 text-sm text-muted-foreground text-center">
                    📚 More texts will be added as they undergo expert review and responsible framing.
                    Suggestions welcome via the feedback form.
                </div>
            </div>
        </main>
    );
}
