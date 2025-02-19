import React from 'react';
import Banner from './_components/Banner';
import PopularInstructor from './_components/PopularInstructor';
import FilterCourses from './_components/FilterCourses';
import HorizontalCoursesList from './_components/HorizontalCoursesList';
import { cookies } from 'next/headers';

export default async function page() {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString(); 

    const res = await fetch('http://localhost:8000/api/courses', {
        credentials: 'include',
        headers: {
            Cookie: cookie 
        }
    });

    const { courses } = await res.json();
    return (
        <div className="w-full pb-40 ">
            <Banner />
            <PopularInstructor />
            <div className="flex w-[1400px] mx-auto pt-[54px] relative">
                <FilterCourses />
                <HorizontalCoursesList courses={courses} />
            </div>
        </div>
    );
}
