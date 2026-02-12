"use client";

import { useEffect, useRef, useCallback } from 'react';
import { AlertTriangle, Shield, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgeGateProps {
  onVerify: () => void;
  onReject: () => void;
}

export function AgeGate({ onVerify, onReject }: AgeGateProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const verifyButtonRef = useRef<HTMLButtonElement>(null);
  const rejectButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trapping - keep focus inside the modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    }

    // Allow Escape to close (triggers reject)
    if (e.key === 'Escape') {
      onReject();
    }
  }, [onReject]);

  // Set initial focus and add keyboard listeners
  useEffect(() => {
    // Focus the verify button on mount
    verifyButtonRef.current?.focus();

    // Add keyboard listener
    document.addEventListener('keydown', handleKeyDown);

    // Prevent scrolling on body
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <div 
      className="fixed inset-0 z-[800] flex items-center justify-center bg-warm-charcoal/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-description"
    >
      <div 
        ref={modalRef}
        className={`w-full max-w-md bg-white rounded-3xl shadow-xl p-8 ${
          prefersReducedMotion ? '' : 'animate-fade-in-up'
        }`}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-coral-subtle rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-coral" aria-hidden="true" />
          </div>
          <h2 
            id="age-gate-title"
            className="text-2xl font-bold text-warm-charcoal mb-2"
          >
            Age Verification Required
          </h2>
          <p id="age-gate-description" className="text-warm-gray">
            This website contains educational content about sexual health and wellness.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3 p-4 bg-teal-subtle/50 rounded-xl">
            <Shield className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="font-medium text-warm-charcoal text-sm">Strictly Educational</p>
              <p className="text-warm-gray text-sm">No explicit or pornographic content</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-teal-subtle/50 rounded-xl">
            <UserCheck className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="font-medium text-warm-charcoal text-sm">18+ Only</p>
              <p className="text-warm-gray text-sm">You must be of legal age to enter</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            ref={verifyButtonRef}
            onClick={onVerify}
            className="w-full btn-primary text-base py-6"
            aria-label="I am 18 years or older - Enter the website"
          >
            I am 18 or older
          </Button>
          <Button
            ref={rejectButtonRef}
            onClick={onReject}
            variant="ghost"
            className="w-full text-warm-gray hover:text-warm-charcoal"
            aria-label="I am under 18 years old - Leave the website"
          >
            I am under 18
          </Button>
        </div>

        <p className="text-center text-xs text-warm-light mt-6">
          By entering, you confirm you are of legal age to view educational content about sexual health.
        </p>
      </div>
    </div>
  );
}
