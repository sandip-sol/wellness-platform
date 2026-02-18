import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * WsButton — Wellness-themed button atom
 * Variants: primary | secondary | ghost | outline
 * Sizes: sm | md | lg
 */
const buttonVariants = cva(
  // Base styles
  [
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold",
    "transition-colors duration-200 focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none select-none",
    "whitespace-nowrap",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "bg-transparent text-foreground hover:bg-muted",
        outline:
          "border border-border bg-transparent text-foreground hover:border-primary hover:bg-primary/10",
      },
      size: {
        sm: "text-xs px-4 py-2",
        md: "text-sm px-6 py-3",
        lg: "text-base px-8 py-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface WsButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const WsButton = React.forwardRef<HTMLButtonElement, WsButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
WsButton.displayName = "WsButton";

export { buttonVariants };
