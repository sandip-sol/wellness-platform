'use client';
import { useState, useEffect } from 'react';
import Card, { CardHeader, CardDescription, CardFooter } from '@/components/kit/Card';
import Button from '@/components/kit/Button';
import Badge from '@/components/kit/Badge';
import { Textarea, Select } from '@/components/kit/Input';
import Alert from '@/components/kit/Alert';
import Tabs from '@/components/kit/Tabs';

export default function ModeratePage() {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [answerText, setAnswerText] = useState('');
    const [reviewBadge, setReviewBadge] = useState('moderated');
    const [editedText, setEditedText] = useState('');
    const [processing, setProcessing] = useState(false);
    const [allQuestions, setAllQuestions] = useState([]);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [modRes, allRes] = await Promise.all([
                fetch('/api/questions?status=pending'),
                fetch('/api/questions'),
            ]);
            const modData = await modRes.json();
            const allData = await allRes.json();
            setQueue(modData.questions || []);
            setAllQuestions(allData.questions || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleModerate = async (id, action) => {
        setProcessing(true);
        try {
            await fetch(`/api/questions/${id}/moderate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    answer: answerText || undefined,
                    editedText: editedText || undefined,
                    reviewBadge: reviewBadge || undefined,
                }),
            });
            setActiveQuestion(null);
            setAnswerText('');
            setEditedText('');
            fetchData();
        } catch (err) { console.error(err); }
        setProcessing(false);
    };

    const pendingItems = allQuestions.filter(q => q.status === 'pending');
    const approvedItems = allQuestions.filter(q => q.status === 'approved');
    const publishedItems = allQuestions.filter(q => q.status === 'published');
    const rejectedItems = allQuestions.filter(q => q.status === 'rejected');

    const renderQuestionList = (items, showActions = false) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-ink-muted)' }}>
                    No questions in this category.
                </div>
            ) : items.map(q => (
                <Card key={q.id} hoverable>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
                                <Badge variant={q.status} />
                                <Badge variant="category" label={q.category} />
                                {q.piiRedacted && <Badge variant="updated" label="PII Redacted" />}
                            </div>
                            <h4 style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--font-size-base)' }}>{q.text}</h4>
                            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ink-muted)' }}>
                                {new Date(q.createdAt).toLocaleDateString()} · {q.followUps?.length || 0} follow-ups
                            </span>
                        </div>
                        {showActions && (
                            <Button variant="outline" size="sm" onClick={() => { setActiveQuestion(q); setEditedText(q.text); }}>
                                Review →
                            </Button>
                        )}
                    </div>
                    {q.answer && (
                        <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-ink-light)' }}>
                            <strong>Answer:</strong> {q.answer.slice(0, 200)}...
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );

    const tabs = [
        {
            id: 'pending', label: `⏳ Pending (${pendingItems.length})`,
            content: renderQuestionList(pendingItems, true),
        },
        {
            id: 'approved', label: `✅ Approved (${approvedItems.length})`,
            content: renderQuestionList(approvedItems),
        },
        {
            id: 'published', label: `📢 Published (${publishedItems.length})`,
            content: renderQuestionList(publishedItems),
        },
        {
            id: 'rejected', label: `❌ Rejected (${rejectedItems.length})`,
            content: renderQuestionList(rejectedItems),
        },
    ];

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading moderation console...</div>;

    return (
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-12) var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
                <div>
                    <h1 style={{ marginBottom: 'var(--space-2)' }}>Moderation Console</h1>
                    <p style={{ color: 'var(--color-ink-muted)' }}>Review, approve, and publish Q&As</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <Card compact style={{ textAlign: 'center', minWidth: '80px' }}>
                        <div style={{ fontWeight: 700, fontSize: 'var(--font-size-2xl)', fontFamily: 'var(--font-heading)' }}>{pendingItems.length}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ink-muted)' }}>Pending</div>
                    </Card>
                    <Card compact style={{ textAlign: 'center', minWidth: '80px' }}>
                        <div style={{ fontWeight: 700, fontSize: 'var(--font-size-2xl)', fontFamily: 'var(--font-heading)' }}>{allQuestions.length}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ink-muted)' }}>Total</div>
                    </Card>
                </div>
            </div>

            {/* Review Modal */}
            {activeQuestion && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'var(--space-6)' }}>
                    <Card style={{ maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ marginBottom: 'var(--space-6)' }}>Review Question</h3>

                        <div style={{ marginBottom: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                                <Badge variant={activeQuestion.status} />
                                <Badge variant="category" label={activeQuestion.category} />
                            </div>
                        </div>

                        <Textarea label="Question Text (editable)" name="editedText" value={editedText}
                            onChange={e => setEditedText(e.target.value)} rows={3} />

                        <div style={{ marginTop: 'var(--space-4)' }}>
                            <Textarea label="Answer" name="answer" value={answerText}
                                onChange={e => setAnswerText(e.target.value)}
                                placeholder="Write a structured, educational answer..." rows={6} />
                        </div>

                        <div style={{ marginTop: 'var(--space-4)' }}>
                            <Select label="Review Badge" name="reviewBadge" value={reviewBadge}
                                onChange={e => setReviewBadge(e.target.value)}
                                options={[
                                    { value: 'moderated', label: 'Moderated' },
                                    { value: 'expert-reviewed', label: 'Expert Reviewed' },
                                    { value: 'clinician-reviewed', label: 'Clinician Reviewed' },
                                ]}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)', flexWrap: 'wrap' }}>
                            <Button onClick={() => handleModerate(activeQuestion.id, 'approve')} loading={processing}>
                                ✅ Approve
                            </Button>
                            <Button onClick={() => handleModerate(activeQuestion.id, 'publish')} variant="secondary" loading={processing}>
                                📢 Publish to KB
                            </Button>
                            <Button onClick={() => handleModerate(activeQuestion.id, 'reject')} variant="danger" loading={processing}>
                                ❌ Reject
                            </Button>
                            <Button onClick={() => { setActiveQuestion(null); setAnswerText(''); setEditedText(''); }} variant="ghost">
                                Cancel
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            <Tabs tabs={tabs} />
        </div>
    );
}
