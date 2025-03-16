'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';

import PlayContent from '@/public/assets/icons/play-content.svg';
import LockIcon from '@/public/assets/icons/lock.svg';
import MoreSections from '@/public/assets/icons/more-sections.svg';
import { getMinutes } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import VideoPlayer from '@/app/(auth)/dashboard/instructor/courses/[courseId]/_components/VideoPlayer';

interface Props {
    readonly data: any;
    readonly activeVideo?: number;
    setActiveVideo?(value: number): void;
}

export default function CourseContent({ data }: Props) {
    const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set<string>());
    const [isShowAllSections, setIsShowAllSections] = useState(false);
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

    const filterVideoSection = isShowAllSections ? videoSections : videoSections.slice(0, 3);

    return (
        <section className={'w-full  text-primary-800'}>
            <h2 className="text-2xl font-bold mb-4 font-cardo">Course Content</h2>
            {filterVideoSection.map((section: string) => {
                const isSectionVisible = visibleSections.has(section);

                // filter lessons by section
                const sectionVideos: any[] = data.filter((item: any) => item.videoSection === section);
                const sectionVideoCount = sectionVideos.length;
                const sectionVideoLength = sectionVideos.reduce(
                    (totalLength: number, item: any) => totalLength + item.videoLength,
                    0
                );

                const sectionStartIndex = totalCount;
                totalCount += sectionVideoCount;

                const sectionContentHours = sectionVideoLength / 60;

                return (
                    <div
                        key={section}
                        className="border rounded-lg p-2 w-full sm:min-w-[375px] sm:max-w[767px] md:min-w-[700px] md:max-w-[900px] mx-auto mt-4 "
                    >
                        <button
                            onClick={() => toggleSection(section)}
                            className="flex w-full text-left text-lg font-semibold p-4 md:gap-x-3 gap-x-1"
                        >
                            {isSectionVisible ? (
                                <div className="flex items-center">
                                    <ChevronDown />
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <ChevronUp />
                                </div>
                            )}
                            <div className="flex justify-between items-center w-full gap-3">
                                <span className="hidden sm:inline">{section}</span>
                                <span className="sm:hidden">{section.slice(0, 7)}...</span>
                                <span className="text-sm font-normal flex-row sm:flex gap-2">
                                    <div className="block sm:inline">{sectionVideoCount} lessons </div>
                                    <div className="hidden sm:inline">• </div>
                                    <div className="block sm:inline">
                                        {sectionVideoLength < 60
                                            ? sectionVideoLength.toFixed(0)
                                            : sectionContentHours.toFixed(2)}{' '}
                                        {sectionVideoLength > 60 ? 'hours' : 'minutes'}
                                    </div>
                                </span>
                            </div>
                        </button>
                        {isSectionVisible && (
                            <div className="mt-2 border-t pt-2 space-y-2">
                                {sectionVideos.map((item: any, index: number) => {
                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                                                {item.isFree ? (
                                                    <Dialog>
                                                        <DialogTrigger className="hover:text-accent-900" asChild>
                                                            <div className="cursor-pointer">{item.title}</div>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[425px] md:max-w-[800px]">
                                                            <DialogHeader>
                                                                <DialogTitle className="text-2xl">
                                                                    Course Preview
                                                                </DialogTitle>
                                                            </DialogHeader>
                                                            <VideoPlayer videoUrl={item?.videoUrl?.url || ''} />
                                                        </DialogContent>
                                                    </Dialog>
                                                ) : (
                                                    <div className="hover:text-accent-900">{item.title}</div>
                                                )}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-primary-800">
                                                    {getMinutes(lessonLength.toFixed(0))}
                                                </span>
                                                {item.isFree ? (
                                                    <div className="text-accent-900 border border-accent-900 px-2 py-1 text-sm rounded">
                                                        Preview
                                                    </div>
                                                ) : (
                                                    <Image src={LockIcon} alt="locked" />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
            {videoSections.length > 3 && (
                <button
                    className="flex w-[900px] justify-center items-center gap-[10px] border border-primary-text-primary-800 hover:border-[#E27447] rounded-lg mt-4  h-[55px]"
                    onClick={() => setIsShowAllSections(!isShowAllSections)}
                >
                    {isShowAllSections ? 'Collapse' : `${videoSections.length - 3} More Sections`}
                    <Image src={MoreSections} alt="" />
                </button>
            )}
        </section>
    );
}
