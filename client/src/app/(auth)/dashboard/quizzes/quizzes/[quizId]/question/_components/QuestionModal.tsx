'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface Question {
    _id?: string;
    text: string;
    type: string;
    points: number;
    options: string[];
    correctAnswer: string | string[]; // Đáp án có thể là một chuỗi hoặc một mảng chuỗi
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
        question || { text: '', type: 'single-choice', points: 1, options: ['', '', '', ''], correctAnswer: '' }
    );

    useEffect(() => {
        console.log('Form data updated:', formData);
    }, [formData]);

    useEffect(() => {
        if (formData.type === 'single-choice') {
            setFormData((prev) => ({
                ...prev,
                correctAnswer: Array.isArray(prev.correctAnswer) ? prev.correctAnswer[0] || '' : prev.correctAnswer
            }));
        } else if (formData.type === 'multiple-choice') {
            setFormData((prev) => ({
                ...prev,
                correctAnswer: Array.isArray(prev.correctAnswer) ? prev.correctAnswer : [prev.correctAnswer]
            }));
        }
    }, [formData.type]);

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
                ? currentAnswers.filter((ans) => ans !== value) // Bỏ chọn nếu đã chọn
                : [...currentAnswers, value]; // Thêm vào nếu chưa chọn
            setFormData((prev) => ({ ...prev, correctAnswer: updatedAnswers }));
        }
    };

    const handleAddOption = () => {
        if (formData.options.length < 4) {
            // Giới hạn số lượng option tối đa là 4
            setFormData((prev) => ({
                ...prev,
                options: [...prev.options, '']
            }));
        }
    };

    const handleSubmit = async () => {
        const url = question?._id
            ? `http://localhost:8000/api/quizzes/${quizId}/questions/${question._id}`
            : `http://localhost:8000/api/quizzes/${quizId}/questions`;

        const method = question?._id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            onQuestionUpdated();
            onClose();
        } else {
            console.error('Failed to submit question');
        }
    };

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[480px]">
                <h2 className="text-lg font-bold mb-4">{question ? 'Update Question' : 'Add Question'}</h2>

                {/* Label và input cho Question */}
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

                {/* Label và select cho Type */}
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

                {/* Label và input cho Points */}
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

                {/* Label và input cho Options */}
                <label htmlFor="options" className="block text-sm font-medium text-gray-700 mb-1">
                    Options
                </label>
                {formData.options.map((option, index) => (
                    <div key={`${formData._id}-${index}`} className="mb-2 flex items-center">
                        <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                        {/* Checkbox để chọn đáp án đúng (nếu là Multiple Choice) */}
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

                {/* Nút thêm option */}
                {formData.options.length < 4 && (
                    <Button onClick={handleAddOption} variant="primary" size="sm">
                        Add Option
                    </Button>
                )}

                {/* Label và input cho Correct Answer (nếu là Single Choice) */}
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
                                <option key={`${formData._id}-${index}`} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {/* Nút Cancel và Submit */}
                <div className="flex justify-end space-x-2">
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
