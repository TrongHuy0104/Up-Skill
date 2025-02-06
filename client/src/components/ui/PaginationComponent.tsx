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
    // eslint-disable-next-line no-unused-vars
    onPageChange: (pageNumber: number) => void; 
  }

function PaginationComponent({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const createPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];
        for (let i = 1; i <= totalPages; i += 1) {
            if (
                i === 1
        || i === totalPages
        || (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
                pages.push(i);
            } else if (
                (i === currentPage - 2 && currentPage > 3) 
                || (i === currentPage + 2 && currentPage < totalPages - 2)
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
            <PaginationPrevious>
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    aria-label="Previous page"
                >
                &lt; Prev
                </button>
            </PaginationPrevious>

            <PaginationContent>
                {createPageNumbers().map((page) => {
                    if (page === '...') {
                        return (
                            <PaginationEllipsis key={`ellipsis-${currentPage}-${Math.random()}`}>
                                <span className="px-4 py-2" aria-hidden="true">
                                  ...
                                </span>
                            </PaginationEllipsis>
                        );
                    }

                    return (
                        <PaginationItem key={`page-${page}`}>
                            <PaginationLink>
                                <button
                                    type="button"
                                    onClick={() => handlePageChange(page as number)}
                                    className={`px-4 py-2 text-sm rounded ${
                                        page === currentPage
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                    aria-label={`Go to page ${page}`}
                                    aria-current={page === currentPage ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
            </PaginationContent>

            <PaginationNext>
                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    aria-label="Next page"
                >
                  Next &gt;
                </button>
            </PaginationNext>
        </Pagination>
    );
}

export default PaginationComponent;
