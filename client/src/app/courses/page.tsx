import React from 'react';
import Banner from './_components/Banner';
import PopularInstructor from './_components/PopularInstructor';
import FilterCourses from './_components/FilterCourses';
import HorizontalCoursesList from './_components/HorizontalCoursesList';

export default function page() {
    return (
        <div className="w-full pb-40 ">
            <Banner />
            <PopularInstructor />
            <div className="flex w-[1400px] mx-auto pt-[54px] relative">
                <FilterCourses />
                <HorizontalCoursesList />
            </div>
        </div>
    );
}
