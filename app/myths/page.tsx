import Link from "next/link";
import MythCard from "@/components/ws/MythCard";
import { SectionTitle } from "@/components/ws/WsDivider";
import mythsData from "@/data/myths.json";

export const metadata = {
  title: "Myth Busters — Safe Space",
  description:
    "Debunking common sexual health myths with facts, evidence, and India-specific context.",
};

export default function MythsPage() {
  return (
    <main className="bg-background min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <SectionTitle
          eyebrow="Myth-busting library"
          heading="Myth Busters"
          subtitle="Separating facts from fiction with evidence-based answers and India-specific context."
          align="center"
          headingAs="h1"
          className="mb-10 animate-fade-up"
        />

        <div className="bg-beige border border-warm-border rounded-2xl p-6 text-center max-w-2xl mx-auto mb-10">
          <p className="text-sm text-warm-secondary">
            💡 Every myth-buster is grounded in reputable guidance and research. Sources are listed inside each card.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 stagger-children">
          {mythsData.map((myth) => (
            <MythCard key={myth.id} myth={myth as any} />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            Know a myth that should be busted? Let us know.
          </p>
          <Link
            href="/ask"
            className="inline-flex items-center gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground font-semibold px-7 py-3.5 rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Suggest a Myth →
          </Link>
        </div>
      </div>
    </main>
  );
}
