'use client'; // Nếu bạn đang dùng Next.js App Router

import * as React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
    readonly totalPages: number;
}

function PaginationComponent({ totalPages }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Lấy giá trị `page` từ URL, nếu không có thì mặc định là 1
    const currentPage = Number(searchParams.get('page')) || 1;

    // Hàm tạo danh sách số trang
    const createPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];
        for (let i = 1; i <= totalPages; i += 1) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pages.push(i);
            } else if (
                (i === currentPage - 2 && currentPage > 3) ||
                (i === currentPage + 2 && currentPage < totalPages - 2)
            ) {
                if (pages[pages.length - 1] !== '...') {
                    pages.push('...');
                }
            }
        }
        return pages;
    };

    // Xử lý chuyển trang và cập nhật URL
    const handlePageChange = (page: number): void => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', page.toString()); // Cập nhật page vào URL
            router.push(`?${params.toString()}`, { scroll: false }); // Không cuộn lên đầu trang
        }
    };

    return (
        <Pagination>
            {/* Previous Button */}
            <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={`flex items-center justify-center px-6 mr-4 rounded-full ${
                    currentPage === 1
                        ? 'bg-primary-100 text-primary-800 cursor-default hover:bg-primary-100'
                        : 'border hover:bg-accent-100 hover:text-primary-800 hover:border-primary-800'
                }`}
                aria-disabled={currentPage === 1}
            >
                &lt;
            </PaginationPrevious>

            {/* Page Numbers */}
            <PaginationContent className="flex items-center space-x-2">
                {createPageNumbers().map((page, index) => {
                    if (page === '...') {
                        return (
                            <PaginationEllipsis key={`ellipsis-${index}`}>
                                <span className="text-primary-800" aria-hidden="true">
                                    ...
                                </span>
                            </PaginationEllipsis>
                        );
                    }

                    return (
                        <PaginationItem key={`page-${page}`}>
                            <PaginationLink
                                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                    page === currentPage
                                        ? 'bg-primary-800 text-primary-50 hover:bg-primary-800 hover:text-primary-50'
                                        : 'text-primary-800 hover:bg-primary-100'
                                }`}
                                onClick={() => handlePageChange(page as number)}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
            </PaginationContent>

            {/* Next Button */}
            <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={`flex items-center justify-center px-6 ml-4 rounded-full ${
                    currentPage === totalPages
                        ? 'bg-primary-100 text-primary-800 cursor-default hover:bg-primary-100'
                        : 'border hover:bg-accent-100 hover:text-primary-800 hover:border-primary-800'
                }`}
                aria-disabled={currentPage === totalPages}
            >
                &gt;
            </PaginationNext>
        </Pagination>
    );
}

export default PaginationComponent;
