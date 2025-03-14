'use client';

import Link from 'next/link';
import React from 'react';
import { TfiArrowTopRight } from 'react-icons/tfi';

import { layoutStyles } from '@/styles/styles';
import InstructorCard from '../custom/Instructor';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/Carousel';

function TopInstructors({ instructors }: any) {
    return (
        <section className="border-top border-primary-100 pb-[64px] pt-[80px]">
            <div className={layoutStyles.container}>
                <div className={layoutStyles.row}>
                    <div className="w-full">
                        <div className="mb-8 text-primary-800">
                            <h2 className="mb-2 font-bold font-cardo text-[36px] leading-[50px]">
                                Browse Our Top Instructors
                            </h2>
                            <div className="flex items-center justify-between gap-[10px] flex-wrap">
                                <span>Lorem ipsum dolor sit amet</span>
                                <Link
                                    href="/instructors"
                                    className="flex items-center justify-center w-max gap-[10px] font-medium text-base leading-7 transition-all duration-300 ease-in-out hover:text-accent-900"
                                >
                                    Show More Instructors <TfiArrowTopRight className="relative top-[1px]" />
                                </Link>
                            </div>

                            <div className="mt-6">
                                <Carousel className="w-full">
                                    <CarouselContent className="-ml-1">
                                        {instructors.map((instructor: any) => (
                                            <CarouselItem
                                                key={instructor?._id}
                                                className={`pl-1 md:basis-1/2 lg:basis-1/5`}
                                            >
                                                <div className="p-1">
                                                    <InstructorCard key={instructor?._id} instructor={instructor} />
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TopInstructors;
