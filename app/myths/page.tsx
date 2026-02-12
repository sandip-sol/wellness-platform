import MythCard from '@/components/kit/MythCard';
import Button from '@/components/kit/Button';
import Alert from '@/components/kit/Alert';
import mythsData from '@/data/myths.json';

export const metadata = {
    title: 'Myth Busters — Safe Space',
    description: 'Debunking common sexual health myths with facts, evidence, and India-specific context.',
};

export default function MythsPage() {
    return (
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-12) var(--space-6)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                <h1 style={{ marginBottom: 'var(--space-3)' }}>Myth Busters</h1>
                <p style={{ color: 'var(--color-ink-light)', fontSize: 'var(--font-size-lg)', maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
                    Separating facts from fiction with evidence-based answers and India-specific context.
                </p>
                <Alert variant="info" icon="💡">
                    Every myth-buster is based on peer-reviewed research and guidelines from medical organizations.
                    Sources are cited at the bottom of each card.
                </Alert>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(480px, 100%), 1fr))', gap: 'var(--space-6)' }} className="stagger-children">
                {mythsData.map(myth => (
                    <MythCard key={myth.id} myth={myth} />
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
                <p style={{ color: 'var(--color-ink-muted)', marginBottom: 'var(--space-4)' }}>
                    Know a myth that should be busted? Let us know.
                </p>
                <Button href="/ask">Suggest a Myth →</Button>
            </div>
        </div>
    );
}
