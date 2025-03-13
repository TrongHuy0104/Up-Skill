'use client';
import InstructorCard from '@/components/custom/Instructor';
import PaginationComponent from '@/components/custom/PaginationComponent';
import React, { useState, useEffect, useMemo } from 'react';

interface Instructor {
    _id: string;
    name: string;
    avatar?: { url?: string };
    students: number;
    courses: number;
    rating: number;
    profession: string;
    uploadedCoursesCount: number;
}

const InstructorList = ({ instructors = [] }: { instructors?: Instructor[] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const instructorsPerPage = 10;

    // Đảm bảo instructors là một mảng
    const safeInstructors = useMemo(() => (Array.isArray(instructors) ? instructors : []), [instructors]);

    // Debugging: Kiểm tra dữ liệu đầu vào
    useEffect(() => {}, [instructors, safeInstructors]); // Thêm safeInstructors vào dependency array

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
            <div className="max-w-[1400px]  mx-auto flex flex-wrap justify-start gap-6">
                {currentInstructors.length > 0 ? (
                    currentInstructors.map((instructor) => (
                        <div key={instructor._id} className="w-[260px] flex-grow-0 flex-shrink-0">
                            <InstructorCard instructor={instructor} />
                        </div>
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
