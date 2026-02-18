import * as React from "react";
import Image from "next/image";
import { ChevronRight, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { WsBadge } from "@/components/ws/WsBadge";

export interface WsQuiz {
  id: string;
  title: string;
  description: string;
  questionCount?: number;
}

export interface WsQuizCardProps {
  quiz: WsQuiz;
  illustrationSrc?: string;
  onStart: (quizId: string) => void;
  className?: string;
}

function getBadge(quizId: string): { label: string; variant: "active" | "sage" } {
  // We only have a couple quizzes today; keep it deterministic and future-proof.
  if (quizId.toLowerCase().includes("relationship") || quizId.toLowerCase().includes("couple")) {
    return { label: "Couples", variant: "active" };
  }
  return { label: "Self-check", variant: "sage" };
}

function estimateMinutes(questionCount?: number) {
  const n = typeof questionCount === "number" ? questionCount : 6;
  // ~30–40s per question, plus a little reading time.
  return Math.max(2, Math.ceil(n * 0.5));
}

export function WsQuizCard({ quiz, illustrationSrc, onStart, className }: WsQuizCardProps) {
  const badge = getBadge(quiz.id);
  const minutes = estimateMinutes(quiz.questionCount);
  const questions = quiz.questionCount ?? 0;

  return (
    <article
      className={cn(
        "bg-card border border-border rounded-2xl overflow-hidden card-hover flex flex-col",
        className
      )}
      aria-label={quiz.title}
    >
      {/* Illustration area */}
      <div className="h-52 relative bg-secondary overflow-hidden">
        {illustrationSrc ? (
          <Image
            src={illustrationSrc}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center opacity-80"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-30 select-none" aria-hidden="true">
              🌿
            </span>
          </div>
        )}

        {/* Badge overlay */}
        <div className="absolute top-4 left-4">
          <WsBadge variant={badge.variant} size="md">
            {badge.label}
          </WsBadge>
        </div>
      </div>

      {/* Body */}
      <div className="p-8 flex flex-col flex-1">
        <h2 className="font-serif text-2xl font-medium text-foreground mb-3">{quiz.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{quiz.description}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-6 text-xs text-muted-foreground" aria-label="Quiz details">
          <span className="flex items-center gap-1.5">
            <Clock size={12} aria-hidden="true" /> {minutes} min
          </span>
          {questions > 0 ? <span>{questions} questions</span> : <span>Quick reflection</span>}
          <span>Private</span>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => onStart(quiz.id)}
          className={cn(
            "w-full py-3.5 rounded-full text-sm font-semibold transition-colors",
            "flex items-center justify-center gap-2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            badge.variant === "active"
              ? "bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground"
              : "border border-border hover:border-primary text-foreground"
          )}
        >
          Start {badge.label === "Couples" ? "Check-in" : "Self-Check"}
          <ChevronRight size={15} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
