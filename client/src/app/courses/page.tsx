import React from 'react';
import Banner from './_components/Banner';
import CardList from './_components/CardList';
import PopularTopics from './_components/PopularTopics';
import PopularInstructor from './_components/PopularInstructor';
import FilterCourses from './_components/FilterCourses';
import HoriCoursesList from './_components/HoriCoursesList';

export default function page() {
    return (
        <div>
            <Banner />
            <CardList />
            <PopularTopics />
            <PopularInstructor />
            <div className="flex">
                <FilterCourses />
                <HoriCoursesList />
            </div>
        </div>
    );
}
