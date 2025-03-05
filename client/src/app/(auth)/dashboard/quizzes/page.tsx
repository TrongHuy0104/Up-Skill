'use client';
import { Suspense, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import Question from './quizzes/[quizId]/question/_components/Question';
import Quiz from './quizzes/[quizId]/_components/Quiz';
import Practice from './quizzes/[quizId]/question/_components/Practice';

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
                        <TabsTrigger value="practice">Practice</TabsTrigger>
                    </TabsList>
                    <TabsContent value="quiz">
                        <Quiz onQuizClick={handleQuizClick} />
                    </TabsContent>
                    <TabsContent value="question">
                        {selectedQuizId ? <Question quizId={selectedQuizId} /> : <p>Chosse a quiz</p>}
                    </TabsContent>
                    <TabsContent value="practice">
                        <Practice />
                    </TabsContent>
                </Tabs>
            </Suspense>
        </div>
    );
}
