'use client';

import React, { useEffect, useState } from 'react';
import { RiCheckLine } from 'react-icons/ri';
import { GrScorecard } from 'react-icons/gr';
import { BsClockHistory } from 'react-icons/bs';
import { Quiz } from '@/types/Quiz';

interface QuizResultModalProps {
  readonly quizId: string;
  readonly userId: string;
  readonly onClose: () => void;
}

export default function QuizResultModal({ quizId, userId, onClose }: QuizResultModalProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the current user's attempt
  const userAttempt = quiz?.userScores?.user?._id === userId
    ? { 
        score: quiz.userScores.score, 
        attemptedAt: new Date(quiz.userScores.attemptedAt) 
      }
    : { 
        score: 0, 
        attemptedAt: new Date() 
      };

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

  // Calculate derived values
  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
  const percentageScore = (userAttempt.score / totalPoints) * 100;
  const isPassed = percentageScore >= quiz.passingScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Quiz Results</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Quiz Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">{quiz.title}</h1>
          <p className="text-gray-600 mt-2">{quiz.description}</p>
          
          <div className="mt-4 flex gap-4 text-sm text-gray-500">
            <span>Difficulty: {quiz.difficulty}</span>
            <span>|</span>
            <span>Max Attempts: {quiz.maxAttempts}</span>
            <span>|</span>
            <span>Passing Score: {quiz.passingScore}%</span>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <GrScorecard className="text-blue-600" />
              <h3 className="text-lg font-semibold">Your Score</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {userAttempt.score}/{totalPoints} ({percentageScore.toFixed(1)}%)
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <RiCheckLine className="text-green-600" />
              <h3 className="text-lg font-semibold">Passing Score</h3>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {quiz.passingScore}%
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2">
              <BsClockHistory className="text-purple-600" />
              <h3 className="text-lg font-semibold">Time Taken</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {quiz.duration} mins
            </p>
          </div>
        </div>

        {/* Result Status */}
        <div className={`p-4 rounded-lg mb-6 ${isPassed ? 'bg-green-50' : 'bg-red-50'}`}>
          <h2 className={`text-xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
            {isPassed ? '🎉 Congratulations! You passed!' : '😞 Try Again!'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isPassed 
              ? `You've successfully passed this quiz with ${percentageScore.toFixed(1)}%.`
              : `You scored ${percentageScore.toFixed(1)}%. Need ${quiz.passingScore}% to pass.`}
          </p>
        </div>

        {/* User Score Section */}
        {quiz.userScores && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Attempt Details</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {quiz.userScores.user?.name || 'Anonymous User'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {quiz.userScores.user?.email || 'No email provided'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    Score: {quiz.userScores.score}/{totalPoints}
                  </p>
                  <p className="text-sm text-gray-500">
                    Attempted: {new Date(quiz.userScores.attemptedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
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