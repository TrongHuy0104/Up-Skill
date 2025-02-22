import React from 'react';
import { cookies } from 'next/headers';

import CoursesDetailLine from '@/components/custom/CoursesDetailLine';
import CoursesContent from '@/components/custom/CourseContent';
import Instructor from './_components/Instructor';
import CoursesList from './_components/CoursesList';
import Review from './_components/Review';
import CoursesDetailBanner from './_components/Banner';
import CoursesDetailInfo from './_components/CoursesDetailInfo';
import CourseSidebar from './_components/CourseSidebar';

export default async function page({ params }: any) {
    const { courseId } = await params;
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();

    const res = await fetch(`http://localhost:8000/api/courses/${courseId}`, {
        credentials: 'include',
        headers: {
            Cookie: cookie // Pass the cookies in the headers
        }
    });

    const { course } = await res.json();

    return (
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-24 py-10">
            <div className="left-content ml-7">
                <CoursesDetailBanner course={course} />
                <CoursesDetailLine />

                <CoursesDetailInfo
                    benefits={course.benefits}
                    prerequisites={course.prerequisites}
                    description={course.description}
                />
                <CoursesDetailLine />

                <CoursesContent data={course?.courseData} />
                <CoursesDetailLine />

                <Instructor instructor={course.authorId} />
                <CoursesDetailLine />

                <CoursesList course={course} />
                <CoursesDetailLine />

                <Review />
            </div>
            <div className="right-content w-full md:w-1/3 ">
                <div className="sticky top-0">
                    <CourseSidebar course={course} />
                </div>
            </div>
        </div>
    );
}
