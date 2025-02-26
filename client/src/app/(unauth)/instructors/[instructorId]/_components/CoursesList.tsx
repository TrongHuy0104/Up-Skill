import CourseVerticalCard from '@/components/custom/CourseCard';
import React from 'react';

export default function CoursesList() {
    return (
        <div className="mb-[61px] w-[900px]">
            <h2 className="text-2xl font-bold mb-4">More Course By Theresa Edin</h2>
            <div className="flex gap-7">
                <CourseVerticalCard />
                <CourseVerticalCard />
                <CourseVerticalCard />
            </div>
        </div>
    );
}
