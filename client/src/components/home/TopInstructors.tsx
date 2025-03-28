'use client';

import Link from 'next/link';
import React from 'react';
import { TfiArrowTopRight } from 'react-icons/tfi';

import { layoutStyles } from '@/styles/styles';
import InstructorCard from '../custom/Instructor';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/Carousel';

function TopInstructors({ instructors }: any) {
    return (
        <section className="border-top border-primary-100 pb-12 md:pb-[64px] md:pt-[80px]">
  <div className={layoutStyles.container}>
    <div className={layoutStyles.row}>
      <div className="w-full">
        <div className="mb-6 md:mb-8 text-primary-800 px-4 sm:px-0">
          <h2 className="mb-2 font-bold font-cardo text-2xl sm:text-3xl lg:text-[36px] leading-[1.3] lg:leading-[50px]">
            Browse Our Top Instructors
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-[10px]">
            <span className="text-sm sm:text-base">Lorem ipsum dolor sit amet</span>
            <Link
              href="/instructors"
              className="flex items-center justify-center w-max gap-[10px] font-medium text-sm sm:text-base leading-7 transition-all duration-300 ease-in-out hover:text-accent-900"
            >
              Show More Instructors <TfiArrowTopRight className="relative top-[1px]" />
            </Link>
          </div>

          <div className="mt-4 sm:mt-6">
            <Carousel className="w-full">
              <CarouselContent className="-ml-1">
                {instructors.map((instructor: any) => (
                  <CarouselItem
                    key={instructor?._id}
                    className={`pl-1 basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-1/5`}
                  >
                    <div className="p-1">
                      <InstructorCard key={instructor?._id} instructor={instructor} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
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
