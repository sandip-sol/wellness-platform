'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Button from '@/components/kit/Button';
import { Select, Textarea } from '@/components/kit/Input';
import Alert from '@/components/kit/Alert';

const CATEGORIES = [
    { value: 'sexual-health', label: '🏥 Sexual Health' },
    { value: 'relationships', label: '💬 Relationships & Communication' },
    { value: 'consent', label: '🤝 Consent & Boundaries' },
    { value: 'lgbtqia', label: '🌈 LGBTQIA+ Wellness' },
    { value: 'mental-wellbeing', label: '🧠 Mental & Emotional Wellbeing' },
    { value: 'marriage-intimacy', label: '💑 Marriage & Long-term Intimacy' },
    { value: 'contraception', label: '💊 Contraception & Family Planning' },
    { value: 'body-literacy', label: '📖 Body Literacy & Anatomy' },
];

const AGE_RANGES = [
    { value: '18-24', label: '18–24' },
    { value: '25-34', label: '25–34' },
    { value: '35-44', label: '35–44' },
    { value: '45+', label: '45+' },
    { value: 'prefer-not', label: 'Prefer not to say' },
];

const REL_STATUS = [
    { value: 'single', label: 'Single' },
    { value: 'dating', label: 'Dating' },
    { value: 'married', label: 'Married' },
    { value: 'long-term', label: 'Long-term relationship' },
    { value: 'prefer-not', label: 'Prefer not to say' },
];

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

export default function AskPage() {
    const router = useRouter();
    const [category, setCategory] = useState('');
    const [question, setQuestion] = useState('');
    const [ageRange, setAgeRange] = useState('');
    const [relStatus, setRelStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = getSessionToken();
            const res = await fetch('/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category,
                    text: question,
                    context: {
                        ageRange: ageRange || undefined,
                        relationshipStatus: relStatus || undefined,
                    },
                    sessionToken: token,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong.');
                return;
            }

            setSuccess(data);
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.askPage}>
                <div className={styles.successCard}>
                    <div className={styles.successIcon}>✅</div>
                    <h2 className={styles.successTitle}>Question Submitted!</h2>
                    <p className={styles.successMessage}>
                        Your question has been submitted anonymously and is pending review by our moderation team.
                        You'll receive a structured answer once it's been reviewed.
                        {success.safetyNote && (
                            <><br /><br /><strong>⚠️ {success.safetyNote}</strong></>
                        )}
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button href={`/question/${success.question.id}`} variant="primary">
                            View Your Question →
                        </Button>
                        <Button onClick={() => { setSuccess(null); setQuestion(''); setCategory(''); }} variant="outline">
                            Ask Another Question
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.askPage}>
            <div className={styles.askHeader}>
                <h1 className={styles.askTitle}>Ask Anonymously</h1>
                <p className={styles.askSubtitle}>
                    Your question is completely anonymous. No identity tracked.
                </p>
            </div>

            <Alert variant="disclaimer" title="Before you ask">
                This platform provides sexual wellness education only. It is not a substitute for professional medical advice.
                For emergencies, contact your doctor or call 112.
            </Alert>

            <form className={styles.askForm} onSubmit={handleSubmit}>
                <Select
                    label="Category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={CATEGORIES}
                    placeholder="What is your question about?"
                    required
                />

                <Textarea
                    label="Your Question"
                    name="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type your question here. Focus on education and understanding — no explicit details needed."
                    maxLength={1000}
                    rows={5}
                    required
                    helperText="Be specific and educational. Our moderation team will review your question and provide a structured answer."
                />

                <div className={styles.contextRow}>
                    <Select
                        label="Age Range (optional)"
                        name="ageRange"
                        value={ageRange}
                        onChange={(e) => setAgeRange(e.target.value)}
                        options={AGE_RANGES}
                        placeholder="Select age range"
                        helperText="Helps us tailor the answer"
                    />
                    <Select
                        label="Relationship Status (optional)"
                        name="relStatus"
                        value={relStatus}
                        onChange={(e) => setRelStatus(e.target.value)}
                        options={REL_STATUS}
                        placeholder="Select status"
                        helperText="Helps us tailor the answer"
                    />
                </div>

                {error && <div className={styles.errorMessage}>⚠️ {error}</div>}

                <Button type="submit" size="lg" fullWidth loading={loading}>
                    Submit Question Anonymously
                </Button>

                <Alert variant="info" icon="🔒">
                    <strong>Your privacy is protected.</strong> We don't store your identity. Your question is linked only
                    to an anonymous session token stored in your browser. You can delete it at any time.
                </Alert>
            </form>
        </div>
    );
}
