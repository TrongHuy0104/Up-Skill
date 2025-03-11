import React from 'react';
import UserAnalyticsChart from './_components/UserAnalyticsChart';
import CountUserChart from './_components/CountUserChart';
import CountInstructorChart from './_components/CountInstructorChart';
import CourseChart from './_components/CourseChart';

function page() {
    return (
        <div>
            <div className='flex gap-6'>
                <CountUserChart />
                <CountInstructorChart />
                <CourseChart />
            </div>
            <div className="mt-6">
                <UserAnalyticsChart />
            </div>
        </div>
    );
}

export default page;
