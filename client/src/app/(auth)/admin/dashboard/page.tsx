import React from 'react';
import UserAnalyticsChart from './_components/UserAnalyticsChart';
import CountUserChart from './_components/CountUserChart';
import CountInstructorChart from './_components/CountInstructorChart';
import CourseChart from './_components/CourseChart';
import { cookies } from 'next/headers';
import CountStudentChart from './_components/CountStudentChart';
import RevenueChart from './_components/RevenueChart';

export default async function page() {
        const cookieStore = await cookies();
        const cookie = cookieStore.toString();
    
        const res = await fetch(`http://localhost:8000/api/user/user-analysis`, {
            credentials: 'include',
            headers: {
                Cookie: cookie
            }
        });
    
        const { totalUser, totalInstructor,totalStudent, totalCourse, data } = await res.json();
    return (
        <div>
            <div className='flex gap-2'>
                <CountStudentChart totalStudent={totalStudent}/>
                <CountInstructorChart totalInstructor={totalInstructor}/>
                <CountUserChart totalUser={totalUser}/>
                <CourseChart totalCourse={totalCourse}/>
            </div>
            <div className="mt-2">
                <UserAnalyticsChart data={data}/>
            </div>
            <div className="mt-2">
                <RevenueChart />
            </div>
        </div>
    );
}
