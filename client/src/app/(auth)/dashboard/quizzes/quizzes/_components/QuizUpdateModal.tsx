'use client';

import React, { useState } from 'react';
import { Quiz } from '@/types/Quiz';
import { toast } from '@/hooks/use-toast';

interface QuizUpdateModalProps {
    quiz: Quiz;
    onClose: () => void;
    onUpdate: (updatedQuiz: Quiz) => void;
}

export default function QuizUpdateModal({ quiz, onClose, onUpdate }: QuizUpdateModalProps) {
    const [title, setTitle] = useState(quiz.title);
    const [description, setDescription] = useState(quiz.description);
    const [difficulty, setDifficulty] = useState(quiz.difficulty);
    const [duration, setDuration] = useState(quiz.duration);
    const [passingScore, setPassingScore] = useState(quiz.passingScore);
    const [maxAttempts, setMaxAttempts] = useState(quiz.maxAttempts);
    const [isPublished, setIsPublished] = useState(quiz.isPublished);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const baseURL = process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:8000';
            const response = await fetch(`${baseURL}/quizzes/${quiz._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    difficulty,
                    duration,
                    passingScore,
                    maxAttempts,
                    isPublished,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update quiz');
            }

            const data = await response.json();
            onUpdate(data.quiz); // Notify parent component of the update
            toast({
                variant: 'success',
                title: 'Quiz Updated!'
            });
            onClose(); // Close the modal
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update quiz');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Quiz</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            rows={3}
                        />
                    </div>

                    {/* Difficulty */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                            className="w-full p-2 border rounded-md"
                            required
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    {/* Passing Score */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Passing Score (%)</label>
                        <input
                            type="number"
                            value={passingScore}
                            onChange={(e) => setPassingScore(Number(e.target.value))}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    {/* Max Attempts */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Max Attempts</label>
                        <input
                            type="number"
                            value={maxAttempts}
                            onChange={(e) => setMaxAttempts(Number(e.target.value))}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    {/* Published Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Published</label>
                        <input
                            type="checkbox"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                            className="ml-2"
                        />
                    </div>

                    {/* Error Message */}
                    {error && <div className="text-red-500">{error}</div>}

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-blue-300"
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}