import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import arrow from '@/public/assets/icons/arrow-top-right.svg';

interface Answer {
    text: string;
    isCorrect: boolean;
}

interface Question {
    id: number;
    text: string;
    answers: Answer[];
}

const sampleQuestions: Question[] = [
    {
        id: 1,
        text: 'What is the capital of France?',
        answers: [
            { text: 'Berlin', isCorrect: false },
            { text: 'Madrid', isCorrect: false },
            { text: 'Paris', isCorrect: true },
            { text: 'Rome', isCorrect: false }
        ]
    },
    {
        id: 2,
        text: 'Which planet is known as the Red Planet?',
        answers: [
            { text: 'Earth', isCorrect: false },
            { text: 'Mars', isCorrect: true },
            { text: 'Jupiter', isCorrect: false },
            { text: 'Venus', isCorrect: false }
        ]
    },
    {
        id: 3,
        text: "Who wrote 'To Kill a Mockingbird'?",
        answers: [
            { text: 'Harper Lee', isCorrect: true },
            { text: 'J.K. Rowling', isCorrect: false },
            { text: 'Ernest Hemingway', isCorrect: false },
            { text: 'Mark Twain', isCorrect: false }
        ]
    }
];

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`border border-gray-300 rounded-lg shadow-md p-4 ${className}`}>{children}</div>
);

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="p-2">{children}</div>;

export default function QuestionList() {
    return (
        <div className="w-full max-w-3xl mx-auto px-4 relative">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-accent-300  p-3 rounded-lg">
                <h2 className="text-xl font-semibold text-primary-700">Quiz Questions ({sampleQuestions.length})</h2>
                <Button
                    variant="default"
                    size="sm"
                    // onClick={handleNext}
                >
                    Add Question
                    <Image src={arrow} alt="Arrow Right" />
                </Button>
            </div>
            <div className="space-y-4">
                {sampleQuestions.map((question, index) => (
                    <Card key={question.id}>
                        <CardContent>
                            <h3 className="text-base font-medium text-primary-800">
                                {index + 1}. {question.text}
                            </h3>
                            <ul className="mt-2 space-y-2">
                                {question.answers.map((answer, i) => (
                                    <li
                                        key={i}
                                        className={`p-2 border rounded-md text-[15px] ${
                                            answer.isCorrect ? 'border-accent-500 bg-accent-200' : 'border-gray-300'
                                        }`}
                                    >
                                        {answer.text}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
