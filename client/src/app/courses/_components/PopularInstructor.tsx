// import InstructorCard from '@/components/ui/Instructor';
import React from 'react';

export default function PopularInstructor() {
    return (
        <div className="mx-auto w-[1400px] pt-[54px]">
            <div className="heading-section text-left mb-[37px]">
                <h3 className="text-[26px] font-medium text-primary-800 leading-[1.2] ">Popular Instructors</h3>
                <div className="text-primary-800 mt-2 ">
                    These real-world experts are highly rated by learners like you.
                </div>
            </div>
            <div className=" flex  justify-between gap-[15px]">
                {/* <InstructorCard isHorizontal={true} />
                <InstructorCard isHorizontal={true} />
                <InstructorCard isHorizontal={true} />
                <InstructorCard isHorizontal={true} /> */}
            </div>
        </div>
    );
}
