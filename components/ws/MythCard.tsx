"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { WsBadge } from "@/components/ws/WsBadge";
import { cn } from "@/lib/utils";

export type Myth = {
  id: string;
  title: string;
  myth: string;
  fact: string;
  explanation?: string;
  culturalContext?: string;
  indiaContext?: string;
  riskFactors?: string;
  references?: string[];
  category?: string;
  tags?: string[];
};

function prettyCategory(cat?: string) {
  if (!cat) return "General";
  return cat
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function MythCard({ myth, className }: { myth: Myth; className?: string }) {
  const [open, setOpen] = useState(false);

  const categoryLabel = useMemo(() => prettyCategory(myth.category), [myth.category]);
  const tags = myth.tags ?? [];

  return (
    <article
      className={cn(
        "bg-beige border border-warm-border rounded-2xl overflow-hidden card-hover",
        className
      )}
    >
      {/* top accent like Serene cards */}
      <div className="h-1.5 bg-primary/40" aria-hidden="true" />

      <div className="p-7">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="font-serif text-xl font-medium text-foreground leading-snug">
            {myth.title}
          </h3>
          <WsBadge variant="apricot" size="sm">
            {categoryLabel}
          </WsBadge>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5" aria-label="Tags">
            {tags.slice(0, 6).map((t) => (
              <WsBadge key={t} variant="default" size="sm">
                {t}
              </WsBadge>
            ))}
          </div>
        )}

        {/* Myth / Fact blocks */}
        <div className="grid gap-4">
          <div className="bg-beige border border-warm-border rounded-2xl p-5">
            <div className="text-eyebrow mb-2">❌ Myth</div>
            <p className="text-sm text-warm-secondary leading-relaxed">{myth.myth}</p>
          </div>
          <div className="bg-secondary border border-border rounded-2xl p-5">
            <div className="text-eyebrow mb-2">✅ Fact</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{myth.fact}</p>
          </div>
        </div>

        {open && (
          <div className="mt-5 grid gap-4">
            {myth.explanation && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="text-eyebrow mb-2">💡 Why this matters</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {myth.explanation}
                </p>
              </div>
            )}

            {(myth.culturalContext || myth.indiaContext) && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="text-eyebrow mb-2">🌏 Cultural context</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {myth.culturalContext || myth.indiaContext}
                </p>
              </div>
            )}

            {myth.riskFactors && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="text-eyebrow mb-2">⚠️ Risk factors</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {myth.riskFactors}
                </p>
              </div>
            )}

            {myth.references && myth.references.length > 0 && (
              <div className="bg-beige border border-warm-border rounded-2xl p-5">
                <div className="text-eyebrow mb-3">📄 References</div>
                <ul className="space-y-2 text-sm text-warm-secondary">
                  {myth.references.map((ref, i) => (
                    <li key={`${myth.id}-ref-${i}`} className="leading-relaxed">
                      {ref}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "mt-6 w-full flex items-center justify-center gap-2",
            "border border-border rounded-full py-3 text-sm font-semibold",
            "hover:border-primary transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-expanded={open}
        >
          {open ? (
            <>
              Read less <ChevronUp size={16} aria-hidden="true" />
            </>
          ) : (
            <>
              Read more <ChevronDown size={16} aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </article>
  );
}
