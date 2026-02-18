import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ws/WsButton';
import { SectionTitle, WsDivider } from '@/components/ws/WsDivider';

const quickLinks = [
  { title: 'Ask Anonymously', description: 'Get evidence-informed guidance without sharing your identity.', href: '/ask' },
  { title: 'Knowledge Base', description: 'Browse approved answers across key topics and concerns.', href: '/kb' },
  { title: 'Myth Busters', description: 'Separate stigma from science with simple facts.', href: '/myths' },
  { title: 'Learning Paths', description: 'Follow structured paths from beginner to advanced.', href: '/paths' },
];

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="relative py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <span className="text-eyebrow">A privacy-first wellness hub</span>

              <h1 className="mt-3 font-serif text-display text-warm-charcoal max-w-xl">
                A safe space to learn, ask, and build healthier relationships.
              </h1>

              <p className="mt-4 text-subheadline max-w-xl">
                Anonymous Q&A, myth-busting, learning paths, and gentle self-check tools — designed with respect,
                consent, and cultural context in mind.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link href="/ask" className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'justify-center')}>
                  Ask Anonymously
                </Link>
                <Link href="/learn" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'justify-center')}>
                  Start Learning
                </Link>
              </div>

              <p className="mt-5 text-xs text-warm-secondary">
                Educational content only — not medical advice. For urgent concerns or symptoms, consult a qualified clinician.
              </p>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl border border-border bg-beige/60 p-5 sm:p-6 overflow-hidden">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-cream">
                  <Image
                    src="/illustrations/botanical-hero.png"
                    alt="Botanical illustration"
                    fill
                    priority
                    className="object-cover"
                    sizes="(min-width: 1024px) 520px, 100vw"
                  />
                </div>
                <Image
                  src="/illustrations/botanical-accent.png"
                  alt=""
                  width={380}
                  height={260}
                  className="pointer-events-none select-none absolute -bottom-10 -right-10 opacity-70 hidden sm:block"
                />
              </div>
            </div>
          </div>

          <WsDivider decorative />
        </div>
      </section>

      {/* QUICK LINKS */}
      <section>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <SectionTitle
            eyebrow="Explore"
            heading="Start where you are"
            subtitle="Pick a path — ask a question, read trusted answers, or take a gentle self-check."
            align="left"
          />

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickLinks.map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className={cn(
                  'card-interactive rounded-2xl border border-border bg-card p-6',
                  'hover:border-primary/60'
                )}
              >
                <h3 className="font-serif text-lg text-warm-charcoal">{q.title}</h3>
                <p className="mt-2 text-sm text-warm-secondary">{q.description}</p>
                <div className="mt-4 text-sm font-semibold text-warm-charcoal">
                  Open →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="bg-sage/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border bg-background/70 p-6">
              <p className="text-eyebrow">Privacy</p>
              <h3 className="mt-2 font-serif text-headline">Always anonymous</h3>
              <p className="mt-2 text-sm text-warm-secondary">
                No sign-up required to browse. Your session is local and non-identifying.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background/70 p-6">
              <p className="text-eyebrow">Clarity</p>
              <h3 className="mt-2 font-serif text-headline">Myth-busting</h3>
              <p className="mt-2 text-sm text-warm-secondary">
                Evidence-informed explanations in simple language, without shame.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background/70 p-6">
              <p className="text-eyebrow">Support</p>
              <h3 className="mt-2 font-serif text-headline">When you need it</h3>
              <p className="mt-2 text-sm text-warm-secondary">
                If something feels urgent or overwhelming, we encourage professional help.
              </p>
              <Link href="/consult" className="inline-block mt-4 text-sm font-semibold text-warm-charcoal hover:underline">
                Explore expert help →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
          <div className="rounded-3xl border border-border bg-beige/60 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-eyebrow">Ready?</p>
              <h2 className="mt-2 font-serif text-headline text-warm-charcoal">Ask your question — no judgment.</h2>
              <p className="mt-2 text-sm text-warm-secondary max-w-xl">
                We focus on consent, safety, and respect — with a calm, India-first cultural lens.
              </p>
            </div>
            <Link href="/ask" className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'justify-center')}>
              Ask Anonymously
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
