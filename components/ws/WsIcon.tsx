import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * WsIcon — accessible thin-line icon wrapper
 * Wraps any lucide-react icon with consistent sizing, color, and optional container
 */

export type WsIconSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeMap: Record<WsIconSize, { icon: number; container: string }> = {
  xs: { icon: 12, container: "w-6 h-6" },
  sm: { icon: 16, container: "w-8 h-8" },
  md: { icon: 20, container: "w-11 h-11" },
  lg: { icon: 24, container: "w-14 h-14" },
  xl: { icon: 32, container: "w-18 h-18" },
};

export interface WsIconProps {
  icon: React.ElementType;
  size?: WsIconSize;
  className?: string;
  containerClassName?: string;
  /** When true, wraps icon in a circle container */
  contained?: boolean;
  /** bg variant for contained mode */
  containerVariant?: "cream" | "beige" | "sage" | "apricot";
  "aria-label"?: string;
  "aria-hidden"?: boolean | "true" | "false";
  strokeWidth?: number;
}

const containerVariantMap: Record<string, string> = {
  cream: "bg-background border border-border",
  beige: "bg-muted border border-border",
  sage: "bg-secondary border border-secondary",
  apricot: "bg-primary border border-primary",
};

export function WsIcon({
  icon: Icon,
  size = "md",
  className,
  containerClassName,
  contained = false,
  containerVariant = "cream",
  strokeWidth = 1.5,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
}: WsIconProps) {
  const { icon: iconSize, container } = sizeMap[size];

  const iconEl = (
    <Icon
      size={iconSize}
      strokeWidth={strokeWidth}
      className={cn("text-foreground flex-shrink-0", className)}
      aria-hidden={ariaHidden ?? (ariaLabel ? undefined : "true")}
      aria-label={ariaLabel}
    />
  );

  if (contained) {
    return (
      <span
        className={cn(
          "rounded-full flex items-center justify-center flex-shrink-0",
          container,
          containerVariantMap[containerVariant],
          containerClassName
        )}
        aria-hidden={!ariaLabel ? "true" : undefined}
        aria-label={ariaLabel}
      >
        {iconEl}
      </span>
    );
  }

  return iconEl;
}
