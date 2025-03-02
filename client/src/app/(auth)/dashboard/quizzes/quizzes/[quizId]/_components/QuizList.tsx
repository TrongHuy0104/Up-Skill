'use client';
import React, { useEffect, useState } from 'react';
import QuizItem from './QuizItem';
import { QuizItemSkeleton } from '@/components/ui/Skeleton';

export default function QuizList(){
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:8000'; // Replace with your backend URL
        const response = await fetch(`${baseURL}/quizzes`);

        if (!response.ok) {
          throw new Error('Failed to fetch quizzes');
        }

        const data = await response.json();
        setQuizzes(data.quizzes); // Set the fetched quizzes to state
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
        {loading ? (
          // Show skeleton loading state while data is being fetched
          Array.from({ length: 5 }).map((_, index) => (
            <QuizItemSkeleton key={index} />
          ))
        ) : (
          // Render actual quiz items once data is loaded
          quizzes?.map((quiz, index) => (
            <QuizItem
              key={quiz._id}
              quiz={quiz}
              isFirst={index === 0} // Pass true for the first item
              isLast={index === quizzes.length - 1} // Pass true for the last item
            />
          ))
        )}
      </ul>
    </div>
  );
};

