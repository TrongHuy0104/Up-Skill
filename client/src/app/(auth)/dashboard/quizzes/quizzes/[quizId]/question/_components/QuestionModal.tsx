import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface Question {
    _id?: string;
    text: string;
    type: string;
    points: number;
    options: string[];
    correctAnswer: string | string[];
}

interface QuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    question?: Question | null;
    quizId: string;
    onQuestionUpdated: () => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ isOpen, onClose, question, quizId, onQuestionUpdated }) => {
    const [formData, setFormData] = useState<Question>(
        question || { text: '', type: 'single-choice', points: 1, options: ['', ''], correctAnswer: '' }
    );
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Nếu tất cả các options đã được điền và correctAnswer chưa được chọn, chọn option đầu tiên
        if (formData.options.every((opt) => opt.trim()) && !formData.correctAnswer) {
            setFormData((prev) => ({
                ...prev,
                correctAnswer: prev.options[0]
            }));
        }
    }, [formData.options]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData((prev) => ({ ...prev, options: newOptions }));
    };

    const handleCorrectAnswerChange = (value: string) => {
        if (formData.type === 'single-choice') {
            setFormData((prev) => ({ ...prev, correctAnswer: value }));
        } else if (formData.type === 'multiple-choice') {
            const currentAnswers = Array.isArray(formData.correctAnswer) ? formData.correctAnswer : [];
            const updatedAnswers = currentAnswers.includes(value)
                ? currentAnswers.filter((ans) => ans !== value)
                : [...currentAnswers, value];
            setFormData((prev) => ({ ...prev, correctAnswer: updatedAnswers }));
        }
    };

    const handleAddOption = () => {
        if (formData.options.length < 4) {
            setFormData((prev) => ({
                ...prev,
                options: [...prev.options, '']
            }));
        }
    };

    const handleSubmit = async () => {
        if (formData.options.filter((opt) => opt.trim()).length < 2) {
            setError('You need to fill at least 2 options');
            return;
        }

        const url = question?._id
            ? `http://localhost:8000/api/quizzes/${quizId}/questions/${question._id}`
            : `http://localhost:8000/api/quizzes/${quizId}/questions`;

        const method = question?._id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                onQuestionUpdated();
                onClose();
            } else {
                const errorText = await response.text();
                console.error('Failed to submit question:', errorText);
            }
        } catch (error) {
            console.error('Error submitting question:', error);
        }
    };

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-1000">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[480px]">
                <h2 className="text-lg font-bold mb-4">{question ? 'Update Question' : 'Add Question'}</h2>

                <label htmlFor="question-text" className="block text-sm font-medium text-gray-700 mb-1">
                    Question
                </label>
                <input
                    id="question-text"
                    type="text"
                    name="text"
                    placeholder="Enter the question"
                    value={formData.text}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mb-4"
                />

                <label htmlFor="question-type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                </label>
                <select
                    id="question-type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mb-4"
                >
                    <option value="single-choice">Single Choice</option>
                    <option value="multiple-choice">Multiple Choice</option>
                </select>

                <label htmlFor="question-points" className="block text-sm font-medium text-gray-700 mb-1">
                    Points
                </label>
                <input
                    id="question-points"
                    type="number"
                    name="points"
                    placeholder="Enter points"
                    value={formData.points}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mb-4"
                />

                <label htmlFor="options" className="block text-sm font-medium text-gray-700 mb-1">
                    Options
                </label>
                {formData.options.map((option, index) => (
                    <div key={index} className="mb-2 flex items-center">
                        <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                        {formData.type === 'multiple-choice' && (
                            <input
                                type="checkbox"
                                checked={
                                    Array.isArray(formData.correctAnswer) && formData.correctAnswer.includes(option)
                                }
                                onChange={() => handleCorrectAnswerChange(option)}
                                className="ml-2 accent-primary-800"
                            />
                        )}
                    </div>
                ))}

                {formData.options.length < 4 && (
                    <Button onClick={handleAddOption} variant="primary" size="sm">
                        Add Option
                    </Button>
                )}

                {formData.type === 'single-choice' && (
                    <>
                        <label htmlFor="correct-answer" className="block text-sm font-medium text-gray-700 mb-1">
                            Correct Answer
                        </label>
                        <select
                            id="correct-answer"
                            name="correctAnswer"
                            value={formData.correctAnswer as string}
                            onChange={handleChange}
                            className="w-full border p-2 rounded mb-4"
                        >
                            {formData.options.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="default" size="sm" onClick={handleSubmit}>
                        {question ? 'Update' : 'Create'}
                    </Button>
                </div>
            </div>
        </div>
    ) : null;
};

export default QuestionModal;
