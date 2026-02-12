"use client";

import { useEffect, useState } from 'react';
import { AgeGate } from '@/components/safety/AgeGate';

/**
 * Simple age gate wrapper for routes that don't go through <App /> (e.g., /learn, /admin).
 * Keeps existing site behavior intact while enforcing the same 18+ gate across pages.
 */
export function AgeGuard({ children }: { children: React.ReactNode }) {
  const [ageVerified, setAgeVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const verified = localStorage.getItem('ageVerified');
    setAgeVerified(verified === 'true');
  }, []);

  const handleAgeVerify = () => {
    localStorage.setItem('ageVerified', 'true');
    setAgeVerified(true);
  };

  const handleAgeReject = () => {
    window.location.href = 'https://www.google.com';
  };

  if (ageVerified === null) return null;

  if (!ageVerified) {
    return <AgeGate onVerify={handleAgeVerify} onReject={handleAgeReject} />;
  }

  return <>{children}</>;
}
