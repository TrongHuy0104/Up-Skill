import React from 'react';
import Banner from './_components/Banner';
import PopularInstructor from './_components/PopularInstructor';
import FilterCourses from './_components/FilterCourses';
import HorizontalCoursesList from './_components/HorizontalCoursesList';
import { cookies } from 'next/headers';



export default async function Page({ searchParams = {} }: any) {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();

    const resolvedParams = await searchParams;

    const safeParams = new URLSearchParams();
    Object.entries(resolvedParams || {}).forEach(([key, value]) => {
        if (typeof value === 'string') safeParams.append(key, value);
        else if (Array.isArray(value)) safeParams.append(key, value.join(','));
    });

    if (!safeParams.has('page')) safeParams.set('page', '1');
    if (!safeParams.has('limit')) safeParams.set('limit', '10');

    // Gọi API
    const apiUrl = `http://localhost:8000/api/courses/pagination?${safeParams.toString()}`;
    const res = await fetch(apiUrl, {
        credentials: 'include',
        headers: {
            Cookie: cookie
        }
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch courses: ${res.statusText}`);
    }

    const { courses } = await res.json();

    return (
        <div className="w-full pb-40">
            <Banner />
            <PopularInstructor />
            <div className="flex w-[1400px] mx-auto pt-[54px] relative">
                <FilterCourses />
                <HorizontalCoursesList courses={courses} />
            </div>
        </div>
    );
}
