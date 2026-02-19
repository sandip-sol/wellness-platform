import Card, { CardHeader, CardDescription, CardFooter } from '@/components/kit/Card';
import Button from '@/components/kit/Button';

interface Quiz {
    id: string;
    title: string;
    description: string;
}

interface QuizCardProps {
    quiz: Quiz;
    onStart: (quizId: string) => void;
}

export default function QuizCard({ quiz, onStart }: QuizCardProps) {
    return (
        <Card variant="default" hoverable>
            <CardHeader title={quiz.title} />
            <div style={{ padding: '0 var(--space-4)' }}>
                <CardDescription>{quiz.description}</CardDescription>
            </div>
            <CardFooter>
                    <Button onClick={() => onStart(quiz.id)} variant="primary" fullWidth>
                    Start Assessment
                </Button>
            </CardFooter>
        </Card>
    );
}
