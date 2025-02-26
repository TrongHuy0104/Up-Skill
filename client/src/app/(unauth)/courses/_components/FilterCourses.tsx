import FilterCoursesList from '@/app/(unauth)/courses/_components/FilterCoursesList';
import { FilterResponse } from '@/types/Course';
import React from 'react';

export default function FilterCourses({ filterData }: { readonly filterData: FilterResponse }) {
    console.log('filterData:', filterData);
    return (
        <div className="">
            <FilterCoursesList filterData={filterData} />
        </div>
    );
}
