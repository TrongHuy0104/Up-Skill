import ProfileInfo from '@/components/dashboard/ProfileInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export default function page() {
    return (
        <div className="pt-8 px-10 pb-10 ml-auto max-w-[1000px] border border-primary-100 rounded-xl">
            <Tabs defaultValue="profile">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <ProfileInfo />
                </TabsContent>
                <TabsContent value="password">Change your password here.</TabsContent>
            </Tabs>
        </div>
    );
}
