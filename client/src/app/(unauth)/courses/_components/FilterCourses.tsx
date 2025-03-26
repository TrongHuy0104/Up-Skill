'use client';
import { FiFilter, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import FilterCoursesList from './FilterCoursesList';
import { FilterResponse } from '@/types/Course';

export default function FilterCourses({ filterData }: { readonly filterData: FilterResponse }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    // Kiểm tra kích thước màn hình để cập nhật trạng thái isTablet
    useEffect(() => {
        const checkTablet = () => {
            setIsTablet(window.innerWidth < 1024);
        };

        // Chạy ngay khi component mount
        checkTablet();

        window.addEventListener('resize', checkTablet);
        return () => window.removeEventListener('resize', checkTablet);
    }, []);

    // Tách biệt logic của ternary operation
    const getTransformClass = () => {
        if (isTablet) {
            return isOpen ? 'translate-x-0' : '-translate-x-full';
        }
        return 'translate-x-0';
    };

    return (
        <>
            {/* Nút mở Filter trên mobile & tablet */}
            {isTablet && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            setIsOpen(!isOpen);
                        }
                    }}
                    className="fixed top-1/2 right-0 transform -translate-y-1/2 z-50 bg-accent-600 text-white rounded-l-lg shadow-lg p-2 lg:hidden"
                    style={{ width: '40px', height: '40px' }}
                    aria-label="Open Filter"
                >
                    <FiFilter size={20} className="mx-auto" />
                </button>
            )}

            {/* Sidebar Filter */}
            <div
                className={`fixed lg:relative top-0 left-0 h-full w-[320px] bg-white lg:bg-transparent transition-transform duration-300 z-40 
                ${getTransformClass()} shadow-xl lg:shadow-none`}
            >
                {/* Header trên mobile */}
                {isTablet && (
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-2xl font-bold">Filters</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    setIsOpen(false);
                                }
                            }}
                            className="p-3 hover:text-accent-600 transition-colors"
                            aria-label="Close Filter"
                        >
                            <FiX size={28} />
                        </button>
                    </div>
                )}

                {/* Danh sách Filter */}
                <FilterCoursesList filterData={filterData} />
            </div>

            {/* Overlay giúp đóng filter khi bấm ra ngoài */}
            {isTablet && isOpen && (
                <button
                    onClick={() => setIsOpen(false)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            setIsOpen(false);
                        }
                    }}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
                    aria-label="Close Filter"
                />
            )}
        </>
    );
}
