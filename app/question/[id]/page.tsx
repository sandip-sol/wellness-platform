'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import Badge from '@/components/kit/Badge';
import Button from '@/components/kit/Button';
import Alert from '@/components/kit/Alert';
import { Textarea } from '@/components/kit/Input';

function getSessionToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('ss_session_token');
}

export default function QuestionPage() {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [voted, setVoted] = useState(false);
    const [followUp, setFollowUp] = useState('');
    const [submittingFollowUp, setSubmittingFollowUp] = useState(false);

    useEffect(() => {
        fetchQuestion();
    }, [id]);

    const fetchQuestion = async () => {
        try {
            const res = await fetch(`/api/questions/${id}`);
            if (res.ok) {
                const data = await res.json();
                setQuestion(data.question);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async () => {
        if (voted) return;
        const token = getSessionToken();
        try {
            const res = await fetch(`/api/questions/${id}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionToken: token }),
            });
            if (res.ok) {
                setVoted(true);
                setQuestion(prev => ({ ...prev, helpfulCount: (prev.helpfulCount || 0) + 1 }));
            }
        } catch (err) { }
    };

    const handleFollowUp = async (e) => {
        e.preventDefault();
        if (!followUp.trim()) return;
        setSubmittingFollowUp(true);
        const token = getSessionToken();
        try {
            const res = await fetch(`/api/questions/${id}/followup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: followUp, sessionToken: token }),
            });
            if (res.ok) {
                setFollowUp('');
                fetchQuestion();
            }
        } catch (err) { }
        setSubmittingFollowUp(false);
    };

    if (loading) {
        return (
            <div className={styles.questionPage}>
                <div style={{ textAlign: 'center', padding: 'var(--space-20)' }}>
                    <div style={{ fontSize: '2rem', animation: 'pulse 1.5s infinite' }}>⏳</div>
                    <p style={{ color: 'var(--color-ink-muted)', marginTop: 'var(--space-4)' }}>Loading...</p>
                </div>
            </div>
        );
    }

    if (!question) {
        return (
            <div className={styles.questionPage}>
                <div className={styles.notFound}>
                    <h2>Question not found</h2>
                    <p style={{ color: 'var(--color-ink-muted)', margin: 'var(--space-4) 0' }}>
                        This question may have been removed or doesn&apos;t exist.
                    </p>
                    <Button href="/ask">Ask a New Question</Button>
                </div>
            </div>
        );
    }

    const isPublished = question.status === 'published';
    const isPending = question.status === 'pending';
    const hasAnswer = question.answer || (question.answers && question.answers.length > 0);

    return (
        <div className={styles.questionPage}>
            <Link href="/kb" className={styles.backLink}>
                ← Back to Knowledge Base
            </Link>

            <div className={styles.questionHeader}>
                <div className={styles.questionMeta}>
                    <Badge variant="category" label={question.category} />
                    <Badge variant={question.status} />
                    {question.reviewBadge && <Badge variant={question.reviewBadge} />}
                </div>
                <h1 className={styles.questionText}>
                    {question.question || question.text}
                </h1>
                <div className={styles.questionStatus}>
                    <span>👤 Anonymous</span>
                    <span>·</span>
                    <span>{question.helpfulCount || 0} found this helpful</span>
                </div>
            </div>

            {isPending && !hasAnswer && (
                <div className={styles.pendingState}>
                    <div className={styles.pendingIcon}>⏳</div>
                    <h3 className={styles.pendingTitle}>Pending Review</h3>
                    <p className={styles.pendingMessage}>
                        Your question is being reviewed by our moderation team.
                        You&apos;ll receive a structured answer soon.
                    </p>
                </div>
            )}

            {/* Answer */}
            {(question.answer || hasAnswer) && (
                <div className={styles.answerSection}>
                    <div className={styles.answerBadges}>
                        <Badge variant={question.reviewBadge || 'moderated'} />
                    </div>
                    <div className={styles.answerText}>
                        {question.answer || question.answers[question.answers.length - 1]?.text}
                    </div>
                </div>
            )}

            {/* When to seek help */}
            {question.whenToSeekHelp && (
                <Alert variant="warning" title="When to Seek Professional Help">
                    {question.whenToSeekHelp}
                </Alert>
            )}

            {question.emergencyRedFlags && (
                <div style={{ marginTop: 'var(--space-4)' }}>
                    <Alert variant="danger" title="Emergency Red Flags">
                        {question.emergencyRedFlags}
                    </Alert>
                </div>
            )}

            {/* Actions */}
            <div className={styles.actionsBar} style={{ marginTop: 'var(--space-6)' }}>
                <button
                    className={`${styles.voteBtn} ${voted ? styles.voted : ''}`}
                    onClick={handleVote}
                >
                    👍 {voted ? 'Marked Helpful' : 'Helpful'} ({question.helpfulCount || 0})
                </button>
                <Button href="/ask" variant="ghost" size="sm">Ask a Related Question</Button>
            </div>

            {/* Follow-ups */}
            {!isPublished && (
                <div className={styles.followUpSection}>
                    <h3>Follow-up Questions</h3>
                    {question.followUps && question.followUps.length > 0 && (
                        <div className={styles.followUpList}>
                            {question.followUps.map(fu => (
                                <div key={fu.id} className={styles.followUpItem}>
                                    <p>{fu.text}</p>
                                    <span className={styles.followUpTime}>
                                        {new Date(fu.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                    <form className={styles.followUpForm} onSubmit={handleFollowUp}>
                        <Textarea
                            name="followup"
                            value={followUp}
                            onChange={(e) => setFollowUp(e.target.value)}
                            placeholder="Ask a follow-up question..."
                            rows={2}
                        />
                        <Button type="submit" loading={submittingFollowUp} size="sm">Send</Button>
                    </form>
                </div>
            )}
        </div>
    );
}
