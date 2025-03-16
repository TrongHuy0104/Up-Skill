import InstructorSidebar from '@/components/custom/InstructorSideBar';
import { User } from '@/types/User';
interface Props {
    readonly user: User;
}

export default async function Sidebar({ user }: Props) {
    return (
        <InstructorSidebar
            avatar={user?.avatar?.url || '/assets/images/courses/courses-03.jpg'}
            address={user.address}
            email={user.email}
            phoneNumber={user.phoneNumber}
            socialLinks={user.socialLinks}
        />
    );
}
