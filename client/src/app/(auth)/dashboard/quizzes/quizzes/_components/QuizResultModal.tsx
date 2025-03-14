'use client';

import React, { useEffect, useState } from 'react';
import { RiCheckLine } from 'react-icons/ri';
import { BsClockHistory } from 'react-icons/bs';
import { QuizHeader } from './QuizHeader';
import Border from './Border';

interface QuizResultModalProps {
  readonly quizId: string;
  // readonly userId: string;
  readonly onClose: () => void;
}

interface QuizData {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: number;
  passingScore: number;
  questions: Array<{
    text: string;
    points: number;
  }>;
  userScores: Array<{
    user?: {
      _id: string;
      name: string;
      email: string;
      avatar?: {
        url: string;
      };
    };
    score: number | string;
    attemptedAt: string;
  }>;
}

export default function QuizResultModal({ quizId, onClose }: QuizResultModalProps) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:8000';
        const response = await fetch(`${baseURL}/quizzes/${quizId}`);
        if (!response.ok) throw new Error('Failed to fetch quiz');

        const data = await response.json();
        setQuiz(data.quiz);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId]);

  if (loading) return <div>Loading results...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!quiz) return <div>Quiz not found</div>;


  const formattedStudents =
    quiz.userScores && quiz.userScores.length != 0
      ? quiz.userScores.map((scoreEntry) => {
        return {
          imageUrl: scoreEntry.user?.avatar?.url || '/default-avatar.png',
          name: scoreEntry.user?.name || 'Unknown User',
          score: `${Number(scoreEntry.score)}`,
          attempts: '1 attempt',
          finishTime: new Date(scoreEntry.attemptedAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }),
        };
      })
      : null; // No attempts

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        {/* Quiz Header */}
        <QuizHeader quiz={quiz} />
        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-6">
          <div className="p-4 bg-accent-100 rounded-lg">
            <div className="flex items-center gap-2">
              <RiCheckLine />
              <h3 className="text-lg font-semibold">Passing Score</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {quiz.passingScore}
            </p>
          </div>

          <div className="p-4 bg-accent-100 rounded-lg">
            <div className="flex items-center gap-2">
              <BsClockHistory />
              <h3 className="text-lg font-semibold">Time Taken</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {quiz.duration} mins
            </p>
          </div>
        </div>

        {/* Student Results */}
        {formattedStudents ? (
          <Border students={formattedStudents} />
        ) : (
          <div className="text-center text-gray-500 py-4">
            Nobody attempted this quiz.
          </div>
        )}
        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}