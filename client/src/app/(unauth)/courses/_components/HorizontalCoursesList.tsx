'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import arrowDownIcon from '@/public/assets/icons/arrow-down.svg';
import { CourseHorizontalCard } from '@/components/custom/CourseCard';
import PaginationComponent from '@/components/custom/PaginationComponent';
import dynamic from 'next/dynamic';
import noData from '@/public/assets/images/courses/no-data.jpg';
import { HorizontalCardSkeleton } from '@/components/ui/Skeleton';

// Sử dụng dynamic để tắt SSR cho modal
const Modal = dynamic(() => import('@/app/(unauth)/courses/_components//ModalComponent'), { ssr: false });

type Benefit = {
    title: string;
    _id: string;
};

type Prerequisite = {
    title: string;
    _id: string;
};

type CourseData = {
    _id: string;
    title: string;
    description: string;
    videoSection: string;
    videoLength: number;
};

interface Author {
    _id: string;
    name: string;
}
type Thumbnail = {
    public_id: string;
    url: string;
};

export type Course = {
    _id: string;
    name: string;
    thumbnail: Thumbnail;
    description: string;
    authorId: Author;
    price: number;
    estimatedPrice: number;
    tags: string;
    level: string;
    demoUrl: string;
    benefits: Benefit[];
    prerequisites: Prerequisite[];
    courseData: CourseData[];
    rating: number;
    purchased: number;
    reviews: any[];
    __v: number;
};

interface HorizontalCoursesListProps {
    readonly courses: Course[];
    readonly totalPages: number;
    readonly totalCourses: number;
    readonly limit: number;
    readonly page: number;
}

export default function HorizontalCoursesList({
    courses,
    totalPages,
    totalCourses,
    limit,
    page
}: HorizontalCoursesListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false); // Quản lý trạng thái modal
    const [isClient, setIsClient] = useState(false); // Đảm bảo rằng modal chỉ được hiển thị trên client
    const [selectedSort, setSelectedSort] = useState('Best Selling'); // Quản lý giá trị đã chọn từ
    const [currentPage, setCurrentPage] = useState(page);

    useEffect(() => {
        setIsClient(true); // Chỉ chạy sau khi component render trên client
    }, []);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen); // Đổi trạng thái của modal khi click vào mũi tên
    };

    const closeModal = () => {
        setIsModalOpen(false); // Đóng modal khi chọn một mục
    };

    // Hàm xử lý khi chọn giá trị trong modal
    const handleSortSelect = (sortValue: string) => {
        setSelectedSort(sortValue); // Cập nhật giá trị đã chọn
    };

    if (!isClient) {
        return (
            <div className="w-full">
                {[...Array(3)].map((_, index) => (
                    <HorizontalCardSkeleton key={index} />
                ))}
            </div>
        );
    }
    const startIndex = totalCourses === 0 ? 0 : (page - 1) * limit + 1;
    const endIndex = Math.min(page * limit, totalCourses);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="pl-[28px] relative w-full">
            <div className="flex justify-between items-center pb-8 w-full">
                <p className="text-primary-800">
                    Showing {startIndex}-{endIndex} Of {totalCourses} Courses
                </p>
                <div className="flex items-center gap-3">
                    <p className="text-primary-600">Sort by</p>
                    <span className="text-primary-800">{selectedSort}</span> {/* Hiển thị giá trị đã chọn */}
                    <Image className="cursor-pointer" src={arrowDownIcon} alt="Arrow Down Icon" onClick={toggleModal} />
                </div>
            </div>

            {/* Dropdown Modal */}
            {isModalOpen && <Modal closeModal={closeModal} onSelectSort={handleSortSelect} />}

            {totalCourses === 0 ? (
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <Image src={noData} alt="No Courses Found" />
                    <p className="text-primary-600 mt-4">No courses found. Please try a different search.</p>
                </div>
            ) : (
                courses.map((course) => <CourseHorizontalCard key={course._id} course={course} />)
            )}

            {/* Pagination */}
            {totalCourses > 0 && (
                <div className="p-5">
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
