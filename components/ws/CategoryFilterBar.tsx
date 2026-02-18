import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { WsChip } from "@/components/ws/WsBadge";

/**
 * CategoryFilterBar — Serene-style filter chips + optional search.
 * Used on Learn + Knowledge Base pages.
 */
export interface CategoryFilterBarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  className?: string;
}

export function CategoryFilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search…",
  className,
}: CategoryFilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row gap-4 items-start md:items-center",
        className
      )}
      role="group"
      aria-label="Filter content"
    >
      <div className="flex flex-wrap gap-2 flex-1" role="group" aria-label="Category filters">
        {categories.map((cat) => (
          <WsChip
            key={cat}
            active={activeCategory === cat}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </WsChip>
        ))}
      </div>

      {onSearchChange !== undefined && (
        <div className="relative flex-shrink-0 w-full md:w-auto">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchValue ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className={cn(
              "pl-10 pr-5 py-2.5 border border-border rounded-full",
              "text-sm bg-card text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-72",
              "transition-colors duration-150"
            )}
          />
        </div>
      )}
    </div>
  );
}
