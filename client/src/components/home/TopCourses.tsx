import { layoutStyles } from '@/styles/styles';
import { CarouselSpacing } from '../custom/CustomCarousel';
import Link from 'next/link';
import React from 'react';
import { TfiArrowTopRight } from 'react-icons/tfi';
import CourseVerticalCard from '../custom/CourseCard';

function TopCourses() {
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
                                <CarouselSpacing component={<CourseVerticalCard />} colNumber={5} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TopCourses;
