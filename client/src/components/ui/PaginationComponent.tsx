import * as React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/Pagination';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
}

function PaginationComponent({ currentPage, totalPages, onPageChange }: PaginationProps) {
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

    const handlePageChange = (page: number): void => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <Pagination>
            {/* Previous Button */}
            <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}
                aria-disabled={currentPage === 1}
            >
                &lt; Prev
            </PaginationPrevious>

            {/* Page Numbers */}
            <PaginationContent>
                {createPageNumbers().map((page, index) => {
                    if (page === '...') {
                        return (
                            <PaginationEllipsis key={`ellipsis-${index}`}>
                                <span className="px-4 py-2" aria-hidden="true">...</span>
                            </PaginationEllipsis>
                        );
                    }

                    return (
                        <PaginationItem key={`page-${page}`}>
                            <PaginationLink
                                isActive={page === currentPage}
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
                className={currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}
                aria-disabled={currentPage === totalPages}
            >
                Next &gt;
            </PaginationNext>
        </Pagination>
    );
}

export default PaginationComponent;
