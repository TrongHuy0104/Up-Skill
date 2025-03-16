import React from 'react';
import CourseVerticalCard from '@/components/custom/CourseCard';
import { CarouselSpacing } from '@/components/custom/CustomCarousel';
import { Course } from '@/types/Course';

interface Props {
    readonly course: Course;
}

export default function CoursesList({ course }: Props) {
    return (
        <div className="mb-[61px] w-[260px] sm:w-[600px] lg:w-[900px]">
            <h2 className="text-2xl font-bold mb-4 font-cardo">More Course By {course?.authorId?.name}</h2>
            <CarouselSpacing component={<CourseVerticalCard />} colNumber={3} />
        </div>
    );
}
