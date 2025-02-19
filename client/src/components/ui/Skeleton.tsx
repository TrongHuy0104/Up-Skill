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
