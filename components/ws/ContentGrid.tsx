import * as React from "react";
import Link from "next/link";
import { Clock, Tag, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { WsBadge } from "@/components/ws/WsBadge";

export type LearnCardItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tag: string; // small eyebrow tag (e.g., Beginner, Verified)
  readTime: string;
};

/**
 * ContentCard — Serene-style learn article card (Next.js).
 */
export function ContentCard({ item, className }: { item: LearnCardItem; className?: string }) {
  return (
    <Link
      href={`/learn/${item.slug}`}
      className={cn(
        "card-hover group bg-card border border-border rounded-2xl overflow-hidden flex flex-col",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      aria-label={`Read article: ${item.title}`}
    >
      <div className="h-1.5 bg-primary/40" aria-hidden="true" />

      <div className="p-7 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <span className="text-eyebrow">{item.tag}</span>
          <span
            className="flex items-center gap-1 text-xs text-muted-foreground"
            aria-label={`${item.readTime} read`}
          >
            <Clock size={12} aria-hidden="true" />
            {item.readTime}
          </span>
        </div>

        <h3 className="font-serif text-xl font-medium text-foreground mb-3 group-hover:text-foreground/80 transition-colors leading-snug">
          {item.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
          {item.excerpt}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <WsBadge variant="default" size="md">
            <Tag size={10} aria-hidden="true" />
            {item.category}
          </WsBadge>
          <span className="text-sm font-semibold text-foreground flex items-center gap-1">
            Read <ChevronRight size={14} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * ContentGrid — responsive grid of learn cards.
 */
export function ContentGrid({
  items,
  className,
  emptyMessage = "No guides found. Try a different search.",
}: {
  items: LearnCardItem[];
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
    <div className={cn("grid sm:grid-cols-2 lg:grid-cols-3 gap-6", className)} role="list" aria-label="Articles">
      {items.map((item) => (
        <div key={item.slug} role="listitem">
          <ContentCard item={item} />
        </div>
      ))}
    </div>
  );
}
