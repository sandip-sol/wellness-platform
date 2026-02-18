"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Filter } from "lucide-react";
import { CategoryFilterBar } from "@/components/ws/CategoryFilterBar";
import { QuestionList, type KBCardItem } from "@/components/ws/QuestionList";

type Category = { id: string; name: string; icon?: string; questionCount?: number };

export default function KBClient({ initialQAs, categories }: { initialQAs: any[]; categories: Category[] }) {
    const [qas, setQas] = useState<any[]>(initialQAs);
    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const categoryIdByName = useMemo(() => {
        const map: Record<string, string> = {};
        for (const c of categories) map[c.name] = c.id;
        return map;
    }, [categories]);

    const catChips = useMemo(() => {
        const names = categories.map((c) => c.name);
        return ["All", ...names];
    }, [categories]);

    useEffect(() => {
        // Skip fetch on initial mount — we already have SSR data
        if (activeCategory === "All" && !search) {
            setQas(initialQAs);
            return;
        }

        const fetchFiltered = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                const categoryId = activeCategory !== "All" ? categoryIdByName[activeCategory] : "";
                if (categoryId) params.set("category", categoryId);
                if (search) params.set("search", search);
                const res = await fetch(`/api/kb?${params}`);
                const data = await res.json();
                setQas(data.qas || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchFiltered, 300);
        return () => clearTimeout(timer);
    }, [activeCategory, search, initialQAs, categoryIdByName]);

    // Re-fetch when user filters/searches (client-side interactivity)


    // API expects category IDs; UI uses category names.

    const items = useMemo<KBCardItem[]>(() => {
        return (qas || []).map((qa) => {
            const answer = String(qa.answer || "").trim();
            const preview = answer.length > 180 ? answer.slice(0, 180).trimEnd() + "…" : answer;
            const tags = Array.isArray(qa.tags) ? qa.tags : [];
            return {
                slug: qa.slug,
                question: qa.question,
                answerPreview: preview,
                tags,
                helpfulCount: qa.helpfulCount,
            };
        });
    }, [qas]);

    // NOTE: The API expects category IDs; UI uses category names.

    return (
        <>
            <CategoryFilterBar
                categories={catChips}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search questions…"
                className="mb-8"
            />

            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground" aria-live="polite" role="status">
                    {qas.length} answer{qas.length !== 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Filter size={14} aria-hidden="true" />
                    <span className="text-sm">Browse & search</span>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20" role="status" aria-live="polite">
                    <p className="font-serif text-xl text-muted-foreground">Loading…</p>
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-20" role="status" aria-live="polite">
                    <p className="font-serif text-xl text-muted-foreground">
                        No questions found{search ? ". Try a different search term." : "."}
                    </p>
                    <div className="mt-8">
                        <Link
                            href="/ask"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground font-semibold px-7 py-3.5 rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            Be the first to ask →
                        </Link>
                    </div>
                </div>
            ) : (
                <QuestionList items={items} />
            )}
        </>
    );
}