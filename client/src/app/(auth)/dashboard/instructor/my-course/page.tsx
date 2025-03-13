import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import SortBy from './_components/SortBy';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import Search from '@/components/custom/Search';
import CourseVerticalCard from '@/components/custom/CourseCard';
import { ROLE } from '@/lib/constants';

// Danh sách lựa chọn sắp xếp
const sortOptions = [
    { value: 'date_created', label: 'Date Created' },
    { value: 'oldest', label: 'Oldest' },
    { value: '3_days', label: '3 days' }
];

export default async function Page() {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();

    const [userResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/user/me`, {
            credentials: 'include',
            headers: { Cookie: cookie }
        })
    ]);

    if (!userResponse.ok) {
        throw new Error('Failed to fetch data');
    }

    const { user } = await userResponse.json();

    if (user?.role !== ROLE.instructor) redirect('/');

    // State pagination
    // const [loading] = useState(false);
    // const [currentPage, setCurrentPage] = useState(1);

    // Hàm xử lý khi đổi trang
    // const handlePageChange = (pageNumber: number) => {
    //     setCurrentPage(pageNumber);
    // };

    // Fake dữ liệu khóa học
    const courses = {
        enrolled: [
            { id: 1, title: 'React for Beginners', progress: 70, instructor: 'John Doe', price: 99 },
            { id: 2, title: 'Mastering Tailwind CSS', progress: 85, instructor: 'Alice Smith', price: 49 },
            { id: 3, title: 'Node.js API Development', progress: 40, instructor: 'Michael Brown', price: 79 },
            { id: 4, title: 'Mastering Tailwind CSS', progress: 85, instructor: 'Alice Smith', price: 49 },
            { id: 5, title: 'Mastering Tailwind CSS', progress: 85, instructor: 'Alice Smith', price: 49 },
            { id: 6, title: 'Mastering Tailwind CSS', progress: 85, instructor: 'Alice Smith', price: 49 },
            { id: 7, title: 'Mastering Tailwind CSS', progress: 85, instructor: 'Alice Smith', price: 49 }
        ],
        active: [
            { id: 4, title: 'TypeScript Essentials', progress: 50, instructor: 'Robert Johnson', price: 59 },
            { id: 5, title: 'Next.js with Tailwind', progress: 60, instructor: 'Emily Davis', price: 89 }
        ],
        completed: [{ id: 6, title: 'Full-Stack Web Development', progress: 100, instructor: 'Daniel Lee', price: 129 }]
    };

    // Hàm xác định class `justify-content`
    const getRowClass = (length: number) => (length >= 3 ? 'justify-between' : 'justify-start');

    const renderEnrolledCourses = () => {
        // if (loading) {
        //     return <p className="text-center text-primary-600">Loading...</p>;
        // }

        if (courses?.enrolled.length > 0) {
            return (
                <div className={`row flex flex-wrap gap-9 ${getRowClass(courses.enrolled.length)}`}>
                    {courses.enrolled.map((course) => (
                        <CourseVerticalCard
                            key={course.id}
                            width="280px"
                            height="220px"
                            isProgress={true}
                            progress={course.progress}
                        />
                    ))}
                </div>
            );
        }

        return <p className="text-center text-gray-500">No enrolled courses found.</p>;
    };

    const renderActiveCourses = () => {
        // if (loading) {
        //     return <p className="text-center text-primary-600">Loading...</p>;
        // }

        if (courses?.active.length > 0) {
            return (
                <div className={`row flex flex-wrap gap-9 ${getRowClass(courses.active.length)}`}>
                    {courses.active.map((course) => (
                        <CourseVerticalCard
                            key={course.id}
                            width="280px"
                            height="220px"
                            isProgress={true}
                            progress={course.progress}
                        />
                    ))}
                </div>
            );
        }

        return <p className="text-center text-gray-500">No active courses found.</p>;
    };

    const renderCompletedCourses = () => {
        // if (loading) {
        //     return <p className="text-center text-primary-600">Loading...</p>;
        // }

        if (courses?.completed.length > 0) {
            return (
                <div className={`row flex flex-wrap gap-9 ${getRowClass(courses.completed.length)}`}>
                    {courses.completed.map((course) => (
                        <CourseVerticalCard
                            key={course.id}
                            width="280px"
                            height="220px"
                            isProgress={true}
                            progress={course.progress}
                        />
                    ))}
                </div>
            );
        }

        return <p className="text-center text-gray-500">No completed courses found.</p>;
    };

    return (
        <div className="px-10 py-10 ml-auto max-w-[1000px] border-[1px] border-primary-100 rounded-xl">
            {/* Search & Sort */}
            <div className="flex items-center justify-between gap-5 pb-8">
                <Search />
                <SortBy options={sortOptions} defaultValue="Date Created" />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="enrolled">
                <TabsList>
                    <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
                    <TabsTrigger value="active">Active Courses</TabsTrigger>
                    <TabsTrigger value="completed">Completed Courses</TabsTrigger>
                </TabsList>

                {/* Tab: Enrolled Courses */}
                <TabsContent value="enrolled">{renderEnrolledCourses()}</TabsContent>

                {/* Tab: Active Courses */}
                <TabsContent value="active">{renderActiveCourses()}</TabsContent>

                {/* Tab: Completed Courses */}
                <TabsContent value="completed">{renderCompletedCourses()}</TabsContent>
            </Tabs>
            {/* Pagination */}
            {/* <div className="p-5 mt-10">
                <PaginationComponent currentPage={currentPage} totalPages={10} onPageChange={handlePageChange} />
            </div> */}
        </div>
    );
}
