// app/dashboard/DashboardClient.tsx (Client Component)
'use client';

import React from 'react';
import Image from 'next/image';
import MyCourses from './MyCourses';

interface Stats {
    totalCourses: number;
    publishedCourses: number;
    pendingCourses: number;
    totalStudent: number;
    studentCompleted: number;
    studentInprogress: number;
    courseEnrolled: number;
    courseActive: number;
    courseCompleted: number;
}

interface DashboardClientProps {
    stats: Stats;
}

const DashboardClient = ({ stats }: DashboardClientProps) => {
    const statsConfig = [
        { title: 'Enrolled Courses', value: stats.courseEnrolled, icon: '/assets/icons/play-content.svg' },
        { title: 'Active Courses', value: 0, icon: '/assets/icons/check-icon.svg' },
        { title: 'Completed Courses', value: 0, icon: '/assets/icons/certificate.svg' }
    ];

    return (
        <div className="container mx-auto pl-10">
            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {statsConfig.map((stat) => (
                    <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
                ))}
            </div>
            <MyCourses />
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
