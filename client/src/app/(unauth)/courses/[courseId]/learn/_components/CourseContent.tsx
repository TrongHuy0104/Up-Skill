'use client';

import React, { useState } from 'react';
import { redirect } from 'next/navigation';

import CourseContentMedia from './CourseContentMedia';
import CourseContentList from './CourseContentList';
import { useGetCourseContentQuery } from '@/lib/redux/features/course/courseApi';
import Spinner from '@/components/custom/Spinner';
import { useGetProgressDataQuery } from '@/lib/redux/features/progress/progressApi';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';

interface CourseContentProps {
    courseId: string;
}

export default function CourseContent({ courseId }: CourseContentProps) {
    const {
        data,
        isLoading: isLoadingCourseContent,
        refetch
    } = useGetCourseContentQuery(courseId, { refetchOnMountOrArgChange: true });
    const { data: progressData, isLoading: isLoadingProgress, refetch: reload } = useGetProgressDataQuery(courseId);
    // Fetch user data
    const { data: userData, isLoading: isLoadingUser } = useLoadUserQuery(undefined);
    const [activeVideo, setActiveVideo] = useState<{ sectionOrder: number; index: number }>({
        sectionOrder: 1,
        index: 0
    });

    const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
    const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

    const handleQuizClick = (quizId: string | null, questions: any[]) => {
        setSelectedQuizId(quizId);
        setQuizQuestions(questions);
    };

    // Handle loading states
    if (isLoadingUser || isLoadingCourseContent || isLoadingProgress) {
        return <Spinner />;
    }

    // Check if the user has purchased the course
    const hasPurchasedCourse = userData?.user?.purchasedCourses?.includes(courseId);
    if (!hasPurchasedCourse) {
        redirect('/');
    }

    // Handle case where no course data is found
    if (!data?.course) {
        return <div>No course data found.</div>;
    }

    return (
        <>
            <h2 className="w-[70%] text-xl font-semibold md:w-[93%] m-auto mt-5">{data?.course?.name}</h2>
            <div className="w-full grid md:grid-cols-10 text-primary-800">
                <div className="col-span-7">
                    <CourseContentMedia
                        progressData={progressData?.data}
                        course={data?.course}
                        activeVideo={activeVideo}
                        setActiveVideo={setActiveVideo}
                        user={userData.user}
                        refetch={refetch}
                        reload={reload}
                        selectedQuizId={selectedQuizId}
                        quizQuestions={quizQuestions}
                        setSelectedQuizId={setSelectedQuizId}
                        setQuizQuestions={setQuizQuestions}
                    />
                </div>
                <div className="hidden md:block md:col-span-3 ml-[-30px]">
                    <CourseContentList
                        progressData={progressData?.data}
                        data={data?.course?.courseData}
                        activeVideo={activeVideo}
                        setActiveVideo={setActiveVideo}
                        refetch={reload}
                        onQuizClick={handleQuizClick}
                        selectedQuizId={selectedQuizId}
                    />
                </div>
            </div>
        </>
    );
}
