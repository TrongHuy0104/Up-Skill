import React from 'react';
import UserAnalyticsChart from './_components/UserAnalyticsChart';
import CountUserChart from './_components/CountUserChart';
import CountInstructorChart from './_components/CountInstructorChart';
import CourseChart from './_components/CourseChart';
import { cookies } from 'next/headers';

export default async function page() {
        const cookieStore = await cookies();
        const cookie = cookieStore.toString();
    
        const res = await fetch(`http://localhost:8000/api/user/user-analysis`, {
            credentials: 'include',
            headers: {
                Cookie: cookie
            }
        });
    
        const { totalUser, totalInstructor, totalCourse, data } = await res.json();
    return (
        <div>
            <div className='flex gap-6'>
                <CountUserChart totalUser={totalUser}/>
                <CountInstructorChart totalInstructor={totalInstructor}/>
                <CourseChart totalCourse={totalCourse}/>
            </div>
            <div className="mt-6">
                <UserAnalyticsChart data={data}/>
            </div>
        </div>
    );
}
