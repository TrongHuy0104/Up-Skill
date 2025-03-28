'use client';

import React from 'react';
import UserAnalyticsChart from './_components/UserAnalyticsChart';
import CountUserChart from './_components/CountUserChart';
import CountInstructorChart from './_components/CountInstructorChart';
import CourseChart from './_components/CourseChart';
import CountStudentChart from './_components/CountStudentChart';
import RevenueChart from './_components/RevenueChart';
import { useGetUserAnalysisQuery } from '@/lib/redux/features/user/userApi';
import Spinner from '@/components/custom/Spinner';

export default function Page() {
    const { data: res, isLoading } = useGetUserAnalysisQuery({});

    if (isLoading) return <Spinner />;

    const {
        totalUser,
        totalInstructor,
        totalStudent,
        totalCourse,
        growthRates, // Lấy dữ liệu growthRates từ API
        data
    } = res;

    return (
        <div>
            <div className="flex gap-4">
                <CountStudentChart totalStudent={totalStudent} growthRate={parseFloat(growthRates.studentGrowthRate)} />
                <CountInstructorChart
                    totalInstructor={totalInstructor}
                    growthRate={parseFloat(growthRates.instructorGrowthRate)}
                />
                <CountUserChart totalUser={totalUser} growthRate={parseFloat(growthRates.userGrowthRate)} />
                <CourseChart totalCourse={totalCourse} growthRate={parseFloat(growthRates.courseGrowthRate)} />
            </div>
            <div className="mt-4">
                <UserAnalyticsChart data={data} />
            </div>
            <div className="mt-4">
                <RevenueChart data={data} />
            </div>
        </div>
    );
}
