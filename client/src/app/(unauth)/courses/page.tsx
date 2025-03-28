import React, { Suspense } from 'react';
import { cookies } from 'next/headers';

import Banner from './_components/Banner';
import FilterCourses from './_components/FilterCourses';
import HorizontalCoursesList from './_components/HorizontalCoursesList';
import { DashboardSkeleton } from '@/components/ui/Skeleton';

export default async function Page({ searchParams = {} }: any) {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();

    const resolvedParams = (await searchParams) || {};

    const safeParams = new URLSearchParams();
    Object.entries(resolvedParams).forEach(([key, value]) => {
        if (typeof value === 'string') safeParams.append(key, value);
        else if (Array.isArray(value)) safeParams.append(key, value.join(','));
    });

    if (!safeParams.has('page')) safeParams.set('page', '1');
    if (!safeParams.has('limit')) safeParams.set('limit', '10');

    const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URI}/courses/pagination?${safeParams.toString()}`;
    const countUrl = `${process.env.NEXT_PUBLIC_SERVER_URI}/courses/count`;

    const [coursesRes, countRes] = await Promise.all([
        fetch(apiUrl, { credentials: 'include', headers: { Cookie: cookie } }),
        fetch(countUrl, { credentials: 'include', headers: { Cookie: cookie } })
    ]);

    if (!coursesRes.ok) throw new Error(`Failed to fetch courses: ${coursesRes.statusText}`);
    if (!countRes.ok) throw new Error(`Failed to fetch course count: ${countRes.statusText}`);

    const { courses, totalPages, totalCourses, limit, page } = await coursesRes.json();
    const { data } = await countRes.json();

    return (
        <div className="w-full pb-40">
            <Banner />
            <div className="flex flex-col md:flex-row max-w-[1400px] px-4 md:px-0  mx-auto pt-[54px] relative">
                <Suspense fallback={<DashboardSkeleton />}>
                    <FilterCourses filterData={data} />
                    <HorizontalCoursesList
                        initialCourses={courses}
                        totalPages={totalPages}
                        initialTotalCourses={totalCourses}
                        limit={limit}
                        page={page}
                    />
                </Suspense>
            </div>
        </div>
    );
}
