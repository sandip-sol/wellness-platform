'use client';

import { useState } from 'react';
import Card, { CardHeader, CardDescription, CardFooter } from '@/components/kit/Card';
import Button from '@/components/kit/Button';

interface Option {
    text: string;
    score: number;
}

interface Question {
    id: string;
    text: string;
    options: Option[];
}

interface Result {
    minScore: number;
    maxScore: number;
    title: string;
    description: string;
}

interface Quiz {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    results: Result[];
}

interface QuizViewProps {
    quiz: Quiz;
    onBack: () => void;
}

export default function QuizView({ quiz, onBack }: QuizViewProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);

    const currentQuestion = quiz.questions[currentQuestionIndex];

    const handleOptionSelect = (optionScore: number) => {
        const newScore = score + optionScore;
        setScore(newScore);

        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setCompleted(true);
        }
    };

    const getResult = () => {
        return quiz.results.find(r => score >= r.minScore && score <= r.maxScore) || {
            title: 'Assessment Complete',
            description: 'Thank you for completing this assessment.'
        };
    };

    if (completed) {
        const result = getResult();
        return (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Card variant="default">
                    <CardHeader title={result.title} />
                    <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                        <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-4)' }}>
                            {result.description}
                        </p>
                        <div style={{
                            background: 'var(--color-surface-sunken)',
                            padding: 'var(--space-4)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 'var(--space-6)'
                        }}>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>Your Score: {score}</p>
                        </div>
                    </div>
                    <CardFooter>
                        <div style={{ display: 'flex', gap: 'var(--space-3)', width: '100%' }}>
                            <Button onClick={onBack} variant="outline" style={{ flex: 1 }}>
                                Back to Quizzes
                            </Button>
                            <Button onClick={() => {
                                setScore(0);
                                setCurrentQuestionIndex(0);
                                setCompleted(false);
                            }} variant="primary" style={{ flex: 1 }}>
                                Retake Quiz
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--space-4)' }}>
                <Button onClick={onBack} variant="ghost" size="sm">
                    ← Back to List
                </Button>
            </div>

            <Card variant="default">
                <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-ink-light)' }}>
                            {quiz.title}
                        </span>
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'bold' }}>
                            {currentQuestionIndex + 1} / {quiz.questions.length}
                        </span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--color-surface-sunken)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
                            background: 'var(--color-primary)',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                </div>

                <div style={{ padding: 'var(--space-6)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-6)' }}>
                        {currentQuestion.text}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {currentQuestion.options.map((option, index) => (
                            <Button
                                key={index}
                                onClick={() => handleOptionSelect(option.score)}
                                variant="outline"
                                style={{ justifyContent: 'flex-start', textAlign: 'left', height: 'auto', padding: 'var(--space-4)' }}
                            >
                                {option.text}
                            </Button>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}
