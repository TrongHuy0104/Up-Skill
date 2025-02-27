'use client';
import React, { Suspense, useEffect, useState } from 'react';
import CourseVerticalCard from '@/components/custom/CourseCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/Carousel';
import { VerticalCardSkeleton } from '@/components/ui/Skeleton';

export default function CoursesList() {
    function TopCoursesContent() {
        const [topCourses, setTopCourses] = useState<any[]>([]);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            const fetchTopCourses = async () => {
                try {
                    const res = await fetch('http://localhost:8000/api/courses/all-courses-by-mysefl', {
                        method: 'GET',
                        credentials: 'include'
                    });

                    if (!res.ok) {
                        throw new Error('Failed to fetch top courses');
                    }

                    const data = await res.json();
                    setTopCourses(data.data.topCourses);
                } catch (error) {
                    console.error('Error fetching top courses:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchTopCourses();
        }, []);

        if (isLoading) {
            return (
                <Carousel className="w-full">
                    <CarouselContent className="-ml-1">
                        {[...Array(5)].map((_, index) => (
                            <CarouselItem key={index} className={`md:basis-1/2 lg:basis-1/3`}>
                                <div className="p-1">
                                    <VerticalCardSkeleton />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            );
        }
        return (
            <Carousel className="w-full">
                <CarouselContent className="-ml-1">
                    {topCourses.map((course) => (
                        <CarouselItem key={course._id} className={`md:basis-1/2 lg:basis-1/3`}>
                            <div className="p-1">
                                <CourseVerticalCard key={course._id} course={course} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        );
    }

    return (
        <div className="mb-[61px] w-[900px]">
            <h2 className="text-2xl font-bold mb-4 font-cardo">More Courses </h2>
            <Suspense
                fallback={[...Array(5)].map((_, index) => (
                    <CarouselItem key={index} className={`pl-1 md:basis-1/2 lg:basis-1/5`}>
                        <div className="p-1">
                            <VerticalCardSkeleton />
                        </div>
                    </CarouselItem>
                ))}
            >
                <TopCoursesContent />
            </Suspense>
        </div>
    );
}
