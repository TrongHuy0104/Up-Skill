'use client';

import { useParams } from 'next/navigation';
import CoursesDetailLine from '@/components/custom/CoursesDetailLine';
import Banner from './_components/Banner';
import CoursesList from './_components/CoursesList';
import InstructorInfo from './_components/InstructorInfo';
import Review from './_components/Review';
import Sidebar from './_components/SideBar';
import { useGetInstructorDetailQuery } from '@/lib/redux/features/user/userApi';
import Spinner from '@/components/custom/Spinner';

export default function Page() {
    const { instructorId } = useParams();
    const { data: userData, isLoading } = useGetInstructorDetailQuery(instructorId);

    if (isLoading) return <Spinner />;

    const { data: user } = userData;

    return (
        <div className="relative">
            <Banner user={user.user} />
            <div className="pt-[61px] flex w-[1428px] mx-auto">
                {/* Content container */}
                <div className="flex max-w-screen-xl w-full px-4">
                    {/* Content section */}
                    <div className="mb-4 w-full md:w-3/4 mr-12">
                        <InstructorInfo user={user.user} />
                        <CoursesDetailLine />
                        {/* Truyền mảng courses vào CoursesList */}
                        <CoursesList user={user.user} />
                        <CoursesDetailLine />
                        <Review />
                    </div>

                    {/* Sidebar with sticky positioning */}
                    <div className="md:w-[300px] md:-mt-[200px] w-full sticky top-5 self-start pb-12">
                        <Sidebar user={user.user} />
                    </div>
                </div>
            </div>
        </div>
    );
}
