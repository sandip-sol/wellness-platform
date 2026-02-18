import { getPublishedQAs, getCategories } from '@/lib/store';
import KBClient from './KBClient';
import { SectionTitle } from '@/components/ws/WsDivider';

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
        <main className="bg-background min-h-screen pt-28 pb-20">
            {/* FAQ JSON-LD for Google rich results */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="max-w-3xl mx-auto px-6 lg:px-8">
                <SectionTitle
                    eyebrow="Community Q&A"
                    heading="Knowledge Base"
                    subtitle="Expert-reviewed answers to real questions about sexual wellness, health, and relationships. Browse by topic or search for keywords."
                    align="left"
                    headingAs="h1"
                    className="mb-10 animate-fade-up"
                />

                <KBClient initialQAs={qas} categories={categories} />
            </div>
        </main>
    );
}
