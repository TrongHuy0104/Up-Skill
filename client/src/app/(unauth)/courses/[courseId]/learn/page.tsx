import React from 'react';
import CourseContent from './_components/CourseContent';

export default async function Page({ params }: any) {
    const { courseId } = params;

    return (
        <div>
            <CourseContent courseId={courseId} />
        </div>
    );
}
