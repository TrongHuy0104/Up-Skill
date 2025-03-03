import React, { useEffect, useState } from 'react';
import QuizItem from './QuizItem';
import { QuizItemSkeleton } from '@/components/ui/Skeleton';

export default function QuizList({ onQuizClick }: { onQuizClick: (quizId: string) => void }) {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const baseURL = process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:8000';
                const response = await fetch(`${baseURL}/quizzes`);

                if (!response.ok) {
                    throw new Error('Failed to fetch quizzes');
                }

                const data = await response.json();
                setQuizzes(data.quizzes);
            } catch (err) {
                setError('Failed to fetch quizzes. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="p-4">
            <ul className="space-y-4">
                {loading
                    ? Array.from({ length: 5 }).map((_, index) => <QuizItemSkeleton key={index} />)
                    : quizzes?.map((quiz, index) => (
                          <QuizItem
                              key={quiz._id}
                              quiz={quiz}
                              isFirst={index === 0}
                              isLast={index === quizzes.length - 1}
                              onClick={() => onQuizClick(quiz._id)} // Khi click quiz, gọi onQuizClick
                          />
                      ))}
            </ul>
        </div>
    );
}
