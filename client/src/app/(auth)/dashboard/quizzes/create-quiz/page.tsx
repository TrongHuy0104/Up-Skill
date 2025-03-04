
import { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import Link from 'next/link';

export default async function page() {
    return (
        <div className="pt-8 px-10 pb-10 ml-auto max-w-[1000px] border border-primary-100 rounded-xl">

            <Tabs defaultValue='create-quiz'>
                <TabsList>
                    <TabsTrigger value="create-course">
                        <Link href="/dashboard/instructor/create-course">
                            Course
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger value="create-quiz">Quiz</TabsTrigger>
                </TabsList>
                <TabsContent value="create-quiz">
                    <Suspense fallback={<DashboardSkeleton />}>
                        {/* Nội dung của trang Quiz */}
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    );
}