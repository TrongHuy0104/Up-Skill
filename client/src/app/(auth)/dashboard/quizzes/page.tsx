import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import Question from './quizzes/[quizId]/question/_components/Question';
import Quiz from './quizzes/[quizId]/_components/Quiz';

export default function page() {
    return (
        <>
            <div className="pt-8 px-10 pb-10 ml-auto max-w-[1000px] border border-primary-100 rounded-xl">
                <Suspense fallback={<DashboardSkeleton />}>
                    <Tabs defaultValue="quiz">
                        <TabsList>
                            <TabsTrigger value="quiz">Quiz</TabsTrigger>
                            <TabsTrigger value="question">Question</TabsTrigger>
                        </TabsList>
                        <TabsContent value="quiz">
                            <Quiz />
                        </TabsContent>
                        <TabsContent value="question">
                            <Question />
                        </TabsContent>
                    </Tabs>
                </Suspense>
            </div>
        </>
    );
}
