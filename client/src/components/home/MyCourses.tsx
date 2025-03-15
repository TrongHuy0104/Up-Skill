'use client';

import { layoutStyles } from '@/styles/styles';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/Carousel';
import Link from 'next/link';
import React, { Suspense, useEffect, useState } from 'react';
import { TfiArrowTopRight } from 'react-icons/tfi';
import CourseVerticalCard from '../custom/CourseCard';
import { VerticalCardSkeleton } from '../ui/Skeleton';

function TopCoursesContent() {
    const [courses, setCourses] = useState<any[]>([]);
    const [progressData, setProgressData] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isProgressLoading, setIsProgressLoading] = useState(true);

    useEffect(() => {
        const fetchTopCourses = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/purchased/my-course`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch top courses');
                }

                const data = await res.json();
                setCourses(data.data.course);
            } catch (error) {
                console.error('Error fetching top courses:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopCourses();
    }, []);

    useEffect(() => {
        if (courses.length === 0) return;

        const fetchProgressData = async () => {
            setIsProgressLoading(true);
            const progressMap: Record<string, number> = {};

            try {
                await Promise.all(
                    courses.map(async (course) => {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/progress/${course._id}`, {
                            method: 'GET',
                            credentials: 'include'
                        });

                        if (res.ok) {
                            const data = await res.json();
                            progressMap[course._id] = data.data?.completionPercentage || 0;
                        }
                    })
                );

                setProgressData(progressMap);
            } catch (error) {
                console.error('Error fetching progress data:', error);
            } finally {
                setIsProgressLoading(false);
            }
        };

        fetchProgressData();
    }, [courses]);

    if (isLoading || isProgressLoading) {
        return (
            <Carousel className="w-full">
                <CarouselContent className="-ml-1">
                    {[...Array(5)].map((_, index) => (
                        <CarouselItem key={index} className={`pl-1 md:basis-1/2 lg:basis-1/5`}>
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
                {courses.map((course) => (
                    <CarouselItem key={course._id} className={`pl-1 md:basis-1/2 lg:basis-1/5`}>
                        <div className="p-1">
                            <CourseVerticalCard
                                key={course._id}
                                course={course}
                                isProgress={true}
                                progress={progressData[course._id] || 0}
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}

function MyCourses() {
    return (
        <section className="border-top border-primary-100 pb-[64px] pt-[80px]">
            <div className={layoutStyles.container}>
                <div className={layoutStyles.row}>
                    <div className="w-full">
                        <div className="mb-8 text-primary-800">
                            <h2 className="mb-2 font-bold font-cardo text-[36px] leading-[50px]">
                                Your Courses
                            </h2>
                            <div className="flex items-center justify-between gap-[10px] flex-wrap">
                                <span>Good learn good skill!</span>
                                <Link
                                    href="/courses"
                                    className="flex items-center justify-center w-max gap-[10px] font-medium text-base leading-7 transition-all duration-300 ease-in-out hover:text-accent-900"
                                >
                                    Show More Courses <TfiArrowTopRight className="relative top-[1px]" />
                                </Link>
                            </div>
                            <div className="mt-6">
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
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MyCourses;
