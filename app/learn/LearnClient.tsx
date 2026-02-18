"use client";

import { useMemo, useState } from "react";
import { LearnPost } from "@/lib/learn";
import { SectionTitle } from "@/components/ws/WsDivider";
import { CategoryFilterBar } from "@/components/ws/CategoryFilterBar";
import { ContentGrid, type LearnCardItem } from "@/components/ws/ContentGrid";

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*_~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function makeExcerpt(content: string, maxLen = 170): string {
  const clean = stripMarkdown(content);
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen).trimEnd() + "…";
}

function readTimeFromContent(content: string): string {
  const words = stripMarkdown(content).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}

export default function LearnClient({ posts }: { posts: LearnPost[] }) {
  const categories = useMemo(() => {
    const unique = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
    unique.sort((a, b) => a.localeCompare(b));
    return ["All", ...unique];
  }, [posts]);

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  const items = useMemo<LearnCardItem[]>(() => {
    const filtered = posts.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const q = search.trim().toLowerCase();
      const matchSearch =
        q === "" ||
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    return filtered.map((p) => {
      const tag = p.verified ? "Expert-reviewed" : p.level || "Guide";
      return {
        slug: p.slug,
        title: p.title,
        excerpt: makeExcerpt(p.content),
        category: p.category || "General",
        tag,
        readTime: readTimeFromContent(p.content),
      };
    });
  }, [posts, activeCategory, search]);

  return (
    <main className="bg-background min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionTitle
          eyebrow="Educational library"
          heading="Learn at your own pace"
          subtitle="Evidence-informed guides on body literacy, consent, relationships, and wellness — written with care."
          align="left"
          headingAs="h1"
          className="mb-12 animate-fade-up max-w-2xl"
        />

        <CategoryFilterBar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search guides…"
          className="mb-10"
        />

        <ContentGrid items={items} />
      </div>
    </main>
  );
}
