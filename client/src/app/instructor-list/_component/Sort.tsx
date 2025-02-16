'use client';
import React, { useState, useEffect, useRef } from 'react';
import ModalComponent from './ModalComponent'; // Import the SortComponent
import Image from 'next/image';
import arrowDownIcon from '@/public/assets/icons/arrow-down.svg';

export default function Sort() {
    const [isSortOpen, setIsSortOpen] = useState(false); // Toggle sort dropdown
    const [isClient, setIsClient] = useState(false); // Ensures rendering only on the client
    const [selectedSort, setSelectedSort] = useState('Date Created'); // Manage the selected sort option

    // Reference to the dropdown to check if the click is outside
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setIsClient(true); // Only run on the client

        // Event listener to close dropdown when clicked outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsSortOpen(false); // Close the dropdown if clicked outside
            }
        };

        // Attach the event listener on mount
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleSortDropdown = () => {
        setIsSortOpen(!isSortOpen); // Toggle dropdown visibility
    };

    const closeSortDropdown = () => {
        setIsSortOpen(false); // Close dropdown when an option is selected
    };

    const handleSortSelect = (sortValue: string) => {
        setSelectedSort(sortValue); // Update selected sort option
        closeSortDropdown(); // Close the dropdown after selection
    };

    if (!isClient) {
        return null; // Don't render anything until it's client-side
    }

    return (
        <div className="items-center relative">
            {/* Chỉnh sửa flex container */}
            <div className="flex items-center h-[45px] gap-2">
                <p className="text-primary-600">Sort by</p>
                <div className="flex gap-2">
                    <button
                        className="text-primary-800 cursor-pointer"
                        onClick={toggleSortDropdown} // Mở dropdown khi click vào "Date Created"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                toggleSortDropdown(); // Kích hoạt dropdown khi nhấn Enter hoặc Space
                            }
                        }}
                        tabIndex={0} // Đảm bảo phần tử có thể nhận tiêu điểm từ bàn phím
                    >
                        {selectedSort}
                    </button>
                    <button
                        className="cursor-pointer"
                        onClick={toggleSortDropdown} // Mở dropdown khi click vào mũi tên
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                toggleSortDropdown(); // Kích hoạt dropdown khi nhấn Enter hoặc Space
                            }
                        }}
                        tabIndex={0} // Đảm bảo phần tử có thể nhận tiêu điểm từ bàn phím
                    >
                        <Image src={arrowDownIcon} alt="Arrow Down Icon" />
                    </button>
                </div>
            </div>

            {/* Sort Dropdown */}
            {isSortOpen && (
                <div ref={dropdownRef}>
                    <ModalComponent closeModal={closeSortDropdown} onSelectSort={handleSortSelect} />
                </div>
            )}
        </div>
    );
}
