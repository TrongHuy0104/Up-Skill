'use client';

import React, { useEffect, useState, useRef } from 'react';
import CourseVerticalCard from '@/components/custom/CourseCard';
import { VerticalCardSkeleton } from '@/components/ui/Skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/Carousel';
import { Course } from '@/types/Course';

const LoadingCarouselSkeleton = () => (
    <Carousel className="w-full">
        <CarouselContent className="-ml-1">
            {[...Array(5)].map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                        <VerticalCardSkeleton />
                    </div>
                </CarouselItem>
            ))}
        </CarouselContent>
    </Carousel>
);

function TopCoursesContent({ topCourses, isLoading }: { readonly topCourses: Course[]; readonly isLoading: boolean }) {
    if (isLoading) {
        return <LoadingCarouselSkeleton />;
    }

    if (topCourses.length === 0) {
        return (
            <div className="text-center text-primary-800 font-medium py-6">Instructor has no courses posted yet.</div>
        );
    }

    return (
        <Carousel className="w-full">
            <CarouselContent className="-ml-1">
                {topCourses.map((course) => (
                    <CarouselItem key={course._id} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                            <CourseVerticalCard course={course} />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}

interface Props {
    readonly course: Course;
}

export default function CoursesList({ course }: Props) {
    const [topCourses, setTopCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const hasFetched = useRef(false);

    useEffect(() => {
        const fetchTopCourses = async () => {
            if (!course?.authorId?._id || hasFetched.current) return;
            hasFetched.current = true;

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URI}/courses/all-courses/${course.authorId._id}`,
                    { method: 'GET', credentials: 'include' }
                );
                if (!res.ok) throw new Error('Failed to fetch top courses');
                const data = await res.json();
                setTopCourses(data.data.topCourses);
            } catch (error) {
                console.error('Error fetching top courses:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopCourses();
    }, [course?.authorId?._id]);

    return (
        <div className="mb-[61px] w-[900px]">
            <h2 className="text-2xl font-bold mb-4 font-cardo">More Courses</h2>
            <TopCoursesContent topCourses={topCourses} isLoading={isLoading} />
        </div>
    );
}
