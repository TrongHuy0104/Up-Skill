'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import arrowDownIcon from '@/public/assets/icons/arrow-down.svg';
import { CourseHorizontalCard } from '@/components/custom/CourseCard';
import PaginationComponent from '@/components/custom/PaginationComponent';
import dynamic from 'next/dynamic';

// Sử dụng dynamic để tắt SSR cho modal
const Modal = dynamic(() => import('@/app/(unauth)/courses/_components//ModalComponent'), { ssr: false });

export default function HorizontalCoursesList() {
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
                    <Image
                        className="cursor-pointer"
                        src={arrowDownIcon}
                        alt="Arrow Down Icon"
                        onClick={toggleModal} // Khi click vào mũi tên, sẽ gọi toggleModal
                    />
                </div>
            </div>

            {/* Dropdown Modal */}
            {isModalOpen && <Modal closeModal={closeModal} onSelectSort={handleSortSelect} />}

            {/* List of course cards */}
            <CourseHorizontalCard />
            <CourseHorizontalCard />
            <CourseHorizontalCard />
            <CourseHorizontalCard />
            <CourseHorizontalCard />
            <CourseHorizontalCard />
            <CourseHorizontalCard />
            <CourseHorizontalCard />

            {/* Pagination */}
            <div className="p-5">
                <PaginationComponent currentPage={currentPage} totalPages={10} onPageChange={handlePageChange} />
            </div>
        </div>
    );
}
