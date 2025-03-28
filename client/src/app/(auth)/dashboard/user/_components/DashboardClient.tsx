'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useGetCourseStatsQuery } from '@/lib/redux/features/course/courseApi';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';
import ClientCourseTabs from '../../instructor/my-course/_components/ClientCourseTabs ';

interface Stats {
    totalCourses: number;
    publishedCourses: number;
    pendingCourses: number;
    totalStudent: number;
    studentCompleted: number;
    studentInprogress: number;
    courseEnrolled: number;
    activeCourses: number;
    completedCourses: number;
}

interface Course {
    isPublished: boolean;
    purchased?: number;
}

const DashboardClient = () => {
    const { data: statsData, isLoading: isLoadingStats } = useGetCourseStatsQuery(undefined);
    const { data: userData, isLoading: isLoadingUser } = useLoadUserQuery(undefined);

    const isLoading = isLoadingStats || isLoadingUser;

    const { courseStats } = useMemo(() => {
        if (isLoading || !statsData || !userData) {
            return {
                courseStats: null
            };
        }

        const { user } = userData;
        const { purchasedCourses = [], uploadedCourses = [] } = statsData;

        const publishedCourses = uploadedCourses.filter((course: Course) => course.isPublished);
        const totalStudent = publishedCourses.reduce((sum: number, course: Course) => sum + (course.purchased || 0), 0);

        const stats: Stats = {
            totalCourses: uploadedCourses.length,
            publishedCourses: publishedCourses.length,
            pendingCourses: uploadedCourses.length - publishedCourses.length,
            totalStudent,
            studentCompleted: 0,
            studentInprogress: totalStudent,
            courseEnrolled: user?.courseEnrolled ?? purchasedCourses.length,
            activeCourses: 0,
            completedCourses: 0
        };

        return {
            courseStats: stats,
            bestSellingCourses: uploadedCourses
        };
    }, [statsData, userData, isLoading]);

    const statsConfig = [
        { title: 'Enrolled Courses', value: courseStats?.courseEnrolled ?? 0, icon: '/assets/icons/play-content.svg' },
        { title: 'Active Courses', value: courseStats?.activeCourses ?? 0, icon: '/assets/icons/check-icon.svg' },
        { title: 'Completed Courses', value: courseStats?.completedCourses ?? 0, icon: '/assets/icons/certificate.svg' }
    ];

    return (
        <div className="container mx-auto pl-10">
            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {statsConfig.map((stat) => (
                    <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
                ))}
            </div>
            <ClientCourseTabs />
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: number;
    icon: string;
}

const StatCard = ({ title, value, icon }: StatCardProps) => (
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

export default DashboardClient;
