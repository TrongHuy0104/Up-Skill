import React from 'react';

import CoursesDetailLine from '@/components/custom/CoursesDetailLine';
import CoursesContent from '@/components/custom/CourseContent';
import Instructor from './_components/Instructor';
import CoursesList from './_components/CoursesList';
import Review from './_components/Review';
import CoursesDetailBanner from './_components/Banner';
import CoursesDetailInfo from './_components/CoursesDetailInfo';
import CourseSidebar from './_components/CourseSidebar';

export default async function Page({ params }: any) {
    const { courseId } = params;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/${courseId}`, {
            credentials: 'include'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch course data');
        }

        const { course } = await res.json();

        const renderSection = (component: React.ReactNode) => (
            <>
                {component}
                <CoursesDetailLine />
            </>
        );

        return (
            <div className="container mx-auto px-4 flex flex-col md:flex-row gap-24 py-10">
                <div className="left-content ml-7">
                    {renderSection(<CoursesDetailBanner course={course} />)}
                    {renderSection(
                        <CoursesDetailInfo
                            benefits={course.benefits}
                            prerequisites={course.prerequisites}
                            description={course.description}
                        />
                    )}
                    {renderSection(<CoursesContent data={course?.courseData} />)}
                    {renderSection(<Instructor instructor={course.authorId} />)}
                    {renderSection(<CoursesList course={course} />)}
                    {renderSection(<Review />)}
                </div>
                <div className="right-content w-full lg:w-1/3">
                    <div className="sticky top-[20px]">
                        <CourseSidebar course={course} />
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error(error);
        return <div>Error loading course data. Please try again later.</div>;
    }
}
