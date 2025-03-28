'use client';

import React, { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import CreateQuiz from './_components/CreateQuiz';
import { useGetUserCoursesQuery } from '@/lib/redux/features/course/courseApi';
import Spinner from '@/components/custom/Spinner';

export default function Page() {
    const { data, isLoading } = useGetUserCoursesQuery({});

    if (isLoading) return <Spinner />;

    const { data: courses } = data;

    return (
        <div className="pt-8 px-10 pb-10 ml-auto max-w-[1000px] border border-primary-100 rounded-xl">
            <Tabs defaultValue="create-quiz">
                <TabsList>
                    <TabsTrigger value="create-quiz">Quiz</TabsTrigger>
                </TabsList>
                <TabsContent value="create-quiz">
                    <Suspense fallback={<DashboardSkeleton />}>
                        <CreateQuiz courses={courses} />
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    );
}
