'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';

import PlayContent from '@/public/assets/icons/play-content.svg';
import LockIcon from '@/public/assets/icons/lock.svg';
import MoreSections from '@/public/assets/icons/more-sections.svg';
import { getMinutes } from '@/lib/utils';

interface Props {
    data: any;
    activeVideo?: number;
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

    console.log(videoSections);

    const filterVideoSection = isShowAllSections ? videoSections : videoSections.slice(0, 3);

    return (
        <section className={'w-[900px] px-[14px] text-primary-800'}>
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
                    <div key={section} className="border rounded-lg p-4 w-[900px] mt-4 ">
                        <button
                            onClick={() => toggleSection(section)}
                            className="flex w-full text-left text-lg font-semibold p-4 gap-x-3 "
                        >
                            {isSectionVisible ? <ChevronDown /> : <ChevronUp />}
                            <div className="flex justify-between items-center w-full">
                                {section}
                                <span className="text-sm font-normal">
                                    {sectionVideoCount} lessons •{' '}
                                    {sectionVideoLength < 60 ? sectionVideoLength : sectionContentHours.toFixed(2)}{' '}
                                    {sectionVideoLength > 60 ? 'hours' : 'minutes'}
                                </span>
                            </div>
                        </button>
                        {isSectionVisible && (
                            <div className="mt-2 border-t pt-2 space-y-2">
                                {sectionVideos.map((item: any, index: number) => {
                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                    const videoIndex = sectionStartIndex + index;
                                    const lessonLength = item.videoLength;
                                    return (
                                        <div
                                            key={item.title + index}
                                            className="flex justify-between items-center h-[35px]"
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className="p-5">
                                                    <Image src={PlayContent} alt="play content" />
                                                </span>
                                                <button className="hover:text-accent-900" onClick={() => {}}>
                                                    {item.title}
                                                </button>
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-[#131836]">
                                                    {getMinutes(lessonLength)}
                                                </span>
                                                {/* {lecture.preview && (
                                                        <button className="text-accent-900 border border-acctext-accent-900 px-2 py-1 text-sm rounded">
                                                            Preview
                                                        </button>
                                                    )} */}
                                                {true && <Image src={LockIcon} alt="locked" />}
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
                    className="flex w-[900px] justify-center items-center gap-[10px] border border-[#131836] hover:border-[#E27447] rounded-lg mt-4  h-[55px]"
                    onClick={() => setIsShowAllSections(!isShowAllSections)}
                >
                    {isShowAllSections ? 'Collapse' : `${videoSections.length - 3} More Sections`}
                    <Image src={MoreSections} alt="" />
                </button>
            )}
        </section>
    );
}

// const [openSections, setOpenSections] = useState<(string | number)[]>([]);

// interface Lecture {
//     title: string;
//     duration: string;
//     preview: boolean;
//     locked: boolean;
//     icon?: JSX.Element;
// }
// interface Section {
//     title: string;
//     lectures?: Lecture[] | number;
//     duration?: string;
// }
// const sections: Section[] = [
//     {
//         title: 'Program Information 2023/2024 Edition',
//         lectures: [
//             {
//                 title: 'About The Course',
//                 duration: '01:20',
//                 preview: true,
//                 icon: <Image src={PlayContent} alt="play content" />,
//                 locked: false
//             },
//             {
//                 title: 'Tools Introduction',
//                 duration: '07:50',
//                 preview: true,
//                 icon: <Image src={ToolContent} alt="tool content" />,
//                 locked: false
//             },
//             {
//                 title: 'Basic Document Structure',
//                 duration: '06:30',
//                 preview: true,
//                 icon: <Image src={Question} alt="question" />,
//                 locked: true
//             },
//             {
//                 title: 'HTML5 Foundations Certification Final Project',
//                 duration: '02:40',
//                 preview: false,
//                 icon: <Image src={PlayContent} alt="play content" />,
//                 locked: true
//             }
//         ]
//     },
//     {
//         title: 'Certified HTML5 Foundations 2023/2024',
//         lectures: [
//             {
//                 title: 'About The Course',
//                 duration: '01:20',
//                 preview: true,
//                 icon: <Image src={PlayContent} alt="play content" />,
//                 locked: false
//             },
//             {
//                 title: 'Tools Introduction',
//                 duration: '07:50',
//                 preview: true,
//                 icon: <Image src={ToolContent} alt="tool content" />,
//                 locked: false
//             },
//             {
//                 title: 'Basic Document Structure',
//                 duration: '06:30',
//                 preview: true,
//                 icon: <Image src={Question} alt="question" />,
//                 locked: true
//             },
//             {
//                 title: 'HTML5 Foundations Certification Final Project',
//                 duration: '02:40',
//                 preview: false,
//                 icon: <Image src={PlayContent} alt="play content" />,
//                 locked: true
//             }
//         ]
//     },
//     {
//         title: 'Your Development Toolbox',
//         lectures: [
//             {
//                 title: 'About The Course',
//                 duration: '01:20',
//                 preview: true,
//                 icon: <Image src={PlayContent} alt="play content" />,
//                 locked: false
//             },
//             {
//                 title: 'Tools Introduction',
//                 duration: '07:50',
//                 preview: true,
//                 icon: <Image src={ToolContent} alt="tool content" />,
//                 locked: false
//             },
//             {
//                 title: 'Basic Document Structure',
//                 duration: '06:30',
//                 preview: true,
//                 icon: <Image src={Question} alt="question" />,
//                 locked: true
//             },
//             {
//                 title: 'HTML5 Foundations Certification Final Project',
//                 duration: '02:40',
//                 preview: false,
//                 icon: <Image src={PlayContent} alt="play content" />,
//                 locked: true
//             }
//         ]
//     },
//     {
//         title: 'JavaScript Specialist',
//         lectures: [
//             {
//                 title: 'About The Course',
//                 duration: '01:20',
//                 preview: true,
//                 icon: <Image src={PlayContent} alt="play content" />,
//                 locked: false
//             },
//             {
//                 title: 'Tools Introduction',
//                 duration: '07:50',
//                 preview: true,
//                 icon: <Image src={ToolContent} alt="tool content" />,
//                 locked: false
//             },
//             {
//                 title: 'Basic Document Structure',
//                 duration: '06:30',
//                 preview: true,
//                 icon: <Image src={Question} alt="question" />,
//                 locked: true
//             },
//             {
//                 title: 'HTML5 Foundations Certification Final Project',
//                 duration: '02:40',
//                 preview: false,
//                 icon: <Image src={PlayContent} alt="play content" />,
//                 locked: true
//             }
//         ]
//     }
// ];
// const toggleSection = (sectionTitle: string | number) => {
//     setOpenSections((prev) =>
//         prev.includes(sectionTitle) ? prev.filter((title) => title !== sectionTitle) : [...prev, sectionTitle]
//     );
// };

// return (
//     <div className={'w-[900px] px-[14px] text-primary-800'}>
//         <h2 className="text-2xl font-bold mb-4 font-cardo">Course Content</h2>
//         {sections.map((section) => (
//             <div key={section.title} className="border rounded-lg p-4 w-[900px] mt-4 ">
//                 <button
//                     onClick={() => toggleSection(section.title)}
//                     className="flex w-full text-left text-lg font-semibold p-4 gap-x-3 "
//                 >
//                     <ChevronDown
//                         className={`transition-transform ${openSections.includes(section.title) ? 'rotate-180' : ''}`}
//                     />
//                     <div className="flex justify-between items-center w-full">
//                         {section.title}
//                         <span className="text-sm font-normal">3 lectures • 9 min</span>
//                     </div>
//                 </button>
//                 {openSections.includes(section.title) && (
//                     <div className="mt-2 border-t pt-2 space-y-2">
//                         {section.lectures &&
//                             Array.isArray(section.lectures) &&
//                             section.lectures.map((lecture) => (
//                                 <div key={lecture.title} className="flex justify-between items-center h-[35px]">
//                                     <span className="flex items-center gap-2">
//                                         <span className="p-5">{lecture.icon}</span>
//                                         <button className="hover:text-[#E27447]" onClick={() => redirect('/')}>
//                                             {lecture.title}
//                                         </button>
//                                     </span>
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-sm text-[#131836]">{lecture.duration}</span>
//                                         {lecture.preview && (
//                                             <button className="text-[#E27447] border border-[#E27447] px-2 py-1 text-sm rounded">
//                                                 Preview
//                                             </button>
//                                         )}
//                                         {lecture.locked && <Image src={LockIcon} alt="locked" />}
//                                     </div>
//                                 </div>
//                             ))}
//                     </div>
//                 )}
//             </div>
//         ))}
//         <button
//             className="flex w-[900px] justify-center items-center gap-[10px] border border-[#131836] hover:border-[#E27447] rounded-lg mt-4  h-[55px]"
//             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//         >
//             78 More Sections
//             <Image src={MoreSections} alt="more sections" />
//         </button>
//     </div>
// );
