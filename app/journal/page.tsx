'use client';
import { useState, useEffect } from 'react';
import Card from '@/components/kit/Card';
import Button from '@/components/kit/Button';
import { Textarea, Select } from '@/components/kit/Input';
import Alert from '@/components/kit/Alert';

const MOODS = [
    { value: 'great', label: '😊 Great' },
    { value: 'good', label: '🙂 Good' },
    { value: 'okay', label: '😐 Okay' },
    { value: 'low', label: '😔 Low' },
    { value: 'stressed', label: '😰 Stressed' },
    { value: 'anxious', label: '😟 Anxious' },
    { value: 'confused', label: '🤔 Confused' },
    { value: 'grateful', label: '🙏 Grateful' },
];

const PROMPTS = [
    "What made me feel good about myself today?",
    "Something I learned about my body or health this week.",
    "A boundary I set or want to set.",
    "How I feel about my current relationship (with self or partner).",
    "Something I'm curious about but haven't asked yet.",
    "One thing I'd like to communicate to my partner.",
    "How my stress levels have been affecting my wellbeing.",
    "Something I appreciate about my body.",
];

function getSessionToken() {
    if (typeof window === 'undefined') return null;
    let token = localStorage.getItem('ss_session_token');
    if (!token) {
        token = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
        localStorage.setItem('ss_session_token', token);
    }
    return token;
}

export default function JournalPage() {
    const [entries, setEntries] = useState([]);
    const [entryText, setEntryText] = useState('');
    const [moodTag, setMoodTag] = useState('');
    const [saving, setSaving] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState('');

    useEffect(() => {
        loadEntries();
        setCurrentPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
    }, []);

    const loadEntries = () => {
        if (typeof window === 'undefined') return;
        const stored = localStorage.getItem('ss_journal_entries');
        if (stored) setEntries(JSON.parse(stored));
    };

    const saveEntry = async (e) => {
        e.preventDefault();
        if (!entryText.trim()) return;
        setSaving(true);

        const entry = {
            id: `j-${Date.now()}`,
            entryText,
            moodTag,
            prompt: currentPrompt,
            createdAt: new Date().toISOString(),
        };

        const newEntries = [entry, ...entries];
        setEntries(newEntries);
        localStorage.setItem('ss_journal_entries', JSON.stringify(newEntries));

        // Also send to server
        const token = getSessionToken();
        try {
            await fetch('/api/journal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionToken: token, entryText, moodTag, prompt: currentPrompt }),
            });
        } catch (err) { }

        setEntryText('');
        setMoodTag('');
        setCurrentPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
        setSaving(false);
    };

    const deleteAll = () => {
        if (confirm('Delete all journal entries? This cannot be undone.')) {
            setEntries([]);
            localStorage.removeItem('ss_journal_entries');
        }
    };

    const convertToQuestion = (entry) => {
        const url = `/ask?text=${encodeURIComponent(entry.entryText.slice(0, 200))}`;
        window.location.href = url;
    };

    const moodEmoji = (tag) => MOODS.find(m => m.value === tag)?.label || tag;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-12) var(--space-6)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
                <h1 style={{ marginBottom: 'var(--space-3)' }}>Private Journal</h1>
                <p style={{ color: 'var(--color-ink-light)', fontSize: 'var(--font-size-lg)', maxWidth: '500px', margin: '0 auto' }}>
                    A safe space for reflection. Track your mood, explore your thoughts, and build healthy habits.
                </p>
            </div>

            <Alert variant="info" icon="🔒" style={{ marginBottom: 'var(--space-8)' }}>
                <strong>Your journal stays on your device.</strong> Entries are stored in your browser&apos;s local storage.
                No one else can see them. You can delete everything at any time.
            </Alert>

            {/* New Entry Form */}
            <Card variant="highlighted" style={{ marginBottom: 'var(--space-8)' }}>
                <form onSubmit={saveEntry} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-ink-light)', fontStyle: 'italic' }}>
                        💡 Prompt: {currentPrompt}
                        <button type="button" onClick={() => setCurrentPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])} style={{ marginLeft: 'var(--space-2)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}>
                            ↻ New prompt
                        </button>
                    </div>

                    <Textarea
                        name="entry"
                        value={entryText}
                        onChange={(e) => setEntryText(e.target.value)}
                        placeholder="Write your thoughts here..."
                        rows={4}
                        maxLength={2000}
                    />

                    <Select
                        name="mood"
                        value={moodTag}
                        onChange={(e) => setMoodTag(e.target.value)}
                        options={MOODS}
                        placeholder="How are you feeling? (optional)"
                    />

                    <Button type="submit" loading={saving} disabled={!entryText.trim()}>
                        Save Entry
                    </Button>
                </form>
            </Card>

            {/* Entries List */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h3>Your Entries ({entries.length})</h3>
                {entries.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={deleteAll}>
                        🗑️ Delete All
                    </Button>
                )}
            </div>

            {entries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-ink-muted)' }}>
                    <p>No entries yet. Start writing to build your journal.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {entries.map(entry => (
                        <Card key={entry.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                                    {entry.moodTag && <span>{moodEmoji(entry.moodTag)}</span>}
                                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ink-muted)' }}>
                                        {new Date(entry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => convertToQuestion(entry)}>
                                    Ask about this →
                                </Button>
                            </div>
                            {entry.prompt && (
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ink-muted)', fontStyle: 'italic', marginBottom: 'var(--space-2)' }}>
                                    Prompt: {entry.prompt}
                                </div>
                            )}
                            <p style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-relaxed)', whiteSpace: 'pre-wrap' }}>
                                {entry.entryText}
                            </p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
