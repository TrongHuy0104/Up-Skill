import React, { Suspense } from 'react';
import { cookies } from 'next/headers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import CreateQuiz from './_components/CreateQuiz';
import Link from 'next/link';

export default async function Page() {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();

    const courses = await fetch('http://localhost:8000/api/courses/user-courses', {
        credentials: 'include',
        headers: { Cookie: cookie },
        cache: 'no-store',
    }).then((res) => res.json());

    return (
        <div className="pt-8 px-10 pb-10 ml-auto max-w-[1000px] border border-primary-100 rounded-xl">
            <Tabs defaultValue="create-quiz">
                <TabsList>
                    <TabsTrigger value="create-course">
                        <Link href="/dashboard/instructor/create-course">Course</Link>

                    </TabsTrigger>
                    <TabsTrigger value="create-quiz">Quiz</TabsTrigger>
                </TabsList>
                <TabsContent value="create-quiz">
                    <Suspense fallback={<DashboardSkeleton />}>
                        <CreateQuiz courses={courses.data} />
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    );
}