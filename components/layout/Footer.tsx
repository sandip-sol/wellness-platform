import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                <div className={styles.footerGrid}>
                    <div className={styles.footerBrand}>
                        <div className={styles.footerLogo}>
                            🌿 Safe Space
                        </div>
                        <p className={styles.footerTagline}>
                            India-first sexual wellness education, with privacy by design.
                        </p>

                    </div>

                    <div>
                        <h4 className={styles.footerTitle}>Learn</h4>
                        <div className={styles.footerLinks}>
                            <Link href="/kb" className={styles.footerLink}>Knowledge Base</Link>
                            <Link href="/myths" className={styles.footerLink}>Myth Busters</Link>
                            <Link href="/paths" className={styles.footerLink}>Learning Paths</Link>
                            <Link href="/ask" className={styles.footerLink}>Ask a Question</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className={styles.footerTitle}>Tools</h4>
                        <div className={styles.footerLinks}>
                            <Link href="/couples" className={styles.footerLink}>Couples Check-in</Link>
                            <Link href="/journal" className={styles.footerLink}>Private Journal</Link>
                            <Link href="/consult" className={styles.footerLink}>Expert Consult</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className={styles.footerTitle}>Trust &amp; Safety</h4>
                        <div className={styles.footerLinks}>
                            <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
                            <Link href="/privacy" className={styles.footerLink}>Platform Rules</Link>
                            <Link href="/privacy" className={styles.footerLink}>How Moderation Works</Link>
                            <Link href="/privacy" className={styles.footerLink}>What We Store</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <span className={styles.copyright}>
                        © {new Date().getFullYear()} Safe Space. Education, not medical advice.
                    </span>
                    <span className={styles.footerDisclaimer}>
                        Educational only. Not medical advice. Consult a professional. 18+.
                    </span>
                </div>
            </div>
        </footer>
    );
}
