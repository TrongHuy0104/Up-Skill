import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import ProfileInfo from './_components/ProfileInfo';
import UpdatePasswordForm from './_components/UpdatePasswordForm';
import UpdateSocial from './_components/UpdateSocial';

export default function page() {
    return (
        <div className="pt-8 px-10 pb-10 ml-auto max-w-[1000px] border border-primary-100 rounded-xl">
            <Suspense fallback={<DashboardSkeleton />}>
                <Tabs defaultValue="profile">
                    <TabsList>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                        <TabsTrigger value="social">Social</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile">
                        <ProfileInfo />
                    </TabsContent>
                    <TabsContent value="password">
                        <UpdatePasswordForm />
                    </TabsContent>
                    <TabsContent value="social">
                        <UpdateSocial />
                    </TabsContent>
                </Tabs>
            </Suspense>
        </div>
    );
}
