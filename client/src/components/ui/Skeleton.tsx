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

export const CourseVerticalSkeleton = () => {
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