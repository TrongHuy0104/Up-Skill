import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('animate-pulse rounded-md bg-primary/10', className)} {...props} />;
}

export { Skeleton };

export function DashboardSkeleton() {
    return <Skeleton className="h-[288px] w-full" />;
}

export function AuthBtnsSkeleton() {
    return (
        <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-[84px] rounded" />
            <Skeleton className="h-10 w-[84px] rounded" />
        </div>
    );
}

export const VerticalCardSkeleton = () => {
    return (
        <div className="space-y-2 px-2">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="flex gap-4">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
            </div>
            <Skeleton className="h-6 w-1/2 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
            <div className="flex justify-between">
                <Skeleton className="h-6 w-16 rounded" />
                <Skeleton className="h-6 w-24 rounded" />
            </div>
        </div>
    );
};

export function HorizontalCardSkeleton() {
    return (
        <div className="w-full flex pb-5 px-6 mb-5 border-b gap-5 border-primary-100">
            <Skeleton className="h-[240px] w-[320px] shrink-0 rounded-md" />
            <div className="flex flex-col gap-6 w-full">
                <Skeleton className="h-6 w-1/2 rounded-md" />
                <Skeleton className="h-6 w-full rounded" />
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-6 w-1/4 rounded" />
                <Skeleton className="h-6 w-1/5 rounded" />
            </div>
        </div>
    );
}
export function CourseSidebarSkeleton() {
    return (
        <div className="flex flex-col p-6">
            <Skeleton className="h-6 w-full shrink-0 rounded" />
            <Skeleton className="h-10 w-full shrink-0 rounded mt-4" />
            <Skeleton className="h-3 w-3/4 mx-auto shrink-0 rounded-full mt-2" />
            <Skeleton className="h-6 w-3/4 shrink-0 rounded mt-4" />
            <Skeleton className="h-4 w-1/2 shrink-0 rounded mt-2" />
            <Skeleton className="h-4 w-1/4 shrink-0 rounded mt-2" />
            <Skeleton className="h-4 w-1/2 shrink-0 rounded mt-2" />
            <Skeleton className="h-4 w-1/2 shrink-0 rounded mt-2" />
            <Skeleton className="h-8 w-full shrink-0 border-t border-primary-100 rounded mt-8" />
        </div>
    );
}
