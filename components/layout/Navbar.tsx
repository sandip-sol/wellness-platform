'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ws/WsButton';

const NAV_LINKS: Array<{ label: string; href: string }> = [
  { label: 'Learn', href: '/learn' },
  { label: 'Knowledge Base', href: '/kb' },
  { label: 'Myths', href: '/myths' },
  { label: 'Paths', href: '/paths' },
  { label: 'Quizzes', href: '/quizzes' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-cream/95 backdrop-blur-sm border-b border-border' : 'bg-cream/80 backdrop-blur-sm'
      )}
    >
      {/* Announcement Bar */}
      <div className="announcement-bar text-center py-2 px-4 text-xs sm:text-sm">
        🌿 Anonymous • Evidence-informed • Safe space for everyone ✨
      </div>

      {/* Main Nav */}
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-serif text-xl font-semibold text-warm-charcoal tracking-tight">
          Safe Space
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href || pathname?.startsWith(l.href + '/');
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'px-3 py-2 rounded-full text-sm font-medium transition-colors',
                  active ? 'bg-beige text-warm-charcoal' : 'text-warm-secondary hover:text-warm-charcoal hover:bg-beige/70'
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/ask"
            className={cn(buttonVariants({ variant: 'primary', size: 'sm' }), 'shadow-sm')}
          >
            Ask Anonymously
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-full p-2 border border-border bg-background"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-cream/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-2">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href || pathname?.startsWith(l.href + '/');
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    'px-4 py-3 rounded-2xl text-sm font-medium border border-border',
                    active ? 'bg-beige text-warm-charcoal' : 'bg-background text-warm-secondary hover:text-warm-charcoal'
                  )}
                >
                  {l.label}
                </Link>
              );
            })}

            <Link
              href="/ask"
              className={cn(buttonVariants({ variant: 'primary', size: 'md' }), 'w-full justify-center mt-2')}
            >
              Ask Anonymously
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
