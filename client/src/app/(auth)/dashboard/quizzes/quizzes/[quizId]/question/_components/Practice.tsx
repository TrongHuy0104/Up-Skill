'use client';
import { Button } from '@/components/ui/Button';
import arrowRight from '@/public/assets/icons/arrow-top-right.svg'; // Import ảnh từ public
import type { Question } from '@/types/Quiz';
import Image from 'next/image';
import { useState } from 'react';

// Dữ liệu giả
const mockQuestions: Question[] = [
    {
        _id: '1',
        text: 'What is the capital of France?',
        type: 'multiple-choice',
        points: 10,
        correctAnswer: 'Paris',
        options: ['Paris', 'London', 'Berlin', 'Madrid']
    },
    {
        _id: '2',
        text: 'Which planet is known as the Red Planet?',
        type: 'multiple-choice',
        points: 10,
        correctAnswer: 'Mars',
        options: ['Earth', 'Mars', 'Jupiter', 'Saturn']
    },
    {
        _id: '3',
        text: "Who wrote 'To Kill a Mockingbird'?",
        type: 'multiple-choice',
        points: 10,
        correctAnswer: 'Harper Lee',
        options: ['Harper Lee', 'Mark Twain', 'J.K. Rowling', 'Ernest Hemingway']
    }
];

export default function Practice() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [score, setScore] = useState(0); // Điểm số
    const [isQuizFinished, setIsQuizFinished] = useState(false); // Trạng thái hoàn thành quiz

    const currentQuestion = mockQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === mockQuestions.length - 1;

    const handleSelectOption = (option: string) => {
        setSelectedOption(option);
    };

    const handleNext = () => {
        if (!selectedOption) {
            alert('Please select an option!');
            return;
        }

        // Kiểm tra câu trả lời đúng và cập nhật điểm số
        if (selectedOption === currentQuestion.correctAnswer) {
            setScore(score + currentQuestion.points);
        }

        // Reset selectedOption và chuyển sang câu hỏi tiếp theo
        setSelectedOption(null);
        if (!isLastQuestion) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Kết thúc quiz
            setIsQuizFinished(true);
        }
    };

    const handleRestart = () => {
        // Reset trạng thái để làm lại quiz
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(0);
        setIsQuizFinished(false);
    };

    // Tính tỷ lệ đúng
    const totalPoints = mockQuestions.reduce((sum, question) => sum + question.points, 0);
    const percentage = (score / totalPoints) * 100;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {!isQuizFinished ? (
                <>
                    <h2 className="text-xl font-semibold mb-4">{currentQuestion.text}</h2>
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                            <Button
                                key={index}
                                variant={selectedOption === option ? 'primary' : 'outline'}
                                size="lg"
                                className="w-full justify-start"
                                onClick={() => handleSelectOption(option)}
                            >
                                {option}
                            </Button>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button
                            variant="default"
                            size="lg"
                            onClick={handleNext}
                            disabled={!selectedOption} // Disable nút "Next" nếu chưa chọn câu trả lời
                        >
                            {isLastQuestion ? 'Finish' : 'Next'}
                            <Image src={arrowRight} alt="Arrow Right" />
                        </Button>
                    </div>
                </>
            ) : (
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Result</h2>
                    <p className="text-lg mb-4">
                        You answered correctly points {score}/{totalPoints} points ({percentage.toFixed(2)}%).
                    </p>
                    {percentage >= 70 ? (
                        <p className="text-green-600 font-semibold mb-4">Completely!</p>
                    ) : (
                        <p className="text-red-600 font-semibold mb-4">One more time!</p>
                    )}
                    <Button variant="default" size="lg" onClick={handleRestart}>
                        Agian
                    </Button>
                </div>
            )}
        </div>
    );
}
