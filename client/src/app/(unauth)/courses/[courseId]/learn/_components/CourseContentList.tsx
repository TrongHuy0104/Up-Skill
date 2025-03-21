'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { MdOutlineQuiz } from 'react-icons/md';

import PlayContent from '@/public/assets/icons/play-content.svg';
import { getMinutes } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Props {
    readonly data: any;
    readonly progressData: any;
    readonly activeVideo: number | null; // Chỉnh sửa thành string | number
    setActiveVideo(value: number): void;
    refetch: any;
    onQuizClick: (quizId: string | null, quizQuestions: any[]) => void;
    selectedQuizId: string | null;
}

export default function CourseContentList({
    data,
    progressData,
    activeVideo,
    setActiveVideo,
    onQuizClick,
    selectedQuizId
}: Props) {
    const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set<string>());

    const videoSections: string[] = [...new Set<string>(data?.map((item: any) => item.videoSection))];

    let totalCount = 0;

    const toggleSection = (section: string) => {
        const newVisibleSections = new Set(visibleSections);
        if (newVisibleSections.has(section)) {
            newVisibleSections.delete(section);
        } else newVisibleSections.add(section);
        setVisibleSections(newVisibleSections);
    };

    const handleButtonLesson = (index: number, isClickable: boolean, sectionLessons: any[], section: string) => {
        const item = sectionLessons[index];
        console.log('section', section);

        if (isClickable) {
            if (item.videoUrl) {
                setActiveVideo(index);
                onQuizClick(null, []);
            } else if (item.quizzes) {
                onQuizClick(item.quizzes[0]._id, item.quizzes[0].questions);
                setActiveVideo(index);

                // Kiểm tra nếu quiz đã hoàn thành
            }
        } else {
            toast({
                variant: 'destructive',
                title: 'You must complete the current lesson before moving on!'
            });
        }
    };

    const completedLessonIds = progressData?.completedLessons?.length
        ? progressData.completedLessons.flatMap((section: any) =>
              section.section.lessons.map((lesson: any) => lesson.toString())
          )
        : [];

    const completedQuizIds = progressData?.completedQuizzes?.length
        ? progressData.completedQuizzes.flatMap((section: any) =>
              section.section.quizzes.map((quiz: any) => quiz.toString())
          )
        : [];

    return (
        <section className={'w-full px-[14px] text-primary-800 mb-12'}>
            {videoSections.map((section: string) => {
                const isSectionVisible = visibleSections.has(section);

                const sectionItems: any[] = data.filter((item: any) => item.videoSection === section);

                const sectionLessons = sectionItems.filter((item: any) => !item.isQuiz); // Filter out quizzes

                const sectionQuizzes = sectionItems.filter((item: any) => item.quizzes && item.quizzes.length > 0); // Filter out lessons

                const quizIds: string[] = [];

                sectionQuizzes.forEach((quizItem: any) => {
                    quizItem.quizzes.forEach((quiz: any) => {
                        quizIds.push(quiz._id);
                    });
                });

                const sectionVideoLength = sectionLessons.reduce(
                    (total: number, lesson: any) => total + (lesson.videoLength || 0),
                    0
                );
                const sectionQuizLength = sectionQuizzes.reduce(
                    (total: number, quizItem: any) =>
                        total + quizItem.quizzes.reduce((sum: number, quiz: any) => sum + quiz.videoLength, 0),
                    0
                );

                const totalSectionLength = sectionVideoLength + sectionQuizLength;
                const sectionContentHours = totalSectionLength / 60;

                const sectionStartIndex = totalCount;
                totalCount += sectionLessons.length;

                // Get completed lessons for this section
                const completedLessons =
                    progressData?.completedLessons?.find((s: any) => s.section.name === section)?.section.lessons || [];

                return (
                    <div key={section} className="border rounded-lg p-4 w-full mt-4 ">
                        <button
                            onClick={() => toggleSection(section)}
                            className="flex w-full text-left text-lg font-semibold p-4 gap-x-3 "
                        >
                            {isSectionVisible ? <ChevronDown /> : <ChevronUp />}
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-2">{section}</div>
                                <span className="text-sm font-normal">
                                    {completedLessons.length}/{sectionLessons.length} lessons •{' '}
                                    {totalSectionLength < 60
                                        ? totalSectionLength?.toFixed(0)
                                        : sectionContentHours.toFixed(2)}{' '}
                                    {totalSectionLength > 60 ? 'hours' : 'minutes'}
                                </span>
                            </div>
                        </button>
                        {isSectionVisible && (
                            <div className="mt-2 border-t pt-2 space-y-2">
                                {/* Render Lessons */}
                                {sectionLessons.map((item: any, index: number) => {
                                    const videoIndex = sectionStartIndex + index;

                                    const lessonLength = item?.videoLength || 0;

                                    const isCompleted = completedLessonIds.includes(item._id.toString());

                                    // Sử dụng phương thức some() để kiểm tra từng quiz._id trong item.quizzes
                                    const isQuizCompleted = item.quizzes.some((quiz: any) =>
                                        completedQuizIds.includes(quiz._id.toString())
                                    );

                                    const isPreviousCompleted =
                                        videoIndex === 0 ||
                                        completedLessonIds.includes(data[videoIndex - 1]?._id.toString()) ||
                                        completedQuizIds.includes(
                                            data[videoIndex]?.quizzes?.find(
                                                (quiz: any) => completedQuizIds.includes(quiz._id.toString())?._id
                                            )
                                        ) ||
                                        // Kiểm tra nếu quiz cuối cùng của section trước đã hoàn thành
                                        (index === 0 &&
                                            videoSections.indexOf(section) > 0 &&
                                            completedQuizIds.includes(
                                                data
                                                    .filter(
                                                        (item: any) =>
                                                            item.videoSection ===
                                                            videoSections[videoSections.indexOf(section) - 1]
                                                    )
                                                    .at(-1)
                                                    ?.quizzes?.at(-1)
                                                    ?._id.toString()
                                            ));

                                    const isClickable = isCompleted || isPreviousCompleted || isQuizCompleted;
                                    const isQuiz = !item.videoUrl && item.quizzes?.length > 0; // Kiểm tra nếu là quiz
                                    const isLesson = item.videoUrl; // Kiểm tra nếu là bài học

                                    return (
                                        <div
                                            key={item.title + index}
                                            className="flex justify-between items-center h-[35px]"
                                        >
                                            {isLesson ? (
                                                <div className="lesson-item">
                                                    <span className="p-5 relative flex gap-2 items-center">
                                                        {isCompleted ? (
                                                            <IoCheckmarkCircle className="text-accent-600 text-lg" />
                                                        ) : (
                                                            <MdOutlineQuiz className="text-lg" />
                                                        )}
                                                        <button
                                                            className={`hover:text-accent-600 ${
                                                                index === activeVideo
                                                                    ? 'text-accent-600'
                                                                    : isCompleted
                                                                      ? ' '
                                                                      : !isClickable
                                                                        ? 'cursor-no-drop opacity-50 text-gray-400'
                                                                        : 'text-gray-700'
                                                            }`}
                                                            onClick={() =>
                                                                handleButtonLesson(
                                                                    index,
                                                                    isClickable,
                                                                    sectionLessons,
                                                                    section
                                                                )
                                                            }
                                                            disabled={!isClickable}
                                                        >
                                                            {item.title}
                                                        </button>
                                                    </span>
                                                </div>
                                            ) : isQuiz ? (
                                                <div className="quiz-item">
                                                    <span className="p-5 relative flex gap-2 items-center">
                                                        {isQuizCompleted ? (
                                                            <IoCheckmarkCircle className="text-accent-600 text-lg" />
                                                        ) : (
                                                            <Image src={PlayContent} alt="play content" />
                                                        )}
                                                        <button
                                                            className={`hover:text-accent-600 ${
                                                                selectedQuizId === item.quizzes[0]._id
                                                                    ? 'text-accent-600'
                                                                    : isQuizCompleted
                                                                      ? ' '
                                                                      : !isClickable
                                                                        ? 'cursor-no-drop opacity-50 text-gray-400'
                                                                        : 'text-gray-700'
                                                            }`}
                                                            onClick={() =>
                                                                handleButtonLesson(
                                                                    index,
                                                                    isClickable,
                                                                    sectionLessons,
                                                                    section
                                                                )
                                                            }
                                                            disabled={!isClickable}
                                                        >
                                                            {item.title}
                                                        </button>
                                                    </span>
                                                </div>
                                            ) : null}
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-[#131836]">
                                                    {getMinutes(lessonLength?.toFixed(0))}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </section>
    );
}
