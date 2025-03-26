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
    readonly activeVideo: { sectionOrder: number; index: number };
    setActiveVideo(value: { sectionOrder: number; index: number }): void;
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
    const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set<number>());

    const videoSections = [...new Set<number>(data?.map((item: any) => item.sectionOrder))];

    let totalCount = 0;

    const toggleSection = (sectionOrder: number) => {
        const newVisibleSections = new Set(visibleSections);
        if (newVisibleSections.has(sectionOrder)) {
            newVisibleSections.delete(sectionOrder);
        } else newVisibleSections.add(sectionOrder);
        setVisibleSections(newVisibleSections);
    };

    const handleButtonLesson = (sectionOrder: number, index: number, isClickable: boolean, sectionLessons: any[]) => {
        const item = sectionLessons[index];

        if (isClickable) {
            if (item.videoUrl) {
                setActiveVideo({ sectionOrder, index });
                onQuizClick(null, []);
            } else if (item.quizzes) {
                onQuizClick(item.quizzes[0]._id, item.quizzes[0].questions);
                setActiveVideo({ sectionOrder, index });
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
        ? [
              ...new Set(
                  progressData.completedQuizzes.flatMap((section: any) =>
                      section.section.quizzes.map((quiz: any) => quiz.toString())
                  )
              )
          ]
        : [];

    return (
        <section className={'w-full px-[14px] text-primary-800 mb-12'}>
            {videoSections.map((sectionOrder: number) => {
                const isSectionVisible = visibleSections.has(sectionOrder);

                const sectionItems: any[] = data.filter((item: any) => item.sectionOrder === sectionOrder);
                const sectionLessons = sectionItems.filter((item: any) => !item.isQuiz);

                const sectionVideoLength = sectionLessons.reduce(
                    (total: number, lesson: any) => total + (lesson.videoLength || 0),
                    0
                );

                const totalSectionLength = sectionVideoLength;
                const sectionContentHours = totalSectionLength / 60;

                const sectionStartIndex = totalCount;
                totalCount += sectionLessons.length;

                const completedLesson = [
                    ...new Set(
                        sectionItems.flatMap((item: any) => {
                            const completedSection = progressData?.completedLessons?.find(
                                (s: any) =>
                                    s.section.name?.trim().toLowerCase() === item.videoSection?.trim().toLowerCase()
                            );

                            const completedLessonsFunc = completedSection ? completedSection.section.lessons : [];

                            return completedLessonsFunc;
                        })
                    )
                ];

                const completedQuizzes = [
                    ...new Set(
                        sectionItems.flatMap((item: any) => {
                            const completedSection = progressData?.completedQuizzes?.find(
                                (s: any) => s.section.quizzes[0] === item.quizzes[0]?._id
                            );

                            const completedQuizzesFunc = completedSection ? completedSection.section.quizzes : [];

                            return completedQuizzesFunc;
                        })
                    )
                ];

                const completedLessons = [...completedLesson, ...completedQuizzes];

                const sectionName = sectionItems[0]?.videoSection || 'Unknown Section';

                return (
                    <div key={sectionOrder} className="border rounded-lg p-4 w-full mt-4 ">
                        <button
                            onClick={() => toggleSection(sectionOrder)}
                            className="flex w-full text-left text-lg font-semibold p-4 gap-x-3 "
                        >
                            {isSectionVisible ? <ChevronDown /> : <ChevronUp />}
                            <div className="flex justify-between items-center w-full">
                                {/* Hiển thị tên section và sectionOrder */}
                                <div className="flex items-center gap-2">{` ${sectionName}`}</div>
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

                                    const isQuizCompleted = item.quizzes.some((quiz: any) =>
                                        completedQuizIds.includes(quiz._id.toString())
                                    );

                                    const isPreviousCompleted =
                                        videoIndex === 0 ||
                                        completedLessonIds.includes(data[videoIndex - 1]?._id.toString()) ||
                                        completedQuizIds.includes(
                                            data[videoIndex]?.quizzes?.find((quiz: any) =>
                                                completedQuizIds.includes(quiz._id.toString())
                                            )
                                        ) ||
                                        (index === 0 &&
                                            videoSections.indexOf(sectionOrder) > 0 &&
                                            completedQuizIds.includes(
                                                data
                                                    .filter(
                                                        (item: any) =>
                                                            item.sectionOrder ===
                                                            videoSections[videoSections.indexOf(sectionOrder) - 1]
                                                    )
                                                    .at(-1)
                                                    ?.quizzes?.at(-1)
                                                    ?._id.toString()
                                            ));

                                    const isClickable = isCompleted || isPreviousCompleted || isQuizCompleted;
                                    const isQuiz = !item.videoUrl && item.quizzes?.length > 0;
                                    const isLesson = item.videoUrl;

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
                                                            <Image src={PlayContent} alt="play content" />
                                                        )}
                                                        <button
                                                            className={`hover:text-accent-600 ${
                                                                activeVideo?.sectionOrder === sectionOrder &&
                                                                activeVideo?.index === index
                                                                    ? 'text-accent-600'
                                                                    : isCompleted
                                                                      ? ' '
                                                                      : !isClickable
                                                                        ? 'cursor-no-drop opacity-50 text-gray-400'
                                                                        : 'text-gray-700'
                                                            }`}
                                                            onClick={() =>
                                                                handleButtonLesson(
                                                                    sectionOrder,
                                                                    index,
                                                                    isClickable,
                                                                    sectionLessons
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
                                                            <MdOutlineQuiz className="text-lg" />
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
                                                                    sectionOrder,
                                                                    index,
                                                                    isClickable,
                                                                    sectionLessons
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
