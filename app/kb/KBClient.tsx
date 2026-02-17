'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import Badge from '@/components/kit/Badge';
import Button from '@/components/kit/Button';

export default function KBClient({ initialQAs, categories }) {
    const [qas, setQas] = useState(initialQAs);
    const [activeCategory, setActiveCategory] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    // Re-fetch when user filters/searches (client-side interactivity)
    useEffect(() => {
        // Skip fetch on initial mount — we already have SSR data
        if (!activeCategory && !search) {
            setQas(initialQAs);
            return;
        }

        const fetchFiltered = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (activeCategory) params.set('category', activeCategory);
                if (search) params.set('search', search);
                const res = await fetch(`/api/kb?${params}`);
                const data = await res.json();
                setQas(data.qas || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search input
        const timer = setTimeout(fetchFiltered, 300);
        return () => clearTimeout(timer);
    }, [activeCategory, search, initialQAs]);

    return (
        <>
            <div className={styles.searchRow}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="🔍 Search questions, topics, or keywords..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className={styles.catGrid}>
                <div
                    className={`${styles.catCard} ${!activeCategory ? styles.catCardActive : ''}`}
                    onClick={() => setActiveCategory('')}
                >
                    <span className={styles.catIcon}>📚</span>
                    <span className={styles.catName}>All Topics</span>
                    <span className={styles.catCount}>{qas.length} questions</span>
                </div>
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        className={`${styles.catCard} ${activeCategory === cat.id ? styles.catCardActive : ''}`}
                        onClick={() => setActiveCategory(activeCategory === cat.id ? '' : cat.id)}
                    >
                        <span className={styles.catIcon}>{cat.icon}</span>
                        <span className={styles.catName}>{cat.name}</span>
                        <span className={styles.catCount}>{cat.questionCount} questions</span>
                    </div>
                ))}
            </div>

            {loading ? (
                <div className={styles.emptyState}>Loading...</div>
            ) : qas.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No questions found. {search ? 'Try a different search term.' : ''}</p>
                    <div style={{ marginTop: 'var(--space-6)' }}>
                        <Button href="/ask">Be the first to ask →</Button>
                    </div>
                </div>
            ) : (
                <div className={styles.qaList}>
                    {qas.map(qa => (
                        <Link key={qa.id} href={`/kb/${qa.slug}`} className={styles.qaCard}>
                            <div className={styles.qaQuestion}>{qa.question}</div>
                            <div className={styles.qaAnswer}>{qa.answer}</div>
                            <div className={styles.qaMeta}>
                                <Badge variant="category" label={qa.category} />
                                {qa.reviewBadge && <Badge variant={qa.reviewBadge} />}
                                <span>👍 {qa.helpfulCount} helpful</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}
