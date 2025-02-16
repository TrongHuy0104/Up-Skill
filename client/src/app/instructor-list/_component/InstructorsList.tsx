'use client';
import InstructorCard from '@/components/ui/Instructor';
import PaginationComponent from '@/components/ui/PaginationComponent'; // Import PaginationComponent
import React, { useState } from 'react';

const instructors = [
    // Simulate 100 instructors
    <InstructorCard key={1} />,
    <InstructorCard key={2} />,
    <InstructorCard key={3} />,
    <InstructorCard key={4} />,
    <InstructorCard key={5} />,
    <InstructorCard key={6} />,
    <InstructorCard key={7} />,
    <InstructorCard key={8} />,
    <InstructorCard key={9} />,
    <InstructorCard key={10} />,
    <InstructorCard key={11} />,
    <InstructorCard key={12} />,
    <InstructorCard key={13} />,
    <InstructorCard key={14} />,
    <InstructorCard key={15} />,
    <InstructorCard key={16} />,
    <InstructorCard key={17} />,
    <InstructorCard key={18} />,
    <InstructorCard key={19} />,
    <InstructorCard key={20} />,
    <InstructorCard key={21} />,
    <InstructorCard key={22} />,
    <InstructorCard key={23} />,
    <InstructorCard key={24} />,
    <InstructorCard key={25} />,
    <InstructorCard key={26} />,
    <InstructorCard key={27} />,
    <InstructorCard key={28} />,
    <InstructorCard key={29} />,
    <InstructorCard key={30} />,
    <InstructorCard key={31} />,
    <InstructorCard key={32} />,
    <InstructorCard key={33} />,
    <InstructorCard key={34} />,
    <InstructorCard key={35} />,
    <InstructorCard key={36} />,
    <InstructorCard key={37} />,
    <InstructorCard key={38} />,
    <InstructorCard key={39} />,
    <InstructorCard key={40} />,
    <InstructorCard key={41} />,
    <InstructorCard key={42} />,
    <InstructorCard key={43} />,
    <InstructorCard key={44} />,
    <InstructorCard key={45} />,
    <InstructorCard key={46} />,
    <InstructorCard key={47} />,
    <InstructorCard key={48} />,
    <InstructorCard key={49} />,
    <InstructorCard key={50} />,
    <InstructorCard key={51} />,
    <InstructorCard key={52} />,
    <InstructorCard key={53} />,
    <InstructorCard key={54} />,
    <InstructorCard key={55} />,
    <InstructorCard key={56} />,
    <InstructorCard key={57} />,
    <InstructorCard key={58} />,
    <InstructorCard key={59} />,
    <InstructorCard key={60} />,
    <InstructorCard key={61} />,
    <InstructorCard key={62} />,
    <InstructorCard key={63} />,
    <InstructorCard key={64} />,
    <InstructorCard key={65} />,
    <InstructorCard key={66} />,
    <InstructorCard key={67} />,
    <InstructorCard key={68} />,
    <InstructorCard key={69} />,
    <InstructorCard key={70} />,
    <InstructorCard key={71} />,
    <InstructorCard key={72} />,
    <InstructorCard key={73} />,
    <InstructorCard key={74} />,
    <InstructorCard key={75} />,
    <InstructorCard key={76} />,
    <InstructorCard key={77} />,
    <InstructorCard key={78} />,
    <InstructorCard key={79} />,
    <InstructorCard key={80} />,
    <InstructorCard key={81} />,
    <InstructorCard key={82} />,
    <InstructorCard key={83} />,
    <InstructorCard key={84} />,
    <InstructorCard key={85} />,
    <InstructorCard key={86} />,
    <InstructorCard key={87} />,
    <InstructorCard key={88} />,
    <InstructorCard key={89} />,
    <InstructorCard key={90} />,
    <InstructorCard key={91} />,
    <InstructorCard key={92} />,
    <InstructorCard key={93} />,
    <InstructorCard key={94} />,
    <InstructorCard key={95} />,
    <InstructorCard key={96} />,
    <InstructorCard key={97} />,
    <InstructorCard key={98} />,
    <InstructorCard key={99} />,
    <InstructorCard key={100} />
];

export default function InstructorList() {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const instructorsPerPage = 10; // Update to 10 instructors per page

    // Calculate the range of instructors to display
    const indexOfLastInstructor = currentPage * instructorsPerPage;
    const indexOfFirstInstructor = indexOfLastInstructor - instructorsPerPage;
    const currentInstructors = instructors.slice(indexOfFirstInstructor, indexOfLastInstructor);

    // Total number of pages
    const totalPages = Math.ceil(instructors.length / instructorsPerPage);

    // Handlers for pagination
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <div className="w-[1400px] px-[14px] mx-auto flex flex-wrap gap-x-[20px] gap-y-[40px] mb-10">
                {/* Render the current instructors */}
                {currentInstructors}
            </div>

            {/* Pagination Controls */}
            <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    );
}
