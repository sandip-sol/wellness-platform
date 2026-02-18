'use client';

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/ws/WsDivider";
import { WsInput } from "@/components/ws/WsInput";
import { WsButton } from "@/components/ws/WsButton";

/**
 * NewsletterSignup — footer card with email input + subscribe button
 */
export interface NewsletterSignupProps {
  eyebrow?: string;
  heading?: string;
  description?: string;
  placeholder?: string;
  buttonLabel?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

export function NewsletterSignup({
  eyebrow = "Stay in the loop",
  heading = "Thoughtful content, weekly.",
  description = "No spam. Just gentle, evidence-based wellness insights delivered to your inbox.",
  placeholder = "your@email.com",
  buttonLabel = "Subscribe",
  onSubmit,
  className,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onSubmit?.(email);
    setSubmitted(true);
    setEmail("");
  };

  return (
    <div
      className={cn(
        "bg-background rounded-2xl border border-border p-8 md:p-12",
        "flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12",
        className
      )}
      aria-label="Newsletter signup"
    >
      <div className="flex-1">
        <SectionTitle
          eyebrow={eyebrow}
          heading={heading}
          align="left"
        />
        <p className="text-muted-foreground text-sm mt-2">{description}</p>
      </div>

      {submitted ? (
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span role="img" aria-label="Checkmark">✅</span> You're subscribed. Thank you!
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
          aria-label="Email subscription form"
          noValidate
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            aria-label="Email address"
            className={cn(
              "flex-1 sm:w-64 bg-card border border-border rounded-full",
              "px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "transition-colors duration-150"
            )}
          />
          <WsButton type="submit" variant="primary" size="md" className="whitespace-nowrap">
            {buttonLabel}
          </WsButton>
        </form>
      )}
    </div>
  );
}
