import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { WsBadge } from "@/components/ws/WsBadge";

export type KBCardItem = {
  slug: string;
  question: string;
  answerPreview: string;
  tags: string[];
  helpfulCount?: number;
};

/**
 * QuestionCard — Serene-style Q&A card (adapted for Knowledge Base).
 */
export function QuestionCard({ item, className }: { item: KBCardItem; className?: string }) {
  return (
    <Link
      href={`/kb/${item.slug}`}
      className={cn(
        "card-hover block bg-card border border-border rounded-2xl p-7 group",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      aria-label={`Read answer for: ${item.question}`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-serif text-lg font-medium text-foreground leading-snug group-hover:text-foreground/80 transition-colors">
          {item.question}
        </h3>
        {typeof item.helpfulCount === "number" && (
          <span className="text-xs text-muted-foreground flex-shrink-0 mt-1">👍 {item.helpfulCount}</span>
        )}
      </div>

      {item.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4" role="list" aria-label="Topics">
          {item.tags.slice(0, 6).map((tag) => (
            <WsBadge key={tag} variant="default" size="sm" role="listitem">
              {tag}
            </WsBadge>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
        {item.answerPreview}
      </p>

      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-foreground">
        Read full answer <ChevronRight size={14} aria-hidden="true" />
      </span>
    </Link>
  );
}

export function QuestionList({
  items,
  className,
  emptyMessage = "No questions in this category yet.",
}: {
  items: KBCardItem[];
  className?: string;
  emptyMessage?: string;
}) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20" role="status" aria-live="polite">
        <p className="font-serif text-xl text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} role="list" aria-label="Knowledge base questions">
      {items.map((item) => (
        <div key={item.slug} role="listitem">
          <QuestionCard item={item} />
        </div>
      ))}
    </div>
  );
}
