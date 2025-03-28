'use client'

import React, { useEffect, useState } from 'react';
import QuizItem from './QuizItem';
import { QuizItemSkeleton } from '@/components/ui/Skeleton';
import { toast } from '@/hooks/use-toast';

export default function QuizList({ onQuizClick }: Readonly<{ onQuizClick: (quizId: string) => void }>) {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const baseURL = process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:8000/api';
                const response = await fetch(`${baseURL}/quizzes`, {
                    credentials: 'include', // gửi cookie kèm theo
                });
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

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const baseURL = process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:8000/api';
                const response = await fetch(`${baseURL}/courses/user-courses`, {
                    credentials: 'include', // gửi cookie kèm theo
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }

                const data = await response.json();

                setCourses(data.data);
            } catch (err) {
                setError('Failed to fetch courses. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);


    // Handle quiz updates
    const handleQuizUpdate = (updatedQuiz: any) => {

        setQuizzes((prevQuizzes) =>
            prevQuizzes.map((quiz) => (quiz._id === updatedQuiz._id ? updatedQuiz : quiz))
        );
    };

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }
    // Handle delete
    const handleDeleteQuiz = async (quizId: string) => {
        try {
            const baseURL = process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:8000';
            const response = await fetch(`${baseURL}/quizzes/${quizId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete quiz');

            setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz._id !== quizId));
            toast({
                variant: 'success',
                title: 'Quiz Deleted!'
            });
        } catch (err) {
            console.error('Error deleting quiz:', err);
        }
    };

    return (
        <div className="p-4">
            <ul className="space-y-4">
                {loading
                    ? Array(5).map((_, index) => <QuizItemSkeleton key={(index + 1)} />)
                    : quizzes?.map((quiz, index) => (
                        <QuizItem
                            courses={courses}
                            key={quiz._id}
                            quiz={quiz}
                            isFirst={index === 0}
                            isLast={index === quizzes.length - 1}
                            onClick={() => onQuizClick(quiz._id)} // Use the onQuizClick prop
                            // userId="" // Replace with actual user ID
                            onUpdate={handleQuizUpdate} // Pass the handleQuizUpdate function
                            onDelete={handleDeleteQuiz} // Pass handleDeleteQuiz to onDelete
                        />
                    ))}
            </ul>
        </div>
    );
}