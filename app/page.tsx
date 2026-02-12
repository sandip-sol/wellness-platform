'use client';

import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Button from '@/components/kit/Button';
import Doodle from '@/components/ui/Doodle';
import styles from './page.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    const mainRef = useRef(null);
    const heroRef = useRef(null);
    const heroTitleRef = useRef(null);
    const heroSubtitleRef = useRef(null);
    const heroCtasRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Animations
            const tl = gsap.timeline();

            tl.fromTo(heroTitleRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
            )
                .fromTo(heroSubtitleRef.current,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
                    '-=0.6'
                )
                .fromTo(heroCtasRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
                    '-=0.6'
                );

            // Doodle Animations
            gsap.to('.doodle-float', {
                y: -15,
                rotation: 5,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                stagger: {
                    each: 0.5,
                    from: 'random'
                }
            });

            gsap.to('.doodle-rotate', {
                rotation: 360,
                duration: 20,
                repeat: -1,
                ease: 'linear'
            });

            // Scroll Indicator Animation
            gsap.to('.scroll-indicator', {
                y: 10,
                repeat: -1,
                yoyo: true,
                duration: 1.5,
                ease: 'power1.inOut'
            });

            // Parallax Background
            gsap.to('.hero-blob-1', {
                yPercent: 20,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });

        }, mainRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={mainRef} className={styles.main}>
            {/* Hero Section */}
            <section ref={heroRef} className={styles.hero}>
                <div className={`${styles.heroDecor} hero-blob-1 ${styles.heroBlob1}`} />
                <div className={`${styles.heroDecor} hero-blob-2 ${styles.heroBlob2}`} />

                {/* Floating Doodles */}
                <Doodle variant="star" color="var(--color-accent)" size={48} className="doodle-float doodle-rotate" style={{ position: 'absolute', top: '15%', left: '10%', opacity: 0.6 }} />
                <Doodle variant="heart" color="var(--color-secondary)" size={32} className="doodle-float" style={{ position: 'absolute', top: '25%', right: '15%', opacity: 0.6 }} />
                <Doodle variant="spiral" color="var(--color-primary)" size={40} className="doodle-float" style={{ position: 'absolute', bottom: '20%', left: '20%', opacity: 0.5 }} />
                <Doodle variant="sparkle" color="var(--color-accent)" size={24} className="doodle-float" style={{ position: 'absolute', top: '40%', right: '30%', opacity: 0.4 }} />

                <div className={styles.heroContent}>
                    <div className={styles.heroEyebrow}>
                        <span>🔒</span> Anonymous & Secure
                    </div>

                    <h1 ref={heroTitleRef} className={styles.heroTitle}>
                        Your Safe Space for <br />
                        <span className={styles.heroTitleAccent}>Sexual Wellness</span>
                    </h1>

                    <p ref={heroSubtitleRef} className={styles.heroSubtitle}>
                        Ask questions anonymously, explore myth-busters, and access expert-backed
                        knowledge without judgment. A privacy-first platform for India.
                    </p>

                    <div ref={heroCtasRef} className={styles.heroCtas}>
                        <Button href="/ask" variant="primary" size="lg">
                            Ask Anonymously
                        </Button>
                        <Button href="/learn" variant="outline" size="lg">
                            Start Learning
                        </Button>
                    </div>

                    <div className={styles.heroFloatingChips}>
                        <div className={styles.chip}>🏳️‍🌈 LGBTQIA+ Friendly</div>
                        <div className={styles.chip}>🚫 Zero Data Tracking</div>
                        <div className={styles.chip}>✅ Expert Verified</div>
                        <div className={styles.chip}>🇮🇳 India-First Context</div>
                    </div>
                </div>

                <div className="scroll-indicator" style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    opacity: 0.6,
                    cursor: 'pointer'
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                    </svg>
                </div>
            </section>

            {/* Value Props */}
            <section className={styles.valueProps} style={{ position: 'relative' }}>
                <Doodle variant="zigzag" color="var(--color-ink-muted)" size={64} className="doodle-float" style={{ position: 'absolute', top: '50%', left: '5%', opacity: 0.1, transform: 'rotate(-45deg)' }} />
                <Doodle variant="circle" color="var(--color-ink-muted)" size={48} className="doodle-float" style={{ position: 'absolute', top: '20%', right: '5%', opacity: 0.1 }} />

                <div className={styles.valuePropGrid}>
                    <div className={`${styles.valuePropCard} card-interactive`}>
                        <span className={styles.valuePropIcon}>🎭</span>
                        <h3 className={styles.valuePropTitle}>100% Anonymous</h3>
                        <p className={styles.valuePropDesc}>No signup required. No IP tracking. Your identity remains completely hidden.</p>
                    </div>
                    <div className={`${styles.valuePropCard} card-interactive`}>
                        <span className={styles.valuePropIcon}>🩺</span>
                        <h3 className={styles.valuePropTitle}>Expert Backed</h3>
                        <p className={styles.valuePropDesc}>Content reviewed by certified gynecologists and sex educators.</p>
                    </div>
                    <div className={`${styles.valuePropCard} card-interactive`}>
                        <span className={styles.valuePropIcon}>🇮🇳</span>
                        <h3 className={styles.valuePropTitle}>Culturally Relevant</h3>
                        <p className={styles.valuePropDesc}>Tailored for the Indian context, addressing local myths and societal norms.</p>
                    </div>
                    <div className={`${styles.valuePropCard} card-interactive`}>
                        <span className={styles.valuePropIcon}>🔒</span>
                        <h3 className={styles.valuePropTitle}>Privacy First</h3>
                        <p className={styles.valuePropDesc}>We don't store personal data. Your browsing history is safe here.</p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className={styles.howItWorks}>
                <h2 className={styles.sectionTitle}>How Safe Space Works</h2>
                <p className={styles.sectionSubtitle}>Get answers in three simple, private steps.</p>

                <div className={styles.stepsGrid}>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>1</div>
                        <h3 className={styles.stepTitle}>Ask or Search</h3>
                        <p className={styles.stepDesc}>Post your question anonymously or browse our extensive Knowledge Base.</p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>2</div>
                        <h3 className={styles.stepTitle}>Get Verified Answers</h3>
                        <p className={styles.stepDesc}>Community answers are moderated, and experts provide verified guidance.</p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>3</div>
                        <h3 className={styles.stepTitle}>Learn & Grow</h3>
                        <p className={styles.stepDesc}>Follow curated learning paths to understand your body and relationships better.</p>
                    </div>
                </div>
            </section>

            {/* Featured Myths Teaser - Placeholder for dynamic content */}
            <section className={styles.featuredSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Myth Busters</h2>
                    <p className={styles.sectionSubtitle}>Separating fact from fiction in Indian sexual wellness.</p>
                    <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
                        <Button href="/myths" variant="secondary">View All Myths</Button>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className={styles.trustSection}>
                <div className={styles.trustGrid}>
                    <div className={styles.trustCard}>
                        <div className={styles.trustIcon}>🛡️</div>
                        <h4 className={styles.trustTitle}>No Logs Policy</h4>
                    </div>
                    <div className={styles.trustCard}>
                        <div className={styles.trustIcon}>🤝</div>
                        <h4 className={styles.trustTitle}>Community Guidelines</h4>
                    </div>
                    <div className={styles.trustCard}>
                        <div className={styles.trustIcon}>⚡</div>
                        <h4 className={styles.trustTitle}>Quick Exit</h4>
                    </div>
                    <div className={styles.trustCard}>
                        <div className={styles.trustIcon}>📱</div>
                        <h4 className={styles.trustTitle}>Mobile Optimized</h4>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className={styles.ctaBanner}>
                <h2 className={styles.ctaBannerTitle}>Ready to find answers?</h2>
                <p className={styles.ctaBannerDesc}>Join thousands of others in a safe, judgment-free environment.</p>
                <Button href="/ask" variant="primary" size="lg">Start Asking Now</Button>
            </section>
        </div>
    );
}
