import InstructorCard from '@/components/custom/Instructor';
import React from 'react';

export default function PopularInstructor() {
    return (
        <div className="mx-auto max-w-[1400px] w-full px-4 lg:px-0 pt-[54px]">
            <div className="heading-section text-left mb-[37px]">
                <h3 className="text-[26px] font-medium text-primary-800 leading-[1.2]">Popular Instructors</h3>
                <div className="text-primary-800 mt-2">
                    These real-world experts are highly rated by learners like you.
                </div>
            </div>

            {/* Container cho các card */}
            <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-y-4 lg:gap-[15px]">
                <InstructorCard isHorizontal={true} width="100px" />
                <InstructorCard isHorizontal={true} width="100px" />
                <InstructorCard isHorizontal={true} width="100px" />
                <InstructorCard isHorizontal={true} width="100px" />
            </div>
        </div>
    );
}
