'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import Button from '@/components/kit/Button';

const NAV_LINKS = [
    { href: '/kb', label: 'Knowledge Base' },
    { href: '/myths', label: 'Myth Busters' },
    { href: '/paths', label: 'Learning Paths' },
    { href: '/couples', label: 'Couples' },
    { href: '/journal', label: 'Journal' },
    { href: '/consult', label: 'Expert Help' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.navInner}>
                    <Link href="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
                        <div className={styles.logoIcon}>🌿</div>
                        <div>
                            <div className={styles.logoText}>Safe Space</div>
                        </div>
                    </Link>

                    <div className={styles.navLinks}>
                        {NAV_LINKS.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className={styles.navActions}>
                        <Link href="/privacy" className={styles.navLink}>
                            🔒 Privacy
                        </Link>
                        <Button href="/ask" size="sm">
                            Ask Anonymously
                        </Button>
                    </div>

                    <button
                        className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={styles.hamburgerLine} />
                        <span className={styles.hamburgerLine} />
                        <span className={styles.hamburgerLine} />
                    </button>
                </div>
            </nav>

            <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}>
                {NAV_LINKS.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={styles.mobileNavLink}
                        onClick={() => setMobileOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}
                <Link
                    href="/privacy"
                    className={styles.mobileNavLink}
                    onClick={() => setMobileOpen(false)}
                >
                    🔒 Privacy & Safety
                </Link>
                <div className={styles.mobileCta}>
                    <Button href="/ask" fullWidth onClick={() => setMobileOpen(false)}>
                        Ask Anonymously
                    </Button>
                </div>
            </div>
        </>
    );
}
