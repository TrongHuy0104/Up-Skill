'use client';

import React, { useState } from 'react';
import CourseContentMedia from './CourseContentMedia';
import CourseContentList from './CourseContentList';
import { useGetCourseContentQuery } from '@/lib/redux/features/course/courseApi';
import Spinner from '@/components/custom/Spinner';
import { useGetProgressDataQuery } from '@/lib/redux/features/progress/progressApi';

export default function CourseContent({ courseId, user }: any) {
    const { data, isLoading, refetch } = useGetCourseContentQuery(courseId, { refetchOnMountOrArgChange: true });
    const { data: progressData, refetch: reload } = useGetProgressDataQuery(courseId);
    const [activeVideo, setActiveVideo] = useState(0);

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <h2 className="w-[70%] text-xl font-semibold md:w-[93%] m-auto mt-5">{data?.course?.name}</h2>
                    <div className="w-full grid md:grid-cols-10 text-primary-800">
                        <div className="col-span-7">
                            <CourseContentMedia
                                progressData={progressData?.data}
                                course={data?.course}
                                activeVideo={activeVideo}
                                setActiveVideo={setActiveVideo}
                                user={user}
                                refetch={refetch}
                                reload={reload}
                            />
                        </div>
                        <div className="hidden md:block md:col-span-3 ml-[-30px]">
                            <CourseContentList
                                progressData={progressData?.data}
                                data={data?.course?.courseData}
                                activeVideo={activeVideo}
                                setActiveVideo={setActiveVideo}
                                refetch={reload}
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
