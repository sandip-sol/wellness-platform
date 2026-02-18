import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * WsDivider — horizontal rule with optional decorative leaf motif
 */
export interface WsDividerProps {
  className?: string;
  decorative?: boolean;
}

export function WsDivider({ className, decorative = false }: WsDividerProps) {
  if (decorative) {
    return (
      <div className={cn("flex items-center gap-4 my-8", className)} aria-hidden="true">
        <div className="flex-1 h-px bg-border" />
        <span className="text-muted-foreground text-sm select-none">🌿</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    );
  }

  return (
    <hr
      className={cn("border-0 border-t border-border my-8", className)}
      aria-hidden="true"
    />
  );
}

/**
 * SectionTitle — eyebrow + serif headline + optional subtitle
 * The core editorial typography atom used across every section.
 */
export interface SectionTitleProps {
  eyebrow?: string;
  heading: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  headingAs?: "h1" | "h2" | "h3" | "h4";
  /** If true, heading uses text-display scale, else text-headline */
  display?: boolean;
}

export function SectionTitle({
  eyebrow,
  heading,
  subtitle,
  align = "center",
  className,
  headingAs: Tag = "h2",
  display = false,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "text-center items-center",
        align === "left" && "text-left items-start",
        className
      )}
    >
      {eyebrow && (
        <span className="text-eyebrow">{eyebrow}</span>
      )}
      <Tag
        className={cn(
          "font-serif text-foreground",
          display ? "text-display" : "text-headline"
        )}
      >
        {heading}
      </Tag>
      {subtitle && (
        <p className="text-subheadline max-w-xl">{subtitle}</p>
      )}
    </div>
  );
}
