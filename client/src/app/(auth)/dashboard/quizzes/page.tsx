'use client';
import { Suspense, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import Question from './quizzes/[quizId]/question/_components/Question';
import Quiz from './quizzes/_components/Quiz';

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
                    <TabsList>
                        <TabsTrigger value="quiz">Quiz</TabsTrigger>
                        <TabsTrigger value="question" disabled={!selectedQuizId}>
                            Question
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="quiz">
                        <Quiz onQuizClick={handleQuizClick} />
                    </TabsContent>
                    <TabsContent value="question">
                        {selectedQuizId ? <Question quizId={selectedQuizId} /> : <p>Chọn một bài quiz</p>}
                    </TabsContent>
                </Tabs>
            </Suspense>
        </div>
    );
}
