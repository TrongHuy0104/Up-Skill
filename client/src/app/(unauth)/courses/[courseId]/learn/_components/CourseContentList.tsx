'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { IoCheckmarkCircle } from 'react-icons/io5';

import PlayContent from '@/public/assets/icons/play-content.svg';
import { getMinutes } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Props {
    readonly data: any;
    readonly progressData: any;
    readonly activeVideo: number;
    setActiveVideo(value: number): void;
    refetch: any;
}

export default function CourseContentList({ data, progressData, activeVideo, setActiveVideo }: Props) {
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

    const handleButtonLesson = (index: number, isClickable: boolean) => {
        if (isClickable) {
            setActiveVideo(index);
        } else {
            toast({
                variant: 'destructive',
                title: 'You must complete the current lesson before moving on!',
            });
        }
    };

    const completedLessonIds = progressData?.completedLessons?.length
        ? progressData.completedLessons.flatMap(
            (section: any) => section.section.lessons.map((lesson: any) => lesson.toString())
        )
        : [];

    return (
        <section className={'w-full px-[14px] text-primary-800 mb-12'}>
            {videoSections.map((section: string) => {
                const isSectionVisible = visibleSections.has(section);

                const sectionItems: any[] = data.filter((item: any) => item.videoSection === section);
                const sectionLessons = sectionItems.filter((item: any) => !item.isQuiz); // Filter out quizzes
                const sectionQuizzes = sectionItems.filter((item: any) => item.isQuiz); // Filter quizzes

                const sectionVideoCount = sectionLessons.length;
                const sectionVideoLength = sectionLessons.reduce(
                    (totalLength: number, item: any) => totalLength + item?.videoLength,
                    0
                );

                const sectionStartIndex = totalCount;
                totalCount += sectionVideoCount;

                const sectionContentHours = sectionVideoLength / 60;

                const completedLessons = progressData?.completedLessons?.find(
                    (s: any) => s.section.name === section
                )?.section.lessons || [];

                return (
                    <div key={section} className="border rounded-lg p-4 w-full mt-4 ">
                        <button
                            onClick={() => toggleSection(section)}
                            className="flex w-full text-left text-lg font-semibold p-4 gap-x-3 "
                        >
                            {isSectionVisible ? <ChevronDown /> : <ChevronUp />}
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-2">
                                    {section}
                                </div>
                                <span className="text-sm font-normal">
                                    {completedLessons.length}/{sectionVideoCount} lessons •{' '}
                                    {sectionVideoLength < 60
                                        ? sectionVideoLength?.toFixed(0)
                                        : sectionContentHours.toFixed(2)}{' '}
                                    {sectionVideoLength > 60 ? 'hours' : 'minutes'}
                                </span>
                            </div>
                        </button>
                        {isSectionVisible && (
                            <div className="mt-2 border-t pt-2 space-y-2">
                                {/* Render Lessons */}
                                {sectionLessons.map((item: any, index: number) => {
                                    const videoIndex = sectionStartIndex + index;
                                    const lessonLength = item?.videoLength;

                                    const isCompleted = completedLessonIds.includes(item._id.toString());

                                    const isPreviousCompleted =
                                        videoIndex === 0 || completedLessonIds.includes(data[videoIndex - 1]?._id.toString());
                                    const isClickable = isCompleted || isPreviousCompleted;

                                    return (
                                        <div
                                            key={item.title + index}
                                            className="flex justify-between items-center h-[35px]"
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className="p-5 relative">
                                                    {isCompleted ? (
                                                        <IoCheckmarkCircle className="text-accent-600 text-lg" />
                                                    ) : <Image src={PlayContent} alt="play content" />}
                                                </span>
                                                <button
                                                    className={`hover:text-accent-600 ${videoIndex === activeVideo
                                                        ? 'text-accent-600'
                                                        : isCompleted
                                                            ? ''
                                                            : !isClickable
                                                                ? 'cursor-no-drop opacity-50 text-gray-400'
                                                                : 'text-gray-700'
                                                        }`}
                                                    onClick={() =>
                                                        handleButtonLesson(videoIndex, isClickable)
                                                    }
                                                    disabled={!isClickable}
                                                    title={
                                                        !isClickable
                                                            ? 'Complete the previous lesson to unlock'
                                                            : ''
                                                    }
                                                >
                                                    {item.title}
                                                </button>
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-[#131836]">
                                                    {getMinutes(lessonLength?.toFixed(0))}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Render Quizzes */}
                                {sectionQuizzes.map((quiz: any, index: number) => {
                                    const isCompleted = completedLessonIds.includes(quiz._id.toString());

                                    return (
                                        <div
                                            key={quiz.title + index}
                                            className="flex justify-between items-center h-[35px]"
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className="p-5 relative">
                                                    {isCompleted ? (
                                                        <IoCheckmarkCircle className="text-accent-600 text-lg" />
                                                    ) : <Image src={PlayContent} alt="play content" />}
                                                </span>
                                                <button
                                                    className={`hover:text-accent-600 ${isCompleted
                                                        ? 'text-accent-600'
                                                        : 'text-gray-700'
                                                        }`}
                                                    onClick={() => {
                                                        // Handle quiz click (e.g., navigate to quiz page)
                                                        toast({
                                                            title: 'Quiz Clicked',
                                                            description: `You clicked on the quiz: ${quiz.title}`,
                                                        });
                                                    }}
                                                >
                                                    {quiz.title}
                                                </button>
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-[#131836]">
                                                    Quiz
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