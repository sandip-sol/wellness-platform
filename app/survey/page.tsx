'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import surveyData from '@/data/onboarding-survey.json';
import { SectionTitle } from '@/components/ws/WsDivider';

function getSessionToken() {
    if (typeof window === 'undefined') return null;
    let token = localStorage.getItem('ss_session_token');
    if (!token) {
        token = Array.from(crypto.getRandomValues(new Uint8Array(32)),
            b => b.toString(16).padStart(2, '0')).join('');
        localStorage.setItem('ss_session_token', token);
    }
    return token;
}

type Answer = { questionId: string; value: string | string[] };

export default function SurveyPage() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [multiSelections, setMultiSelections] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [existingResults, setExistingResults] = useState<any>(null);

    const questions = surveyData.questions;
    const totalSteps = questions.length;
    const currentQ = questions[step];

    // Check for existing results
    useEffect(() => {
        const token = getSessionToken();
        fetch(`/api/survey?token=${token}`)
            .then(res => res.json())
            .then(data => {
                if (data.results) setExistingResults(data.results);
            })
            .catch(() => { });
    }, []);

    const handleSingleSelect = (value: string) => {
        const updated = [...answers, { questionId: currentQ.id, value }];
        setAnswers(updated);

        if (step < totalSteps - 1) {
            setStep(step + 1);
        } else {
            submitSurvey(updated);
        }
    };

    const handleMultiToggle = (value: string) => {
        const maxSel = (currentQ as any).maxSelections || 3;
        if (multiSelections.includes(value)) {
            setMultiSelections(multiSelections.filter(v => v !== value));
        } else if (multiSelections.length < maxSel) {
            setMultiSelections([...multiSelections, value]);
        }
    };

    const handleMultiConfirm = () => {
        const updated = [...answers, { questionId: currentQ.id, value: multiSelections }];
        setAnswers(updated);
        setMultiSelections([]);

        if (step < totalSteps - 1) {
            setStep(step + 1);
        } else {
            submitSurvey(updated);
        }
    };

    const submitSurvey = async (finalAnswers: Answer[]) => {
        setSubmitting(true);
        try {
            const token = getSessionToken();
            const res = await fetch('/api/survey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionToken: token, answers: finalAnswers }),
            });
            const data = await res.json();
            setResults(data.recommendations);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRetake = () => {
        setStep(0);
        setAnswers([]);
        setMultiSelections([]);
        setResults(null);
        setExistingResults(null);
    };

    /* ---------- RESULTS PAGE ---------- */
    const displayResults = results || existingResults?.recommendations;
    if (displayResults) {
        return (
            <main className="bg-background min-h-screen pt-28 pb-20">
                <div className="max-w-3xl mx-auto px-6 lg:px-8">
                    <SectionTitle
                        eyebrow="Your Personalized Roadmap"
                        heading="Here's what we recommend"
                        subtitle="Based on your responses, these paths, topics, and tools are tailored for you."
                        align="center"
                        headingAs="h1"
                        className="mb-10 animate-fade-up"
                    />

                    {/* Recommended Paths */}
                    {displayResults.paths && displayResults.paths.length > 0 && (
                        <div className="mb-8">
                            <h2 className="font-serif text-xl text-warm-charcoal mb-4">🗺️ Recommended Learning Paths</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {displayResults.paths.map((p: any) => (
                                    <Link
                                        key={p.id}
                                        href="/paths"
                                        className="rounded-2xl border border-border bg-card p-5 hover:border-primary/60 transition-all"
                                    >
                                        <span className="text-2xl">{p.icon}</span>
                                        <h3 className="mt-2 font-serif text-base text-warm-charcoal">{p.title}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommended Categories */}
                    {displayResults.categories && displayResults.categories.length > 0 && (
                        <div className="mb-8">
                            <h2 className="font-serif text-xl text-warm-charcoal mb-4">📂 Topics For You</h2>
                            <div className="flex flex-wrap gap-3">
                                {displayResults.categories.map((c: any) => (
                                    <Link
                                        key={c.id}
                                        href="/kb"
                                        className="px-4 py-2 rounded-full border border-border bg-card text-sm hover:border-primary/60 transition-all"
                                    >
                                        {c.icon} {c.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommended Features */}
                    {displayResults.features && displayResults.features.length > 0 && (
                        <div className="mb-8">
                            <h2 className="font-serif text-xl text-warm-charcoal mb-4">✨ Try These Features</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {displayResults.features.map((f: any, i: number) => (
                                    <Link
                                        key={i}
                                        href={f.href}
                                        className="rounded-2xl border border-border bg-card p-5 hover:border-primary/60 transition-all"
                                    >
                                        <h3 className="font-serif text-base text-warm-charcoal">{f.title}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Level note */}
                    {displayResults.level && (
                        <div className="rounded-2xl bg-card border border-border p-5 mb-8 text-center">
                            <p className="text-sm text-muted-foreground">
                                We'll tailor content to the <strong className="text-warm-charcoal">{displayResults.level}</strong> level. You can always explore other levels too.
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground font-semibold px-7 py-3.5 rounded-full text-sm transition-colors"
                        >
                            Start Exploring →
                        </Link>
                        <button
                            onClick={handleRetake}
                            className="inline-flex items-center justify-center gap-2 border border-border bg-card font-semibold px-7 py-3.5 rounded-full text-sm transition-colors hover:bg-muted"
                        >
                            Retake Survey
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    /* ---------- SURVEY WIZARD ---------- */
    const progress = ((step + 1) / totalSteps) * 100;

    return (
        <main className="bg-background min-h-screen pt-28 pb-20">
            <div className="max-w-2xl mx-auto px-6 lg:px-8">
                <SectionTitle
                    eyebrow={`Question ${step + 1} of ${totalSteps}`}
                    heading={surveyData.title}
                    subtitle={step === 0 ? surveyData.description : undefined}
                    align="center"
                    headingAs="h1"
                    className="mb-8 animate-fade-up"
                />

                {/* Progress bar */}
                <div className="mb-8">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question card */}
                <div className="rounded-3xl border border-border bg-card p-8 animate-fade-up">
                    <h2 className="font-serif text-xl text-warm-charcoal mb-6 text-center">
                        {currentQ.text}
                    </h2>

                    {currentQ.type === 'single' && (
                        <div className="flex flex-col gap-3">
                            {currentQ.options.map((opt: any) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleSingleSelect(opt.value)}
                                    className="w-full text-left px-5 py-4 rounded-xl border border-border bg-background hover:border-primary/60 hover:bg-primary/5 transition-all text-sm font-medium"
                                >
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    )}

                    {currentQ.type === 'multi' && (
                        <>
                            <p className="text-sm text-muted-foreground text-center mb-4">
                                Select up to {(currentQ as any).maxSelections || 3}
                            </p>
                            <div className="flex flex-col gap-3">
                                {currentQ.options.map((opt: any) => {
                                    const selected = multiSelections.includes(opt.value);
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleMultiToggle(opt.value)}
                                            className={`w-full text-left px-5 py-4 rounded-xl border transition-all text-sm font-medium ${selected
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border bg-background hover:border-primary/60 hover:bg-primary/5'
                                                }`}
                                        >
                                            {selected ? '✓ ' : ''}{opt.text}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={handleMultiConfirm}
                                disabled={multiSelections.length === 0}
                                className="mt-6 w-full bg-primary hover:bg-[hsl(var(--primary-hover))] disabled:opacity-50 text-primary-foreground font-semibold px-7 py-3.5 rounded-full text-sm transition-colors"
                            >
                                Continue →
                            </button>
                        </>
                    )}
                </div>

                {/* Skip & navigation */}
                <div className="flex items-center justify-between mt-6">
                    {step > 0 ? (
                        <button
                            onClick={() => {
                                setAnswers(answers.slice(0, -1));
                                setStep(step - 1);
                            }}
                            className="text-sm text-muted-foreground hover:underline"
                        >
                            ← Back
                        </button>
                    ) : <span />}

                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:underline"
                    >
                        Skip — I'll explore on my own
                    </Link>
                </div>

                {submitting && (
                    <div className="text-center mt-8 text-muted-foreground">
                        Generating your personalized roadmap…
                    </div>
                )}
            </div>
        </main>
    );
}
