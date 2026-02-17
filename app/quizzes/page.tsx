'use client';

import { useState } from 'react';
import quizzesData from '@/data/quizzes.json';
import QuizCard from '@/components/quizzes/QuizCard';
import QuizView from '@/components/quizzes/QuizView';

export default function QuizzesPage() {
    const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

    const activeQuiz = activeQuizId ? quizzesData.find(q => q.id === activeQuizId) : null;

    if (activeQuiz) {
        return (
            <div style={{ padding: 'var(--space-8) var(--space-4)' }}>
                <QuizView quiz={activeQuiz} onBack={() => setActiveQuizId(null)} />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-12) var(--space-6)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                <h1 style={{ marginBottom: 'var(--space-4)' }}>Quizzes & Assessments</h1>
                <p style={{ color: 'var(--color-ink-light)', fontSize: 'var(--font-size-lg)', maxWidth: '600px', margin: '0 auto' }}>
                    Discover more about yourself and your relationships with our self-assessments.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 'var(--space-6)'
            }}>
                {quizzesData.map(quiz => (
                    <QuizCard
                        key={quiz.id}
                        quiz={quiz}
                        onStart={setActiveQuizId}
                    />
                ))}
            </div>
        </div>
    );
}
