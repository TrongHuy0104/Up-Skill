import CoursesDetailLine from '@/components/custom/CoursesDetailLine';
import Banner from './_components/Banner';
import CoursesList from './_components/CoursesList';
import InstructorInfo from './_components/InstructorInfo';
import Review from './_components/Review';
import Sidebar from './_components/SideBar';
import { cookies } from 'next/headers';

export default async function page() {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();

    // Gửi request lấy thông tin user
    const res = await fetch(`http://localhost:8000/api/user/me`, {
        credentials: 'include',
        headers: {
            Cookie: cookie // Pass the cookies in the headers
        }
    });

    const { user } = await res.json();
    console.log('user:', user);

    return (
        <div className="relative">
            <Banner user={user} />
            <div className="pt-[61px] flex w-[1428px] mx-auto">
                {/* Content container */}
                <div className="flex max-w-screen-xl w-full px-4">
                    {/* Content section */}
                    <div className="mb-4 w-full md:w-3/4">
                        <InstructorInfo user={user} />
                        <CoursesDetailLine />
                        {/* Truyền mảng courses vào CoursesList */}
                        <CoursesList />
                        <CoursesDetailLine />
                        <Review />
                    </div>

                    {/* Sidebar with sticky positioning */}
                    <div className="md:w-[300px] md:-mt-[200px] w-full sticky top-5 self-start pb-12">
                        <Sidebar user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
}
