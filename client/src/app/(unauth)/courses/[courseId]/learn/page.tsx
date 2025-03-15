import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import CourseContent from './_components/CourseContent';

interface User {
    purchasedCourses: string[];
}

export default async function Page({ params }: any) {
    const { courseId } = params;

    const cookieStore = cookies();
    const cookie = cookieStore.toString();

    try {
        // Fetch user data
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/user/me`, {
            credentials: 'include',
            headers: { Cookie: cookie },
            cache: 'no-store' // Disable caching
        });

        if (!userRes.ok) {
            throw new Error(`Failed to fetch user data: ${userRes.status} ${userRes.statusText}`);
        }

        const { user }: { user: User } = await userRes.json();

        if (!user) {
            throw new Error('User data is undefined');
        }

        // Check if the user has purchased the course
        const hasPurchasedCourse = user.purchasedCourses.includes(courseId);
        if (!hasPurchasedCourse) {
            redirect('/');
        }

        return (
            <div>
                <CourseContent courseId={courseId} user={user} />
            </div>
        );
    } catch (error) {
        console.error('Error in Page component:', error);
        return <div>Error loading course data. Please try again.</div>;
    }
}
