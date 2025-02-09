'use client';
import Image from 'next/image';
import { useState } from 'react';
import arrowDownIcon from '@/public/assets/icons/arrow-down.svg';
import { CourseHorizontalCard } from '@/components/ui/CourseCard';

export default function HoriCoursesList() {
    const [isModalOpen, setIsModalOpen] = useState(false); // Quản lý trạng thái modal

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen); // Đổi trạng thái của modal khi click vào mũi tên
    };

    const closeModal = () => {
        setIsModalOpen(false); // Đóng modal khi chọn một mục
    };

    return (
        <div className="pl-[28px] relative">
            <div className="flex justify-between items-center pb-8 w-full">
                <p className="text-primary-800">Showing 1-9 Of 62 Courses</p>
                <div className="flex items-center gap-3">
                    <p className="text-primary-600">Sort by</p>
                    <span className="text-primary-800">Best Selling</span>
                    <Image
                        className="cursor-pointer "
                        src={arrowDownIcon}
                        alt="Arrow Down Icon"
                        onClick={toggleModal} // Khi click vào mũi tên, sẽ gọi toggleModal
                    />
                </div>
            </div>

            {/* Dropdown Modal */}
            {isModalOpen && (
                <div
                    className="absolute top-[1%] right-0 mt-2 bg-white rounded-lg shadow-lg w-48 p-4 z-50"
                    onClick={(e) => e.stopPropagation()} // Ngăn việc đóng khi click vào bên trong modal
                >
                    <ul className="space-y-2">
                        <li className="cursor-pointer hover:bg-gray-200 p-2 rounded" onClick={closeModal}>
                            Best Selling
                        </li>
                        <li className="cursor-pointer hover:bg-gray-200 p-2 rounded" onClick={closeModal}>
                            Oldest
                        </li>
                        <li className="cursor-pointer hover:bg-gray-200 p-2 rounded" onClick={closeModal}>
                            3 days
                        </li>
                    </ul>
                </div>
            )}

            <CourseHorizontalCard />
            <CourseHorizontalCard />
            <CourseHorizontalCard />
            <CourseHorizontalCard />
            <CourseHorizontalCard />
            <CourseHorizontalCard />
            <CourseHorizontalCard />
            <CourseHorizontalCard />
        </div>
    );
}
