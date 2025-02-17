'use client';
import InstructorCard from '@/components/ui/Instructor';
import PaginationComponent from '@/components/ui/PaginationComponent';
import React, { useState, useEffect } from 'react';

interface Instructor {
    name: string;
    avatar?: string;
    students: number;
    courses: number;
    rating: number;
    profession: string;
}

const InstructorList = ({ instructors = [] }: { instructors?: Instructor[] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const instructorsPerPage = 10;

    // Đảm bảo instructors là một mảng
    const safeInstructors = Array.isArray(instructors) ? instructors : [];

    // Debugging: Kiểm tra dữ liệu đầu vào
    useEffect(() => {
        console.log('instructors data:', instructors);
        console.log('Safe instructors:', safeInstructors);
    }, [instructors, safeInstructors]); // Thêm safeInstructors vào dependency array

    // Xử lý phân trang
    const indexOfLastInstructor = currentPage * instructorsPerPage;
    const indexOfFirstInstructor = indexOfLastInstructor - instructorsPerPage;
    const currentInstructors = safeInstructors.slice(indexOfFirstInstructor, indexOfLastInstructor);

    const totalPages = Math.ceil(safeInstructors.length / instructorsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <div className="w-[1400px] px-[14px] mx-auto flex flex-wrap gap-x-[20px] gap-y-[40px] mb-10">
                {currentInstructors.length > 0 ? (
                    currentInstructors.map((instructor) => (
                        <InstructorCard key={instructor.name} instructor={instructor} />
                    ))
                ) : (
                    <p className="text-center w-full text-gray-500">No instructors available.</p>
                )}
            </div>

            {totalPages > 1 && (
                <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default InstructorList;
