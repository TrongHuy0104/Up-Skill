import React, { ReactNode, Suspense } from 'react';
import InstructorDashboardBanner from '@/app/(auth)/dashboard/_components/Banner';
import DashboardNavigationBar from '@/app/(auth)/dashboard/_components/DashboardNavigationBar';
import { DashboardNavigationSkeleton, DashboardSkeleton } from '@/components/ui/Skeleton';

export default async function ProfileLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Suspense fallback={<DashboardSkeleton />}>
                <InstructorDashboardBanner />
            </Suspense>
            <div className="pt-[60px] pb-[160px]">
                <div className="relative mx-auto px-[14px] w-[1428px] max-w-full">
                    <div className="-mx-[14px] flex flex-wrap -mt-0 -mr-[0.75rem] -ml-[0.75rem]">
                        <div className="px-[14px] xl:w-1/4 w-full flex-none">
                            <Suspense fallback={<DashboardNavigationSkeleton />}>
                                <DashboardNavigationBar />
                            </Suspense>
                        </div>
                        <div className="px-[14px] xl:w-3/4 w-full flex-none">{children}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
