import React, { ReactNode, Suspense } from 'react';
import InstructorDashboardBanner from '@/components/instructor-dashboard/Banner';
import DashboardNavigationBar from '@/components/instructor-dashboard/DashboardNavigationBar';
import { DashboardBannerSkeleton } from '@/components/ui/Skeleton';

export default async function ProfileLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Suspense fallback={<DashboardBannerSkeleton />}>
                <InstructorDashboardBanner />
            </Suspense>
            <div className="pt-[60px] pb-[160px]">
                <div className="relative mx-auto px-[14px] w-[1428px] max-w-full">
                    <div className="-mx-[14px] flex flex-wrap -mt-0 -mr-[0.75rem] -ml-[0.75rem]">
                        <div className="px-[14px] xl:w-1/4 w-full flex-none">
                            <DashboardNavigationBar />
                        </div>
                        <div className="px-[14px] xl:w-3/4 w-full flex-none">{children}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
