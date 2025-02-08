import React from 'react';
import Banner from './_components/Banner';
import PopularInstructor from './_components/PopularInstructor';
import FilterCourses from './_components/FilterCourses';
import HoriCoursesList from './_components/HoriCoursesList';

export default function page() {
    return (
        <div className="w-full">
            <Banner />
            <PopularInstructor />
            <div className="flex">
                <FilterCourses />
                <HoriCoursesList />
            </div>
        </div>
    );
}
