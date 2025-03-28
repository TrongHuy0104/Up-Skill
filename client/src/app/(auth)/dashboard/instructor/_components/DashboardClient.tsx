'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/Badge';
import PaginationComponent from '@/components/custom/PaginationComponent';
import IncomeChart from '../../_components/IncomeChart';
import { useGetCourseStatsQuery } from '@/lib/redux/features/course/courseApi';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';
import { DashboardSkeleton } from '@/components/ui/Skeleton';

type CourseStats = {
    totalCourses: number;
    publishedCourses: number;
    pendingCourses: number;
    totalStudent: number;
    studentCompleted: number;
    studentInprogress: number;
    courseEnrolled: number;
    activeCourses: number;
    completedCourses: number;
};

const STATS_CONFIG: Array<{
    title: string;
    key: keyof CourseStats; // This ensures key must be a property of CourseStats
    icon: string;
}> = [
    { title: 'Total Courses', key: 'totalCourses', icon: '/assets/icons/total-course.svg' },
    { title: 'Published Courses', key: 'publishedCourses', icon: '/assets/icons/published-course.svg' },
    { title: 'Pending Courses', key: 'pendingCourses', icon: '/assets/icons/pending-course.svg' },
    { title: 'Total Students', key: 'totalStudent', icon: '/assets/icons/student-total.svg' },
    { title: 'Students Completed', key: 'studentCompleted', icon: '/assets/icons/student-completed.svg' },
    { title: 'Students In-progress', key: 'studentInprogress', icon: '/assets/icons/student-inprogress.svg' },
    { title: 'Enrolled Courses', key: 'courseEnrolled', icon: '/assets/icons/play-content.svg' },
    { title: 'Active Courses', key: 'activeCourses', icon: '/assets/icons/check-icon.svg' },
    { title: 'Completed Courses', key: 'completedCourses', icon: '/assets/icons/certificate.svg' }
];

const PAGE_SIZE = 4;

const DashboardClient = () => {
    const { data: statsData, isLoading: isLoadingStats } = useGetCourseStatsQuery(undefined);
    const { data: userData, isLoading: isLoadingUser } = useLoadUserQuery(undefined);
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);

    const isLoading = isLoadingStats || isLoadingUser;

    const { courseStats, bestSellingCourses, totalPages } = useMemo(() => {
        if (isLoading) return { courseStats: null, bestSellingCourses: [], totalPages: 1 };

        const { user } = userData;
        const { purchasedCourses, uploadedCourses } = statsData;

        const publishedCourses = uploadedCourses.filter((course: any) => course.isPublished);
        const totalStudent = publishedCourses.reduce((sum: number, course: any) => sum + (course.purchased || 0), 0);

        const stats: CourseStats = {
            totalCourses: uploadedCourses.length,
            publishedCourses: publishedCourses.length,
            pendingCourses: uploadedCourses.length - publishedCourses.length,
            totalStudent,
            studentCompleted: 0,
            studentInprogress: totalStudent - 0,
            courseEnrolled: user.courseEnrolled || purchasedCourses.length,
            activeCourses: 0,
            completedCourses: 0
        };

        return {
            courseStats: stats,
            bestSellingCourses: uploadedCourses,
            totalPages: Math.max(1, Math.ceil(uploadedCourses.length / PAGE_SIZE))
        };
    }, [statsData, userData, isLoading]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    if (userData?.user && userData.user.role !== 'instructor') {
        redirect('/');
    }

    if (isLoading) return <DashboardSkeleton />;

    return (
        <div className="container mx-auto pl-10">
            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {STATS_CONFIG.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={courseStats?.[stat.key] || 0}
                        icon={stat.icon}
                    />
                ))}
            </div>

            {/* Income Chart */}
            <div className="container bg-primary-50 rounded-lg p-[34px] border border-primary-100 mb-8">
                <h1 className="text-[22px] text-primary-800 font-medium">Total Income</h1>
                {userData?.user && <IncomeChart userId={userData.user._id} />}
            </div>

            {/* Best Selling Courses Section */}
            <div className="bg-primary-50 rounded-lg p-[34px] border border-primary-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[22px] text-primary-800 font-medium">Best Selling Courses</h2>
                </div>

                <CourseTable
                    courses={bestSellingCourses.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)}
                    router={router}
                />

                {/* Pagination */}
                <div className="flex justify-center my-8">
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};

// Extracted Stat Card Component
const StatCard = ({ title, value, icon }: { title: string; value: number; icon: string }) => (
    <div className="whitespace-nowrap w-[320px] h-[150px] bg-primary-50 rounded-lg p-9 flex items-center space-x-6 border border-primary-100">
        <div className="bg-accent-100 p-5 rounded-full">
            <Image src={icon} alt={title} width={30} height={30} unoptimized />
        </div>
        <div>
            <p className="text-primary-800 text-base">{title}</p>
            <p className="text-[26px] text-accent-900 font-semibold">{value}</p>
        </div>
    </div>
);

// Extracted Course Table Component
const CourseTable = ({ courses, router }: { courses: any[]; router: any }) => (
    <div className="overflow-x-auto">
        <table className="w-full">
            <thead>
                <tr className="text-left text-[15px] text-primary-800 bg-accent-100">
                    <th className="px-[30px] py-[26px] rounded-l-lg font-medium">Course Name</th>
                    <th className="py-[26px] font-medium px-8">Sales</th>
                    <th className="py-[26px] font-medium pl-10 pr-6">Amount</th>
                    <th className="py-[26px] font-medium px-12 text-center">Status</th>
                    <th className="py-[26px] font-medium rounded-r-lg pr-8 text-right">Action</th>
                </tr>
            </thead>
            <tbody>
                {courses.map((course) => (
                    <CourseRow key={course._id} course={course} router={router} />
                ))}
            </tbody>
        </table>
    </div>
);

// Extracted Course Row Component
const CourseRow = ({ course, router }: { course: any; router: any }) => (
    <tr className="border-b border-primary-100">
        <td className="py-5 pl-6">
            <div className="flex items-center">
                <div className="relative">
                    <Image
                        src={course.thumbnail?.url || '/assets/images/courses/courses-01.jpg'}
                        alt={course.name}
                        width={100}
                        height={80}
                        className="w-[100px] h-[80px] object-contain"
                    />
                </div>
                <span className="truncate w-[400px] text-[15px] text-primary-800 font-medium pl-[30px]">
                    {course.name}
                </span>
            </div>
        </td>
        <td className="text-[15px] text-primary-800 font-medium pl-8">{course.purchased}</td>
        <td className="text-[15px] text-primary-800 font-medium pl-10">
            ${course.price ? course.price.toLocaleString() : 'N/A'}
        </td>
        <td className="text-[15px] text-primary-800 font-medium pl-10">
            <Badge className={`bg-slate-500 ${course.isPublished && 'bg-accent-600 text-primary-50'}`}>
                {course.isPublished ? 'Published' : 'Draft'}
            </Badge>
        </td>
        <td className="py-4 pl-6">
            <div className="flex items-center space-x-3">
                <ActionButton
                    onClick={() => router.push(`/dashboard/instructor/courses/${course._id}`)}
                    icon="/assets/icons/edit.svg"
                    alt="Edit"
                />
                <ActionButton onClick={() => {}} icon="/assets/icons/delete.svg" alt="Delete" />
            </div>
        </td>
    </tr>
);

// Extracted Action Button Component
const ActionButton = ({ onClick, icon, alt }: { onClick: () => void; icon: string; alt: string }) => (
    <button
        onClick={onClick}
        className="p-2 rounded-xl group border border-primary-100 bg-accent-100 hover:bg-primary-800 transition-colors duration-200"
    >
        <div className="relative w-4 h-4">
            <Image
                src={icon}
                alt={alt}
                fill
                className="group-hover:brightness-0 group-hover:invert transition-all duration-200"
            />
        </div>
    </button>
);

export default DashboardClient;
