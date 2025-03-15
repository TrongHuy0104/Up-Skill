'use client';

import React, { useState } from 'react';
import CourseContentMedia from './CourseContentMedia';
import CourseContentList from './CourseContentList';
import { useGetCourseContentQuery } from '@/lib/redux/features/course/courseApi';
import Spinner from '@/components/custom/Spinner';
import { useGetProgressDataQuery } from '@/lib/redux/features/progress/progressApi';

interface CourseContentProps {
    courseId: string;
    user: any; // Replace `any` with a proper user type if available
}

export default function CourseContent({ courseId, user }: CourseContentProps) {
    const [activeVideo, setActiveVideo] = useState(0);

    // Fetch course content
    const {
        data: courseContent,
        isLoading: isCourseLoading,
        refetch: refetchCourseContent
    } = useGetCourseContentQuery(courseId, { refetchOnMountOrArgChange: true });

    // Fetch progress data
    const { data: progressData, refetch: refetchProgress } = useGetProgressDataQuery(courseId);

    if (isCourseLoading) {
        return <Spinner />;
    }

    if (!courseContent?.course) {
        return <div>No course data found.</div>;
    }

    return (
        <>
            <h2 className="w-[70%] text-xl font-semibold md:w-[93%] m-auto mt-5">{courseContent.course.name}</h2>
            <div className="w-full grid md:grid-cols-10 text-primary-800">
                {/* Course Media Section */}
                <div className="col-span-7">
                    <CourseContentMedia
                        progressData={progressData?.data}
                        course={courseContent.course}
                        activeVideo={activeVideo}
                        setActiveVideo={setActiveVideo}
                        user={user}
                        refetch={refetchCourseContent}
                        reload={refetchProgress}
                    />
                </div>

                {/* Course Content List Section */}
                <div className="hidden md:block md:col-span-3 ml-[-30px]">
                    <CourseContentList
                        progressData={progressData?.data}
                        data={courseContent.course.courseData}
                        activeVideo={activeVideo}
                        setActiveVideo={setActiveVideo}
                        refetch={refetchProgress}
                    />
                </div>
            </div>
        </>
    );
}
