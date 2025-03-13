'use client';
import { Suspense, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import Question from './quizzes/[quizId]/question/_components/Question';
import Quiz from './quizzes/_components/Quiz';
import Practice from './quizzes/[quizId]/question/_components/Practice';
import QuizButton from './quizzes/_components/QuizButton';

export default function Page() {
    const [activeTab, setActiveTab] = useState<string>('quiz');
    const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

    const handleQuizClick = (quizId: string) => {
        setSelectedQuizId(quizId);
        setActiveTab('question');
    };

    return (
        <div className="pt-8 px-10 pb-10 ml-auto max-w-[1000px] border border-primary-100 rounded-xl">
            <Suspense fallback={<DashboardSkeleton />}>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="relative">
                        <TabsTrigger value="quiz">Quiz</TabsTrigger>
                        <TabsTrigger value="question" disabled={!selectedQuizId}>
                            Question
                        </TabsTrigger>
                        <TabsTrigger value="practice" disabled={!selectedQuizId}>
                            Practice
                        </TabsTrigger>
                        <div className="absolute top-0 right-0">
                            {' '}
                            <QuizButton />
                        </div>
                    </TabsList>
                    <TabsContent value="quiz">
                        <Quiz onQuizClick={handleQuizClick} />
                    </TabsContent>
                    <TabsContent value="question">
                        {selectedQuizId ? <Question quizId={selectedQuizId} /> : <p>Chosse a quiz</p>}
                    </TabsContent>
                    <TabsContent value="practice">
                        {selectedQuizId ? (
                            <Practice quizId={selectedQuizId} />
                        ) : (
                            <p>Please select a quiz</p> // Nếu không có quizId thì hiển thị thông báo
                        )}
                    </TabsContent>
                </Tabs>
            </Suspense>
        </div>
    );
}
