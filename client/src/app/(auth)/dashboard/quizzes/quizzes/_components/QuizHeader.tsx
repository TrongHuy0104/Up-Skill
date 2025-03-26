import * as React from 'react';

interface Quiz {
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

interface QuizHeaderProps {
    quiz: Quiz;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({ quiz }) => {
    return (
        <section className="block gap-5 justify-between py-7 pr-20 pl-8 w-full text-base leading-none bg-accent-100 rounded-2xl text-slate-900 max-md:px-5 max-md:mt-10 max-md:max-w-full">
            <h1 className="text-2xl leading-none">Result - {quiz.title}</h1>
            <div className="mb-6">
                <p className="text-gray-600 mt-2">{quiz.description}</p>

                <div className="mt-4 flex gap-4 text-sm text-gray-600">
                    <span>Difficulty: {quiz?.difficulty || 'Unknown data'}</span>
                    <span>Passing Score: {quiz?.passingScore || 'Unknown data'}%</span>
                    <span>Duration: {quiz?.duration || 'Unknown data'} mins</span>
                </div>
            </div>
        </section>
    );
};
