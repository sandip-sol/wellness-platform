import './globals.css';

import type { Metadata } from 'next';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AgeGuard } from '@/components/safety/AgeGuard';
import { QuickExit } from '@/components/safety/QuickExit';

import LenisScroll from '@/components/ui/LenisScroll';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Safe Space — Anonymous Sexual Wellness & Awareness',
  description:
    'A privacy-first, always-anonymous sexual wellness education platform. Ask questions anonymously, browse myth-busters, follow learning paths, and access expert support. India-first. 18+ only.',
  keywords: ['sexual wellness', 'sexual health', 'anonymous questions', 'India', 'myth busters', 'consent education', 'LGBTQIA'],
  openGraph: {
    title: 'Safe Space — Anonymous Sexual Wellness & Awareness',
    description: 'Ask anonymously. Learn without judgment. India-first sexual wellness education.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`min-h-screen ${playfair.variable} ${inter.variable} font-sans`}>
        <LenisScroll>
          <AgeGuard>
            <Navbar />
            <div aria-hidden="true" className="h-24" />
            <QuickExit />
            <main style={{ minHeight: 'calc(100vh - var(--navbar-height))' }}>{children}</main>
            <Footer />
          </AgeGuard>
        </LenisScroll>
      </body>
    </html>
  );
}
