'use client';

import React, { useState } from 'react';
import CourseContentMedia from './CourseContentMedia';
import CourseContentList from './CourseContentList';

export default function CourseContent({ course, user }: any) {
    const [activeVideo, setActiveVideo] = useState(0);
    return (
        <>
            <h2 className="w-[70%] text-xl font-semibold md:w-[93%] m-auto mt-5">{course?.name}</h2>
            <div className="w-full grid md:grid-cols-10 text-primary-800">
                <div className="col-span-7">
                    <CourseContentMedia
                        course={course}
                        activeVideo={activeVideo}
                        setActiveVideo={setActiveVideo}
                        user={user}
                    />
                </div>
                <div className="hidden md:block md:col-span-3 ml-[-30px]">
                    <CourseContentList
                        data={course?.courseData}
                        activeVideo={activeVideo}
                        setActiveVideo={setActiveVideo}
                    />
                </div>
            </div>
        </>
    );
}
