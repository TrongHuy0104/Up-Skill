import React from 'react';
import QuizList from './QuizList';

export default function Quiz({ onQuizClick } : Readonly<{ onQuizClick: (quizId: string) => void }>) {
    return <QuizList onQuizClick={onQuizClick} />;
}
