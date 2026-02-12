'use client';
import { useState } from 'react';
import Card, { CardHeader, CardDescription } from '@/components/kit/Card';
import Button from '@/components/kit/Button';
import { Textarea, Select } from '@/components/kit/Input';
import Alert from '@/components/kit/Alert';
import Badge from '@/components/kit/Badge';

const TOPICS = [
    { value: 'sexual-health', label: '🏥 Sexual Health Concern' },
    { value: 'relationship', label: '💬 Relationship Issue' },
    { value: 'anxiety', label: '🧠 Anxiety / Mental Wellbeing' },
    { value: 'identity', label: '🌈 Identity & Orientation' },
    { value: 'trauma', label: '🛡️ Past Trauma / Recovery' },
    { value: 'other', label: '📝 Other' },
];

const EXPERT_TYPES = [
    { value: 'doctor', label: '🏥 Sexual Health Doctor' },
    { value: 'therapist', label: '🧠 Therapist / Counsellor' },
];

const URGENCY = [
    { value: 'normal', label: 'Regular (24-48h response)' },
    { value: 'priority', label: 'Priority (12h response)' },
];

export default function ConsultPage() {
    const [submitted, setSubmitted] = useState(false);
    const [topic, setTopic] = useState('');
    const [expertType, setExpertType] = useState('');
    const [urgency, setUrgency] = useState('normal');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('ss_session_token') || 'anonymous';
            await fetch('/api/consult', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionToken: token, topic, expertType, urgency, message }),
            });
            setSubmitted(true);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-12) var(--space-6)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
                <h1 style={{ marginBottom: 'var(--space-3)' }}>Expert Consultation</h1>
                <p style={{ color: 'var(--color-ink-light)', fontSize: 'var(--font-size-lg)', maxWidth: '550px', margin: '0 auto' }}>
                    Get personalized, private guidance from verified healthcare professionals.
                    Still anonymous. Always confidential.
                </p>
            </div>

            {/* How it works */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-10)' }}>
                {[
                    { icon: '📝', title: 'Share Your Concern', desc: 'Describe your situation privately' },
                    { icon: '🔒', title: 'Stay Anonymous', desc: 'No identity required' },
                    { icon: '💬', title: 'Get Expert Guidance', desc: 'Within 24-48 hours' },
                ].map((s, i) => (
                    <Card key={i} compact style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>{s.icon}</div>
                        <h4 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-1)' }}>{s.title}</h4>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ink-muted)' }}>{s.desc}</p>
                    </Card>
                ))}
            </div>

            <Alert variant="disclaimer" title="Important" style={{ marginBottom: 'var(--space-8)' }}>
                Expert consultations provide personalized guidance but are not a replacement for in-person medical care.
                For emergencies, call 112 or visit your nearest hospital.
            </Alert>

            {submitted ? (
                <Card variant="highlighted" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>✅</div>
                    <h2 style={{ marginBottom: 'var(--space-3)' }}>Request Submitted</h2>
                    <p style={{ color: 'var(--color-ink-light)', marginBottom: 'var(--space-6)' }}>
                        Your consultation request has been submitted anonymously.
                        An expert will respond within 24-48 hours.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                        <Badge variant="moderated" />
                        <Badge variant="category" label="Anonymous" />
                    </div>
                    <div style={{ marginTop: 'var(--space-6)' }}>
                        <Button onClick={() => { setSubmitted(false); setTopic(''); setExpertType(''); setMessage(''); }}>
                            Submit Another Request
                        </Button>
                    </div>
                </Card>
            ) : (
                <Card>
                    <h3 style={{ marginBottom: 'var(--space-6)' }}>Consultation Intake Form</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                        <Select label="Topic" name="topic" value={topic} onChange={e => setTopic(e.target.value)} options={TOPICS} placeholder="What is this about?" required />
                        <Select label="Expert Type" name="expertType" value={expertType} onChange={e => setExpertType(e.target.value)} options={EXPERT_TYPES} placeholder="Who would you like to consult?" required />
                        <Select label="Response Time" name="urgency" value={urgency} onChange={e => setUrgency(e.target.value)} options={URGENCY} />
                        <Textarea label="Describe Your Concern" name="message" value={message} onChange={e => setMessage(e.target.value)}
                            placeholder="Share as much or as little as you're comfortable with. The more context you provide, the more helpful the response."
                            rows={5} maxLength={3000} required
                            helperText="This will only be seen by the assigned expert. It will not be published."
                        />
                        <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-primary-dark)' }}>
                                {urgency === 'priority' ? '₹499' : '₹299'}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ink-muted)' }}>
                                {urgency === 'priority' ? 'Priority response in 12 hours' : 'Response within 24-48 hours'}
                            </div>
                        </div>
                        <Button type="submit" size="lg" fullWidth loading={loading}>
                            Submit Consultation Request
                        </Button>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ink-muted)', textAlign: 'center' }}>
                            Payment integration is a placeholder for this POC. No actual payment is processed.
                        </p>
                    </form>
                </Card>
            )}
        </div>
    );
}
