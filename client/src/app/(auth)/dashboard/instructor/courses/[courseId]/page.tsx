'use client';

import { redirect } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import CreateEditCourse from './_components/CreateEditCourse';
import { ROLE } from '@/lib/constants';
import { useGetCategoriesQuery } from '@/lib/redux/features/category/categoryApi';
import { useGetLevelsQuery } from '@/lib/redux/features/level/levelApi';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import useUserRedirect from '@/hooks/useUserRedirect';
interface Level {
    _id: string;
    name: string;
}

export default function Page() {
    const { courseId } = useParams();
    const { userData, isLoadingUser, refetch } = useUserRedirect();
    const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery(undefined);
    const { data: levelsData, isLoading: levelsLoading } = useGetLevelsQuery(undefined);
    const [isRefetchDone, setIsRefetchDone] = useState(false);

    useEffect(() => {
        refetch().finally(() => setIsRefetchDone(true));
    }, [refetch]);

    // Wait for all data to load before checking conditions
    if (categoriesLoading || levelsLoading || isLoadingUser || !isRefetchDone) {
        return <DashboardSkeleton />;
    }

    const { user } = userData;
    const { levels } = levelsData;

    // Redirect AFTER refetch completes
    if (!courseId || user?.role !== ROLE.instructor || !user.uploadedCourses.includes(courseId)) {
        redirect('/');
    }

    const formattedLevels = levels.map((level: Level) => ({
        label: level.name,
        value: level._id
    }));

    const formattedCategories = categories.map((category: any) => ({
        label: category.title,
        value: category._id,
        subCategories: category.subCategories.map((subCategory: any) => ({
            label: subCategory.title,
            value: subCategory._id
        }))
    }));

    return (
        <div className="pt-8 px-10 pb-10 ml-auto max-w-[1000px] border border-primary-100 rounded-xl">
            <Suspense fallback={<DashboardSkeleton />}>
                <CreateEditCourse
                    courseId={courseId as string}
                    levels={formattedLevels}
                    categories={formattedCategories}
                />
            </Suspense>
        </div>
    );
}
