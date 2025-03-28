'use client';

import Link from 'next/link';
import React from 'react';
import { TfiArrowTopRight } from 'react-icons/tfi';

import { layoutStyles } from '@/styles/styles';
import CourseVerticalCard from '../custom/CourseCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/Carousel';

function TopCoursesContent({ courses }: any) {
    return (
        <Carousel className="w-full">
            <CarouselContent className="-ml-1 md:gap-4 lg:gap-6">
                {courses?.map((course: any) => (
                    <CarouselItem 
                        key={course._id} 
                        className={`pl-1 basis-[90%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5`}  
                    >
                        <div className="p-1 md:p-0">
                            <CourseVerticalCard key={course._id} course={course} />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
        </Carousel>
    );
}

function TopCourses({ courses }: any) {
    return (
        <section className="border-top border-primary-100 pb-12 md:pb-[64px] pt-12 md:pt-[80px]">
            <div className={layoutStyles.container}>
                <div className={layoutStyles.row}>
                    <div className="w-full">
                        {/* Thêm p-4 cho mobile và lg:p-4 cho desktop */}
                        <div className="mb-6 md:mb-8 text-primary-800 p-4 lg:p-4">
                            <h2 className="mb-2 font-bold font-cardo text-2xl sm:text-3xl lg:text-[36px] leading-[1.3] lg:leading-[50px]">
                                Browse Our Top Courses
                            </h2>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-[10px]">
                                <span className="text-sm sm:text-base">Lorem ipsum dolor sit amet</span>
                                <Link
                                    href="/courses"
                                    className="flex items-center justify-center w-max gap-[10px] font-medium text-sm sm:text-base leading-7 transition-all duration-300 ease-in-out hover:text-accent-900"
                                >
                                    Show More Courses <TfiArrowTopRight className="relative top-[1px]" />
                                </Link>
                            </div>
                            <div className="mt-4 sm:mt-6">
                                <TopCoursesContent courses={courses} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TopCourses;