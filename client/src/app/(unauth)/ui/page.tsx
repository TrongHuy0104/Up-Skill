"use client"
import PaginationComponent from '@/components/ui/PaginationComponent';
import React, { useState } from 'react';

const MyPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 20;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        console.log(`Chuyển sang trang: ${page}`);
    };

    return (
        <div>
            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default MyPage;
