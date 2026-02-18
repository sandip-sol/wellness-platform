import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * WsBadge / WsChip — theme-consistent pill badge
 * Variants: default | active | subtle | sage
 */
const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-full text-xs font-medium",
    "border transition-colors duration-150 focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-background border-border text-muted-foreground",
        active:
          "bg-primary border-primary text-primary-foreground font-semibold",
        subtle:
          "bg-muted border-border text-foreground",
        sage:
          "bg-secondary border-secondary text-secondary-foreground",
        apricot:
          "bg-primary/20 border-primary/40 text-foreground",
      },
      size: {
        sm: "px-2.5 py-0.5 text-[0.65rem]",
        md: "px-3 py-1",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface WsBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function WsBadge({ className, variant, size, ...props }: WsBadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

/** Clickable chip version — for filter bars */
export interface WsChipProps extends WsBadgeProps {
  active?: boolean;
  onClick?: () => void;
}

export function WsChip({ active, onClick, className, children, ...props }: WsChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        badgeVariants({ variant: active ? "active" : "default" }),
        "cursor-pointer hover:border-primary focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        className
      )}
      aria-pressed={active}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
