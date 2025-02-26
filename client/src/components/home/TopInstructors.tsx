'use client';

import { layoutStyles } from '@/styles/styles';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/Carousel';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { TfiArrowTopRight } from 'react-icons/tfi';
import InstructorCard from '../custom/Instructor';

function TopInstructors() {
    const [topInstructors, setTopInstructors] = useState<any[]>([]);  
    const [loading, setLoading] = useState<boolean>(true); 

    useEffect(() => {
        const fetchTopInstructors = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/user/top-instructors', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch top instructors');
                }

                const data = await res.json(); 
                console.log(data);

                setTopInstructors(data.topInstructors); 
                setLoading(false); 
            } catch (error) {
                console.error('Error fetching top instructors:', error);
                setLoading(false); 
            }
        };

        fetchTopInstructors(); 
    }, []);

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
                                {loading ? (
                                    <p>Loading top instructors...</p>  // Loading state message
                                ) : (
                                    <Carousel className="w-full">
                                        <CarouselContent className="-ml-1">
                                            {topInstructors.map((instructor) => (
                                                <CarouselItem key={instructor._id} className={`pl-1 md:basis-1/2 lg:basis-1/5`}>
                                                    <div className="p-1">
                                                        <InstructorCard
                                                            key={instructor._id}
                                                            name={instructor.name || 'Unknown Instructor'}
                                                            jobTitle={instructor.jobTitle || 'Professional Instructor'}
                                                            rating={instructor.rating || 0}
                                                            students={instructor.students || 0}
                                                            courses={instructor.courses || 0}
                                                            imageUrl={instructor.imageUrl || '/default-instructor.jpg'} // Fallback image
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

export default TopInstructors;