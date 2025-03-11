'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';

import PlayContent from '@/public/assets/icons/play-content.svg';
import { getMinutes } from '@/lib/utils';

interface Props {
    readonly data: any;
    readonly activeVideo: number;
    setActiveVideo(value: number): void;
}

export default function CourseContentList({ data, activeVideo, setActiveVideo }: Props) {
    const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set<string>());
    // find unique video sections
    const videoSections: string[] = [...new Set<string>(data?.map((item: any) => item.videoSection))];

    let totalCount = 0;

    const toggleSection = (section: string) => {
        const newVisibleSections = new Set(visibleSections);
        if (newVisibleSections.has(section)) {
            newVisibleSections.delete(section);
        } else newVisibleSections.add(section);
        setVisibleSections(newVisibleSections);
    };

    return (
        <section className={'w-full px-[14px] text-primary-800 mb-12'}>
            {videoSections.map((section: string) => {
                const isSectionVisible = visibleSections.has(section);

                // filter lessons by section
                const sectionVideos: any[] = data.filter((item: any) => item.videoSection === section);
                const sectionVideoCount = sectionVideos.length;
                const sectionVideoLength = sectionVideos.reduce(
                    (totalLength: number, item: any) => totalLength + item?.videoLength,
                    0
                );

                const sectionStartIndex = totalCount;
                totalCount += sectionVideoCount;

                const sectionContentHours = sectionVideoLength / 60;

                return (
                    <div key={section} className="border rounded-lg p-4 w-full mt-4 ">
                        <button
                            onClick={() => toggleSection(section)}
                            className="flex w-full text-left text-lg font-semibold p-4 gap-x-3 "
                        >
                            {isSectionVisible ? <ChevronDown /> : <ChevronUp />}
                            <div className="flex justify-between items-center w-full">
                                {section}
                                <span className="text-sm font-normal">
                                    {sectionVideoCount} lessons •{' '}
                                    {sectionVideoLength < 60
                                        ? sectionVideoLength?.toFixed(0)
                                        : sectionContentHours.toFixed(2)}{' '}
                                    {sectionVideoLength > 60 ? 'hours' : 'minutes'}
                                </span>
                            </div>
                        </button>
                        {isSectionVisible && (
                            <div className="mt-2 border-t pt-2 space-y-2">
                                {sectionVideos.map((item: any, index: number) => {
                                    const videoIndex = sectionStartIndex + index;
                                    const lessonLength = item?.videoLength;
                                    return (
                                        <div
                                            key={item.title + index}
                                            className="flex justify-between items-center h-[35px]"
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className="p-5">
                                                    <Image src={PlayContent} alt="play content" />
                                                </span>
                                                <button
                                                    className={`hover:text-accent-600 ${videoIndex === activeVideo && 'text-accent-600'}`}
                                                    onClick={() => setActiveVideo(videoIndex)}
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
                            </div>
                        )}
                    </div>
                );
            })}
        </section>
    );
}
