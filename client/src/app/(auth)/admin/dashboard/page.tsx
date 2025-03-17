import React from 'react';
import UserAnalyticsChart from './_components/UserAnalyticsChart';
import CountUserChart from './_components/CountUserChart';
import CountInstructorChart from './_components/CountInstructorChart';
import CourseChart from './_components/CourseChart';
import { cookies } from 'next/headers';
import CountStudentChart from './_components/CountStudentChart';
import RevenueChart from './_components/RevenueChart';

export default async function Page() {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/user/user-analysis`, {
        credentials: 'include',
        headers: {
            Cookie: cookie
        }
    });

    const { 
        totalUser, 
        totalInstructor, 
        totalStudent, 
        totalCourse, 
        growthRates,  // Lấy dữ liệu growthRates từ API
        data 
    } = await res.json();

    return (
        <div>
            <div className='flex gap-4'>
                <CountStudentChart totalStudent={totalStudent} growthRate={parseFloat(growthRates.studentGrowthRate)} />
                <CountInstructorChart totalInstructor={totalInstructor} growthRate={parseFloat(growthRates.instructorGrowthRate)} />
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
