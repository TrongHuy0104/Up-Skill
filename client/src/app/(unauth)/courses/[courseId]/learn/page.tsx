import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import CourseContent from './_components/CourseContent';

export default async function page({ params }: any) {
    const { courseId } = await params;

    const cookieStore = await cookies();
    const cookie = cookieStore.toString();

    const userRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/user/me`, {
        credentials: 'include',
        headers: {
            Cookie: cookie // Pass the cookies in the headers
        }
    });

    const { user } = await userRes.json();

    const hasPurchasedCourse = () => {
        return user ? user.purchasedCourses.includes(courseId) : false;
    };

    if (!hasPurchasedCourse()) redirect('/');

    const courseRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/purchased/${courseId}`, {
        credentials: 'include',
        headers: {
            Cookie: cookie // Pass the cookies in the headers
        }
    });

    const { content } = await courseRes.json();
    console.log(content);

    return (
        <div>
            <CourseContent content={content} courseId={courseId} />
        </div>
    );
}
