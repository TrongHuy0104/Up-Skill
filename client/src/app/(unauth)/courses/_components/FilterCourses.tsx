'use client';
import { FiFilter, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import FilterCoursesList from './FilterCoursesList';
import { FilterResponse } from '@/types/Course';

export default function FilterCourses({ filterData }: { readonly filterData: FilterResponse }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkTablet = () => {
            // Xử lý cho iPad (768px - 1024px) và điện thoại (<768px)
            setIsTablet(window.innerWidth < 1024);
        };

        checkTablet();
        window.addEventListener('resize', checkTablet);
        return () => window.removeEventListener('resize', checkTablet);
    }, []);

    return (
        <>
            {/* Toggle button cho iPad & điện thoại */}
            {isTablet && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="fixed bottom-6 right-6 z-50 bg-accent-600 text-white p-4 rounded-full shadow-xl
          lg:hidden"
                >
                    <FiFilter size={24} />
                </button>
            )}

            {/* Filter sidebar */}
            <div
                className={`
          fixed lg:relative 
          top-0 left-0 
          h-full w-[320px] 
          bg-white lg:bg-transparent 
          transform transition-transform duration-300 
          z-40
          ${isTablet ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          shadow-xl lg:shadow-none
        `}
            >
                {/* Header cho tablet */}
                {isTablet && (
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-2xl font-bold">Filters</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:text-accent-600 transition-colors"
                        >
                            <FiX size={28} />
                        </button>
                    </div>
                )}

                <FilterCoursesList filterData={filterData} />
            </div>

            {/* Overlay cho tablet */}
            {isTablet && isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
