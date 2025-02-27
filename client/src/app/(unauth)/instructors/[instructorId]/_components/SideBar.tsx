import InstructorSidebar from '@/components/custom/InstructorSideBar';
import { User } from '@/types/User';
interface Props {
    readonly user: User;
}

export default async function Sidebar({ user }: Props) {
    console.log('socialLinks', user.socialLinks);

    return (
        <InstructorSidebar
            address={user.address}
            email={user.email}
            phoneNumber={user.phoneNumber}
            socialLinks={user.socialLinks}
        />
    );
}
