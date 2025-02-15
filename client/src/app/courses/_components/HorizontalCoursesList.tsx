'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import arrowDownIcon from '@/public/assets/icons/arrow-down.svg';
import { CourseHorizontalCard } from '@/components/ui/CourseCard';
import PaginationComponent from '@/components/ui/PaginationComponent';
import dynamic from 'next/dynamic';

// Sử dụng dynamic để tắt SSR cho modal
const Modal = dynamic(() => import('@/app/courses/_components/ModalComponent'), { ssr: false });

type Benefit = {
    title: string;
    _id: string;
};

type Prerequisite = {
    title: string;
    _id: string;
};

type CourseData = {
    title: string;
    description: string;
    _id: string;
};

export type Course = {
    _id: string;
    name: string;
    description: string;
    authorId: string;
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
}

export default function HorizontalCoursesList({ courses }: HorizontalCoursesListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false); // Quản lý trạng thái modal
    const [isClient, setIsClient] = useState(false); // Đảm bảo rằng modal chỉ được hiển thị trên client
    const [selectedSort, setSelectedSort] = useState('Best Selling'); // Quản lý giá trị đã chọn từ modal

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

    // pagination
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    if (!isClient) {
        return null; // Không render gì khi chưa ở client
    }

    return (
        <div className="pl-[28px] relative">
            <div className="flex justify-between items-center pb-8 w-full">
                <p className="text-primary-800">Showing 1-9 Of 62 Courses</p>
                <div className="flex items-center gap-3">
                    <p className="text-primary-600">Sort by</p>
                    <span className="text-primary-800">{selectedSort}</span> {/* Hiển thị giá trị đã chọn */}
                    <Image className="cursor-pointer" src={arrowDownIcon} alt="Arrow Down Icon" onClick={toggleModal} />
                </div>
            </div>

            {/* Dropdown Modal */}
            {isModalOpen && <Modal closeModal={closeModal} onSelectSort={handleSortSelect} />}

            {courses.map((course) => (
                <CourseHorizontalCard key={course._id} course={course} />
            ))}

            {/* Pagination */}
            <div className="p-5">
                <PaginationComponent currentPage={currentPage} totalPages={10} onPageChange={handlePageChange} />
            </div>
        </div>
    );
}
