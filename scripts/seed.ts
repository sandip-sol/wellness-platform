/**
 * Seed script: loads data/faqs.json into the MongoDB publishedQAs collection.
 * Run with: npx tsx scripts/seed.ts
 */

import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/safespace';
const DB_NAME = 'safespace';

async function seed() {
    console.log('🌱 Connecting to MongoDB...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);

    // --- Seed publishedQAs from faqs.json ---
    const faqsPath = path.resolve(__dirname, '../data/faqs.json');
    const faqsRaw = fs.readFileSync(faqsPath, 'utf-8');
    const faqs = JSON.parse(faqsRaw);

    const publishedCol = db.collection('publishedQAs');

    // Check if already seeded
    const existingCount = await publishedCol.countDocuments();
    if (existingCount > 0) {
        console.log(`ℹ️  publishedQAs already has ${existingCount} documents. Skipping seed.`);
    } else {
        const docs = faqs.map((faq: any) => ({
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            tags: faq.tags,
            whenToSeekHelp: faq.whenToSeekHelp,
            emergencyRedFlags: faq.emergencyRedFlags || null,
            slug: faq.slug,
            helpfulCount: faq.helpfulCount,
            status: 'published',
            reviewBadge: 'moderated',
            createdAt: new Date('2025-01-01').toISOString(),
            publishedAt: new Date('2025-01-15').toISOString(),
        }));

        await publishedCol.insertMany(docs);
        console.log(`✅ Seeded ${docs.length} published Q&As`);
    }

    // --- Create indexes for common queries ---
    console.log('📇 Creating indexes...');

    await publishedCol.createIndex({ slug: 1 }, { unique: true });
    await publishedCol.createIndex({ category: 1 });
    await publishedCol.createIndex({ helpfulCount: -1 });

    const questionsCol = db.collection('questions');
    await questionsCol.createIndex({ id: 1 }, { unique: true });
    await questionsCol.createIndex({ status: 1 });
    await questionsCol.createIndex({ category: 1 });
    await questionsCol.createIndex({ createdAt: -1 });

    const journalCol = db.collection('journalEntries');
    await journalCol.createIndex({ sessionTokenHash: 1 });
    await journalCol.createIndex({ createdAt: -1 });

    const consultsCol = db.collection('consults');
    await consultsCol.createIndex({ sessionTokenHash: 1 });

    const votesCol = db.collection('votes');
    await votesCol.createIndex({ key: 1 }, { unique: true });

    const checkinsCol = db.collection('couplesCheckins');
    await checkinsCol.createIndex({ sessionTokenHash: 1 });

    console.log('✅ Indexes created');
    console.log('🎉 Seed complete!');

    await client.close();
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
