'use client';

import { useState } from 'react';
import quizzesData from '@/data/quizzes.json';
import { SectionTitle } from '@/components/ws/WsDivider';
import { WsQuizCard } from '@/components/ws/WsQuizCard';
import QuizView from '@/components/quizzes/QuizView';

export default function QuizzesPage() {
    const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

    const activeQuiz = activeQuizId ? quizzesData.find(q => q.id === activeQuizId) : null;

    if (activeQuiz) {
        return (
            <main className="bg-background min-h-screen pt-28 pb-20">
                <div className="max-w-3xl mx-auto px-6 lg:px-8">
                    <QuizView quiz={activeQuiz} onBack={() => setActiveQuizId(null)} />
                </div>
            </main>
        );
    }

    return (
        <main className="bg-background min-h-screen pt-28 pb-20">
            <div className="max-w-5xl mx-auto px-6 lg:px-8">
                <SectionTitle
                    eyebrow="Reflection tools"
                    heading="Gentle self-check quizzes"
                    subtitle="Not tests — reflections. Designed to help you understand yourself and your relationships better."
                    align="center"
                    headingAs="h1"
                    className="mb-14 animate-fade-up"
                />

                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    {quizzesData.map((quiz, i) => (
                        <WsQuizCard
                            key={quiz.id}
                            quiz={{
                                id: quiz.id,
                                title: quiz.title,
                                description: quiz.description,
                                questionCount: quiz.questions?.length,
                            }}
                            illustrationSrc={i % 2 === 0 ? "/illustrations/botanical-hero.png" : "/illustrations/botanical-accent.png"}
                            onStart={setActiveQuizId}
                        />
                    ))}
                </div>

                <div className="max-w-lg mx-auto rounded-2xl bg-card p-6 text-sm text-muted-foreground">
                    All quiz responses are private and never stored. These are reflection tools — not diagnostic assessments.
                </div>
            </div>
        </main>
    );
}
