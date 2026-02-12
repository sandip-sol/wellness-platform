import styles from './MythCard.module.css';

export default function MythCard({ myth }) {
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

            <div className={`${styles.mythSection} ${styles.whyPart}`}>
                <div className={styles.mythLabel}>💡 Why This Matters</div>
                <p className={styles.mythText}>{myth.explanation}</p>
            </div>

            {myth.indiaContext && (
                <div className={`${styles.mythSection} ${styles.indiaPart}`}>
                    <div className={styles.mythLabel}>🇮🇳 India Context</div>
                    <p className={styles.mythText}>{myth.indiaContext}</p>
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
        </article>
    );
}
