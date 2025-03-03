import React from 'react';
import QuizList from './QuizList';

export default function Quiz({ onQuizClick }: { onQuizClick: (quizId: string) => void }) {
    return <QuizList onQuizClick={onQuizClick} />;
}
