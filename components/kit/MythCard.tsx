'use client';

import { useState } from 'react';
import styles from './MythCard.module.css';

export default function MythCard({ myth }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <article className={styles.mythCard}>
            <div className={styles.mythTitle}>{myth.title}</div>

            <div className={`${styles.mythSection} ${styles.mythPart}`}>
                <div className={styles.mythLabel}>❌ Myth</div>
                <p className={styles.mythText}>{myth.myth}</p>
            </div>

            <div className={`${styles.mythSection} ${styles.factPart}`}>
                <div className={styles.mythLabel}>✅ Fact</div>
                <p className={styles.mythText}>{myth.fact}</p>
            </div>

            {isExpanded && (
                <>
                    <div className={`${styles.mythSection} ${styles.whyPart}`}>
                        <div className={styles.mythLabel}>💡 Why This Matters</div>
                        <p className={styles.mythText}>{myth.explanation}</p>
                    </div>

                    {(myth.indiaContext || myth.culturalContext) && (
                        <div className={`${styles.mythSection} ${styles.culturalPart || styles.indiaPart}`}>
                            <div className={styles.mythLabel}>🌏 Cultural Context</div>
                            <p className={styles.mythText}>{myth.culturalContext || myth.indiaContext}</p>
                        </div>
                    )}

                    {myth.riskFactors && (
                        <div className={`${styles.mythSection} ${styles.riskPart}`}>
                            <div className={styles.mythLabel}>⚠️ Risk Factors</div>
                            <p className={styles.mythText}>{myth.riskFactors}</p>
                        </div>
                    )}

                    {myth.references && myth.references.length > 0 && (
                        <div className={styles.references}>
                            <div className={styles.refList}>
                                {myth.references.map((ref, i) => (
                                    <span key={i} className={styles.refItem}>📄 {ref}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            <button
                className={styles.toggleButton}
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
            >
                {isExpanded ? 'Read Less ↑' : 'Read More ↓'}
            </button>
        </article>
    );
}
