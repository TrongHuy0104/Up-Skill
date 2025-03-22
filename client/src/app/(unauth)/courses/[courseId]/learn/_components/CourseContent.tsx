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
    const { data, isLoading, refetch } = useGetCourseContentQuery(courseId, { refetchOnMountOrArgChange: true });
    const { data: progressData, refetch: reload } = useGetProgressDataQuery(courseId);
    // const [activeVideo, setActiveVideo] = useState<number>(0);
    const [activeVideo, setActiveVideo] = useState<{ section: string; index: number }>({
        section: 'Section 1',
        index: 0
    });

    console.log('data', data);

    const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
    const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null); // State để lưu trữ quizId được chọn

    const handleQuizClick = (quizId: string | null, questions: any[]) => {
        setSelectedQuizId(quizId); // Lưu quizId được chọn
        // setShowQuiz(true); // Hiển thị giao diện làm quiz
        setQuizQuestions(questions);
        // setActiveVideo(null)
    };

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
            )}
        </>
    );
}
