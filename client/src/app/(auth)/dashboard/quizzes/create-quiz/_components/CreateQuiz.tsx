'use client';


import { Course, QuizForm } from './QuizForm'; // Named import

interface CreateQuizProps {
  readonly courses: Course[];
}

// Default export
export default function CreateQuiz({ courses }: CreateQuizProps) {
  return <QuizForm courses={courses} />;
}