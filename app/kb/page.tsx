import styles from './page.module.css';
import { getPublishedQAs, getCategories } from '@/lib/store';
import KBClient from './KBClient';

export const metadata = {
    title: 'Knowledge Base — Safe Space',
    description: 'Expert-reviewed answers to real questions about sexual wellness, health, and relationships. Browse by category or search for specific topics.',
    openGraph: {
        title: 'Knowledge Base — Safe Space',
        description: 'Expert-reviewed answers to real questions about sexual wellness, health, and relationships.',
    },
};

export default async function KnowledgeBasePage() {
    const qas = await getPublishedQAs();
    const categories = await getCategories();

    // FAQ JSON-LD structured data for SEO (all published Q&As)
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: qas.map(qa => ({
            '@type': 'Question',
            name: qa.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: qa.answer,
            },
        })),
    };

    return (
        <div className={styles.kbPage}>
            {/* FAQ JSON-LD for Google rich results */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className={styles.kbHeader}>
                <h1 className={styles.kbTitle}>Knowledge Base</h1>
                <p className={styles.kbSubtitle}>
                    Expert-reviewed answers to real questions about sexual wellness, health, and relationships.
                </p>
            </div>

            <KBClient initialQAs={qas} categories={categories} />
        </div>
    );
}
