import Alert from '@/components/kit/Alert';
import Card, { CardHeader, CardDescription } from '@/components/kit/Card';
import Badge from '@/components/kit/Badge';
import Accordion from '@/components/kit/Accordion';
import Button from '@/components/kit/Button';

export const metadata = {
    title: 'Privacy & Safety — Safe Space',
    description: 'Our privacy policy, platform rules, moderation process, and data practices.',
};

export default function PrivacyPage() {
    const rules = [
        { title: 'Age Requirement', content: 'This platform is strictly for adults aged 18 and above. Content is not suitable for minors. If you are under 18, please reach out to a trusted adult, school counsellor, or Childline (1098).' },
        { title: 'Education Only', content: 'All content is educational in nature. We do not provide medical diagnoses, prescriptions, or treatment. Always consult a qualified healthcare provider for medical concerns.' },
        { title: 'No Explicit Content', content: 'We maintain a strict no-explicit-content policy. Questions and answers focus on health, wellbeing, education, and relationships — not gratification or explicit material.' },
        { title: 'No Harassment or Hate', content: 'Discrimination, harassment, hate speech, and bullying are not tolerated. This includes content targeting individuals based on gender, orientation, caste, religion, or any other identity.' },
        { title: 'No Illegal Content', content: 'Content promoting illegal activities, exploitation, coercion, or violence is immediately removed and may be reported to authorities.' },
        { title: 'Safety Guidance', content: 'Every health-related answer includes "when to seek professional help" guidance. Every abuse-related question triggers safety resources and helpline information.' },
    ];

    const dataFaqs = [
        { title: 'What data do you collect?', content: 'We collect: (1) Anonymous session tokens for linking your questions/entries, (2) Question text (after PII removal), (3) Journal entries (stored in your browser), (4) Check-in responses. We do NOT collect names, emails, phone numbers, IP addresses, or device identifiers.' },
        { title: 'How is my data stored?', content: 'Journal entries are stored entirely in your browser\'s local storage — we never see them. Questions are stored on our server with anonymous session tokens only. Expert consultation data is stored separately with strict access controls.' },
        { title: 'Can I delete my data?', content: 'Yes. Journal entries can be deleted with one tap. Your session token can be reset by clearing your browser data. Published Q&As are anonymized and cannot be traced back to you.' },
        { title: 'Do you sell data?', content: 'Never. We have a strict no-data-selling policy. We do not use analytics that track individual users. We do not run ads.' },
        { title: 'Is this truly anonymous?', content: 'Yes. We use anonymous session tokens instead of accounts. No login required. No identity verification. The token is stored in your browser and can be deleted at any time. Even our team cannot identify who asked a question.' },
    ];

    const moderationFaqs = [
        { title: 'How does moderation work?', content: 'Every question goes through a multi-step process: (1) AI safety filter removes personal information and checks policy compliance, (2) Human moderator reviews content for accuracy, (3) Optional expert review for medical or therapeutic content, (4) Publication to knowledge base (fully anonymized).' },
        { title: 'What are the review badges?', content: 'Moderated: Reviewed by our content team. Clinician-reviewed: Verified by a healthcare professional. Therapist-reviewed: Verified by a mental health professional. Updated: Content has been recently revised.' },
        { title: 'How long does review take?', content: 'Most questions are reviewed within 24-48 hours. Questions flagged for expert review may take up to 72 hours. Emergency/safety content is prioritized.' },
        { title: 'What happens to flagged content?', content: 'Content that may contain PII is automatically redacted. Policy-violating content is rejected with explanation. Underage content is blocked with resources for young people. Abuse-related content triggers safety resources.' },
    ];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-12) var(--space-6)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                <h1 style={{ marginBottom: 'var(--space-3)' }}>Privacy & Safety</h1>
                <p style={{ color: 'var(--color-ink-light)', fontSize: 'var(--font-size-lg)', maxWidth: '550px', margin: '0 auto' }}>
                    Your trust is our foundation. Here&apos;s exactly how we protect it.
                </p>
            </div>

            {/* Trust Promises */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-12)' }}>
                {[
                    { icon: '🔒', title: 'No Identity Required', desc: 'No sign-up, no login, no tracking' },
                    { icon: '🚫', title: 'No Ads Ever', desc: 'We will never run advertisements' },
                    { icon: '💰', title: 'No Data Selling', desc: 'Your data is never shared or sold' },
                    { icon: '🗑️', title: 'Delete Anytime', desc: 'One-tap delete for all your local data' },
                ].map((p, i) => (
                    <Card key={i} variant="trust" compact>
                        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.5rem' }}>{p.icon}</span>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{p.title}</div>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ink-muted)' }}>{p.desc}</div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Platform Rules */}
            <h2 style={{ marginBottom: 'var(--space-6)' }}>Platform Rules</h2>
            <Accordion items={rules} />

            {/* What We Store */}
            <h2 style={{ margin: 'var(--space-12) 0 var(--space-6)' }}>What We Store</h2>
            <Accordion items={dataFaqs} />

            {/* How Moderation Works */}
            <h2 style={{ margin: 'var(--space-12) 0 var(--space-6)' }}>How Moderation Works</h2>
            <Accordion items={moderationFaqs} />

            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', margin: 'var(--space-6) 0' }}>
                <Badge variant="moderated" />
                <Badge variant="expert-reviewed" />
                <Badge variant="clinician-reviewed" />
                <Badge variant="updated" />
            </div>

            {/* Emergency Resources */}
            <div style={{ marginTop: 'var(--space-12)' }}>
                <Alert variant="danger" title="Emergency Resources">
                    <div style={{ lineHeight: 'var(--line-height-relaxed)' }}>
                        <strong>If you or someone you know is in immediate danger:</strong><br />
                        Emergency: 112 | Women Helpline: 181 | Childline: 1098<br />
                        iCall: 9152987821 | Vandrevala Foundation: 1860-2662-345 (24/7)
                    </div>
                </Alert>
            </div>

            <div style={{ textAlign: 'center', margin: 'var(--space-12) 0' }}>
                <p style={{ color: 'var(--color-ink-muted)', marginBottom: 'var(--space-4)' }}>
                    Have a question about our privacy practices?
                </p>
                <Button href="/ask">Ask Us Anonymously</Button>
            </div>
        </div>
    );
}
