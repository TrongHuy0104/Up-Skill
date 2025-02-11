import { Suspense } from 'react';
import ProfileInfo from '@/components/instructor-dashboard/ProfileInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { DashboardBannerSkeleton } from '@/components/ui/Skeleton';
import UpdatePasswordForm from '@/components/instructor-dashboard/UpdatePasswordForm';

export default function page() {
    return (
        <>
            <div className="pt-8 px-10 pb-10 ml-auto max-w-[1000px] border border-primary-100 rounded-xl">
                <Suspense fallback={<DashboardBannerSkeleton />}>
                    <Tabs defaultValue="profile">
                        <TabsList>
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile">
                            <ProfileInfo />
                        </TabsContent>
                        <TabsContent value="password">
                            <UpdatePasswordForm />
                        </TabsContent>
                    </Tabs>
                </Suspense>
            </div>
        </>
    );
}
