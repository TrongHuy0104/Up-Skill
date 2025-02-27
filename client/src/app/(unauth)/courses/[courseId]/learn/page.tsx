import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import CourseContent from './_components/CourseContent';

export default async function Page({ params }: any) {
    const { courseId } = await params;

    console.log('Fetching user data...');
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();

    try {
        // Fetch user data
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/user/me`, {
            credentials: 'include',
            headers: {
                Cookie: cookie
            },
            cache: 'no-store' // Disable caching
        });

        if (!userRes.ok) {
            throw new Error(`Failed to fetch user data: ${userRes.status} ${userRes.statusText}`);
        }

        const userData = await userRes.json();
        const { user } = userData;

        if (!user) {
            throw new Error('User data is undefined');
        }

        // Check if the user has purchased the course
        const hasPurchasedCourse = user.purchasedCourses.includes(courseId);
        if (!hasPurchasedCourse) {
            redirect('/');
        }

        // Fetch course data
        const courseRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/purchased/${courseId}`, {
            credentials: 'include',
            headers: {
                Cookie: cookie
            },
            cache: 'no-store' // Disable caching
        });

        if (!courseRes.ok) {
            throw new Error(`Failed to fetch course data: ${courseRes} ${courseRes.statusText}`);
        }

        const courseData = await courseRes.json();
        const { course } = courseData;

        if (!course) {
            throw new Error('Course data is undefined');
        }

        return (
            <div>
                <CourseContent course={course} courseId={courseId} user={user} />
            </div>
        );
    } catch (error) {
        console.error('Error in Page component:', error);
        return <div>Error loading course data. Please try again.</div>;
    }
}
