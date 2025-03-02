'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import arrow from '@/public/assets/icons/arrow-top-right.svg';
import QuestionModal from './QuestionModal';

interface Question {
    _id: string;
    text: string;
    type: string;
    points: number;
    options: string[];
    correctAnswer: string | string[];
}

export default function QuestionList() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

    const fetchQuestions = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/quizzes/67b8a4761b64b43f67571c2e/questions`);
            if (!res.ok) throw new Error('Failed to fetch questions');
            const data = await res.json();
            console.log('Fetched questions:', data);
            setQuestions(data.questions);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const openModal = (question?: Question) => {
        console.log('Opening modal...', question);
        setSelectedQuestion(question || null);
        setModalOpen(true);
    };

    const handleDelete = async (questionId: string) => {
        try {
            const res = await fetch(
                `http://localhost:8000/api/quizzes/67b8a4761b64b43f67571c2ea/questions/${questionId}`,
                {
                    method: 'DELETE'
                }
            );
            if (!res.ok) throw new Error('Failed to delete question');

            // Cập nhật lại danh sách câu hỏi sau khi xóa
            setQuestions((prevQuestions) => prevQuestions.filter((q) => q._id !== questionId));
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    const isCorrectAnswer = (question: Question, option: string) => {
        if (question.type === 'single-choice') {
            return option === question.correctAnswer;
        } else if (question.type === 'multiple-choice') {
            return Array.isArray(question.correctAnswer) && question.correctAnswer.includes(option);
        }
        return false;
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 relative">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-accent-300 p-3 rounded-lg">
                <h2 className="text-lg text-primary-700">Quiz Questions ({questions.length})</h2>
                <Button variant="default" size="sm" onClick={() => openModal()}>
                    Add Question
                    <Image src={arrow} alt="Arrow Right" />
                </Button>
            </div>
            <div className="space-y-4">
                {questions.map((question, index) => (
                    <div key={question._id} className="border border-gray-300 rounded-lg shadow-md p-4">
                        <div className="p-2 flex justify-between items-center">
                            <h3 className="text-base font-medium text-primary-800">
                                {index + 1}. {question.text} ({question.points} points)
                            </h3>
                            <div className="space-x-2 flex">
                                <Button
                                    variant="outline"
                                    size="xs"
                                    className="flex items-center gap-2"
                                    onClick={() => openModal(question)}
                                >
                                    Update
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="xs"
                                    className="flex items-center gap-2"
                                    onClick={() => handleDelete(question._id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                        <ul className="mt-2 space-y-2">
                            {question.options.map((option, i) => (
                                <li
                                    key={i}
                                    className={`p-2 border rounded-md text-[15px] ${
                                        isCorrectAnswer(question, option)
                                            ? 'border-accent-500 bg-accent-200'
                                            : 'border-gray-300'
                                    }`}
                                >
                                    {option}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            {modalOpen && (
                <QuestionModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    question={selectedQuestion}
                    quizId="67c2d95fa2ed5c67af3dc693"
                    onQuestionUpdated={fetchQuestions}
                />
            )}
        </div>
    );
}
