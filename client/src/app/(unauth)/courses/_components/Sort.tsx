'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ModalComponent from './ModalComponent';
import Image from 'next/image';
import arrowDownIcon from '@/public/assets/icons/arrow-down.svg';

export default function Sort() {
    const [isSortOpen, setIsSortOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // **Lấy giá trị `sort` từ URL hoặc mặc định là "date-created"**
    const sortType = searchParams.get('sort') || 'date-created';

    // **Map giá trị API sang format UI**
    const sortDisplayMap: { [key: string]: string } = {
        bestselling: 'Best Selling',
        oldest: 'Oldest',
        recent: '3 Days',
        'date-created': 'Date Created' // Default nếu không có giá trị trong URL
    };

    // Nếu `sortType` không có trong map, hiển thị mặc định
    const displaySortType = sortDisplayMap[sortType] || 'Date Created';

    useEffect(() => {
        // Đóng dropdown khi click ra ngoài
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSortSelect = (sortValue: string) => {
        setIsSortOpen(false);

        const sortApiMap: { [key: string]: string } = {
            'Best Selling': 'bestselling',
            Oldest: 'oldest',
            '3 Days': 'recent',
            'Date Created': 'date-created'
        };

        const formattedSort = sortApiMap[sortValue];

        if (!formattedSort) {
            console.error('❌ Sort mapping failed for:', sortValue);
            return;
        }

        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', formattedSort);
        router.replace(`?${params.toString()}`);
    };

    return (
        <div className="items-center relative w-auto max-w-[200px] md:max-w-[250px]">
            <div className="flex items-center h-[45px] gap-2">
                <p className="text-primary-600">Sort by</p>
                <button
                    className="flex gap-2 cursor-pointer focus:outline-none w-auto"
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    aria-label="Toggle Sort Options"
                >
                    <span className="text-primary-800">{displaySortType}</span>
                    <Image className="cursor-pointer" src={arrowDownIcon} alt="Arrow Down Icon" />
                </button>
            </div>

            {isSortOpen && (
                <div ref={dropdownRef} className="">
                    <ModalComponent closeModal={() => setIsSortOpen(false)} onSelectSort={handleSortSelect} />
                </div>
            )}
        </div>
    );
}
