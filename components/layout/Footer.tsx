import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { NewsletterSignup } from '@/components/ws/NewsletterSignup';

const footerLinks: Record<string, Array<{ label: string; href: string }>> = {
  Learn: [
    { label: 'Learn Home', href: '/learn' },
    { label: 'Body Literacy', href: '/learn?cat=body-literacy' },
    { label: 'Consent Basics', href: '/learn?cat=consent' },
    { label: 'Myths vs Facts', href: '/myths' },
    { label: 'Relationships', href: '/learn?cat=relationships' },
  ],
  'Q&A': [
    { label: 'Ask Anonymously', href: '/ask' },
    { label: 'Knowledge Base', href: '/kb' },
    { label: 'Learning Paths', href: '/paths' },
  ],
  Quizzes: [
    { label: 'Singles Self-Check', href: '/single' },
    { label: 'Couples Check-in', href: '/couples' },
    { label: 'All Quizzes', href: '/quizzes' },
  ],
  Policies: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Expert Help', href: '/consult' },
    { label: 'Journal', href: '/journal' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-10">
        {/* Newsletter Card */}
        <NewsletterSignup className="mb-14" />

        {/* Links Grid */}
        <nav aria-label="Footer navigation">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <p className="text-sm font-semibold text-warm-charcoal mb-4">{title}</p>
                <ul className="space-y-3">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-warm-secondary hover:text-warm-charcoal transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 border-t border-border">
          <div className="flex items-center gap-2 text-warm-charcoal">
            <Leaf className="h-4 w-4" aria-hidden="true" />
            <span className="font-serif font-semibold">Safe Space</span>
          </div>

          <p className="text-xs text-warm-secondary max-w-2xl">
            Educational content only — not medical advice. If you have urgent concerns or symptoms, consult a qualified clinician.
          </p>

          <p className="text-xs text-warm-secondary">© {new Date().getFullYear()} Safe Space</p>
        </div>
      </div>
    </footer>
  );
}
