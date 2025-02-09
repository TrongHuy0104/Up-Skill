import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ButtonProps, buttonVariants } from '@/components/ui/Button';

type PaginationProps = {
  className?: string;
} & React.ComponentProps<'nav'>;

function Pagination({ className, ...props }: PaginationProps) {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            className={cn('mx-auto flex w-full justify-center', className)}
            {...props}
        />
    );
}
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
    ({ className, ...props }, ref) => (
        <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
    )
);
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
    ({ className, ...props }, ref) => (
        <li ref={ref} className={cn('', className)} {...props} />
    )
);
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  className?: string;
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> & React.ComponentProps<'button'>;

function PaginationLink({ className, isActive, size = 'icon', children, ...props }: PaginationLinkProps) {
    return (
        <button
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                buttonVariants({
                    variant: isActive ? 'outline' : 'ghost',
                    size,
                }),
                isActive ? 'bg-primary-800 text-white rounded-full' : '',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
PaginationLink.displayName = 'PaginationLink';

function PaginationPrevious({ className, ...props }: React.ComponentProps<'button'>) {
    return (
        <PaginationLink
            aria-label="Go to previous page"
            size="default"
            className={cn('gap-1', className)}
            {...props}
        >
            <ChevronLeft className="h-4 w-4"/>
        </PaginationLink>
    );
}
PaginationPrevious.displayName = 'PaginationPrevious';

function PaginationNext({ className, ...props }: React.ComponentProps<'button'>) {
    return (
        <PaginationLink
            aria-label="Go to next page"
            size="default"
            className={cn('gap-1', className)}
            {...props}
        >
            <ChevronRight className="h-4 w-4"/>
        </PaginationLink>
    );
}
PaginationNext.displayName = 'PaginationNext';

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span aria-hidden="true" className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More pages</span>
        </span>
    );
}
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
};
