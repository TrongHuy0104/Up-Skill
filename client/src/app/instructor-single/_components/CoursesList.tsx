import CourseVerticalCard from '@/components/custom/CourseCard';
import React from 'react';

export default function CoursesList() {
    return (
        <div className="mb-[61px] w-[9000px]">
            <h2 className="text-2xl font-bold mb-4">My courses (29)</h2>
            <div className="flex gap-5">
                <CourseVerticalCard />
                <CourseVerticalCard />
                <CourseVerticalCard />
            </div>
        </div>
    );
}
