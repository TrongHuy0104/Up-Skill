'use client'

import { layoutStyles } from '@/styles/styles';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/Carousel';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { TfiArrowTopRight } from 'react-icons/tfi';
import CourseVerticalCard from '../custom/CourseCard';

function TopCourses() {
    const [topCourses, setTopCourses] = useState<any[]>([]);  
    const [loading, setLoading] = useState<boolean>(true); 

    useEffect(() => {
        const fetchTopCourses = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/courses/top-courses', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch top courses');
                }

                const data = await res.json(); 
                console.log(data);

                setTopCourses(data.topCourses); 
                setLoading(false); 
            } catch (error) {
                console.error('Error fetching top courses:', error);
                setLoading(false); 
            }
        };

        fetchTopCourses(); 
    }, []);

    return (
        <section className="border-top border-primary-100 pb-[64px] pt-[80px]">
            <div className={layoutStyles.container}>
                <div className={layoutStyles.row}>
                    <div className="w-full">
                        <div className="mb-8 text-primary-800">
                            <h2 className="mb-2 font-bold font-cardo text-[36px] leading-[50px]">
                                Browse Our Top Courses
                            </h2>
                            <div className="flex items-center justify-between gap-[10px] flex-wrap">
                                <span>Lorem ipsum dolor sit amet</span>
                                <Link
                                    href="/courses"
                                    className="flex items-center justify-center w-max gap-[10px] font-medium text-base leading-7 transition-all duration-300 ease-in-out hover:text-accent-900"
                                >
                                    Show More Courses <TfiArrowTopRight className="relative top-[1px]" />
                                </Link>
                            </div>

                            <div className="mt-6">
                                {loading ? (
                                    <p>Loading top courses...</p>  // Loading state message
                                ) : (
                                    <Carousel className="w-full">
                                        <CarouselContent className="-ml-1">
                                            {topCourses.map((course) => (
                                                <CarouselItem key={course._id} className={`pl-1 md:basis-1/2 lg:basis-1/5`}>
                                                    <div className="p-1">
                                                        <CourseVerticalCard
                                                            key={course._id}
                                                            imageUrl={course?.thumbnail?.url}
                                                            title={course.name}
                                                            lessonsCount={course.courseData?.length || 0}
                                                            duration={course.duration || 'N/A'}
                                                            rating={course.rating || 0}
                                                            reviewsCount={course.reviews?.length || 0}
                                                            instructorName={course.authorId?.name || 'Unknown Instructor'}
                                                            price={course.price || 0}
                                                        />
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious />
                                        <CarouselNext />
                                    </Carousel>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TopCourses;

