'use client';
import { useState, useEffect } from 'react';
import Card, { CardHeader, CardDescription } from '@/components/kit/Card';
import Button from '@/components/kit/Button';
import Alert from '@/components/kit/Alert';

function getSessionToken() {
    if (typeof window === 'undefined') return null;
    let token = localStorage.getItem('ss_session_token');
    if (!token) {
        token = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
        localStorage.setItem('ss_session_token', token);
    }
    return token;
}

export default function CouplesPage() {
    const [phase, setPhase] = useState('intro'); // intro | checkin | results | scripts
    const [prompts, setPrompts] = useState([]);
    const [scripts, setScripts] = useState([]);
    const [responses, setResponses] = useState([]);
    const [results, setResults] = useState(null);
    const [currentQ, setCurrentQ] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/couples');
            const data = await res.json();
            setPrompts(data.prompts || []);
            setScripts(data.scripts || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAnswer = (value) => {
        const prompt = prompts[currentQ];
        const newResponses = [...responses, { promptId: prompt.id, type: prompt.type, value }];
        setResponses(newResponses);

        if (currentQ < prompts.length - 1) {
            setCurrentQ(currentQ + 1);
        } else {
            submitCheckin(newResponses);
        }
    };

    const submitCheckin = async (allResponses) => {
        const token = getSessionToken();
        try {
            const res = await fetch('/api/couples', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionToken: token, responses: allResponses }),
            });
            const data = await res.json();
            setResults(data);
            setPhase('results');
        } catch (err) { console.error(err); }
    };

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-12) var(--space-6)' }}>
            {phase === 'intro' && (
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ marginBottom: 'var(--space-3)' }}>Couples Check-in</h1>
                    <p style={{ color: 'var(--color-ink-light)', fontSize: 'var(--font-size-lg)', maxWidth: '500px', margin: '0 auto var(--space-8)' }}>
                        A 2-minute weekly check-in to strengthen your relationship. Completely private.
                    </p>

                    <Card variant="highlighted" style={{ textAlign: 'left', marginBottom: 'var(--space-8)' }}>
                        <CardHeader icon="💑" title="How It Works" />
                        <CardDescription>
                            Answer {prompts.length} quick questions about your week. Based on your responses, we&apos;ll suggest
                            conversation scripts, micro-actions, and learning resources tailored to where you are right now.
                        </CardDescription>
                    </Card>

                    <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button onClick={() => setPhase('checkin')} size="lg">Start Check-in →</Button>
                        <Button onClick={() => setPhase('scripts')} variant="outline" size="lg">View Conversation Scripts</Button>
                    </div>
                </div>
            )}

            {phase === 'checkin' && prompts[currentQ] && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ink-muted)', marginBottom: 'var(--space-4)' }}>
                        Question {currentQ + 1} of {prompts.length}
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'var(--color-bg-alt)', borderRadius: '2px', marginBottom: 'var(--space-8)' }}>
                        <div style={{ width: `${((currentQ + 1) / prompts.length) * 100}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '2px', transition: 'width 0.3s ease' }} />
                    </div>

                    <h2 style={{ marginBottom: 'var(--space-8)', fontSize: 'var(--font-size-2xl)' }}>
                        {prompts[currentQ].text}
                    </h2>

                    {prompts[currentQ].type === 'scale' ? (
                        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {[1, 2, 3, 4, 5].map(n => (
                                <button key={n} onClick={() => handleAnswer(n)} style={{
                                    width: '64px', height: '64px', borderRadius: '50%', border: '2px solid var(--color-border)',
                                    background: 'var(--color-bg-card)', cursor: 'pointer', fontSize: 'var(--font-size-xl)',
                                    fontWeight: 700, transition: 'all 0.2s ease', fontFamily: 'var(--font-heading)'
                                }}>
                                    {n}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
                            <Button onClick={() => handleAnswer(true)} size="lg">Yes</Button>
                            <Button onClick={() => handleAnswer(false)} variant="outline" size="lg">No</Button>
                        </div>
                    )}
                </div>
            )}

            {phase === 'results' && results && (
                <div>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>✨</div>
                        <h2>Your Weekly Insights</h2>
                        <p style={{ color: 'var(--color-ink-light)', marginTop: 'var(--space-2)' }}>
                            Based on your check-in, here are some suggestions for this week.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {results.recommendations.map((rec, idx) => (
                            <Card key={idx} variant="trust">
                                <CardHeader
                                    icon={rec.type === 'action' ? '⚡' : rec.type === 'script' ? '💬' : '📖'}
                                    title={rec.type === 'action' ? 'Micro-Action' : rec.type === 'script' ? 'Conversation Starter' : 'Recommended Learning'}
                                />
                                <CardDescription>{rec.text || (rec.scriptId && scripts.find(s => s.id === rec.scriptId)?.script) || ''}</CardDescription>
                            </Card>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', marginTop: 'var(--space-8)' }}>
                        <Button onClick={() => { setPhase('intro'); setCurrentQ(0); setResponses([]); setResults(null); fetchData(); }} variant="outline">
                            Take Again
                        </Button>
                        <Button href="/journal">Journal About This →</Button>
                    </div>
                </div>
            )}

            {phase === 'scripts' && (
                <div>
                    <button onClick={() => setPhase('intro')} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-ink-muted)', fontSize: 'var(--font-size-sm)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 'var(--space-6)' }}>
                        ← Back
                    </button>
                    <h2 style={{ marginBottom: 'var(--space-6)' }}>Conversation Scripts</h2>
                    <p style={{ color: 'var(--color-ink-light)', marginBottom: 'var(--space-8)' }}>
                        Ready-to-use phrases to help you start important conversations with your partner.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {scripts.map(s => (
                            <Card key={s.id} variant="trust">
                                <CardHeader title={s.title} />
                                <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-relaxed)', fontStyle: 'italic', color: 'var(--color-ink-light)' }}>
                                    &ldquo;{s.script}&rdquo;
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
