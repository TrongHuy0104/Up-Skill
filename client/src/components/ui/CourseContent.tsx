'use client';

import { useState, JSX } from 'react';
import Image from 'next/image';
import { DM_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import PlayContent from '@/public/assets/icons/play-content.svg';
import ToolContent from '@/public/assets/icons/tool-content.svg';
import Question from '@/public/assets/icons/question.svg';
import LockIcon from '@/public/assets/icons/lock.svg';
import MoreSections from '@/public/assets/icons/more-sections.svg';
import { redirect } from 'next/navigation';

const dmSans = DM_Sans({ subsets: ['latin'] });

export default function CourseContent() {
    const [openSections, setOpenSections] = useState<number[]>([]);
    

    interface Lecture {
        title: string;
        duration: string;
        preview: boolean;
        locked: boolean;
        icon?: JSX.Element;
    }
    interface Section {
        title: string;
        lectures?: Lecture[] | number;
        duration?: string;
    }
    const sections: Section[] = [
        {
            title: 'Program Information 2023/2024 Edition',
            lectures: [
                {
                    title: 'About The Course',
                    duration: '01:20',
                    preview: true,
                    icon: <Image src={PlayContent} alt="play content" />,
                    locked: false
                },
                {
                    title: 'Tools Introduction',
                    duration: '07:50',
                    preview: true,
                    icon: <Image src={ToolContent} alt="tool content" />,
                    locked: false
                },
                {
                    title: 'Basic Document Structure',
                    duration: '06:30',
                    preview: true,
                    icon: <Image src={Question} alt="question" />,
                    locked: true
                },
                {
                    title: 'HTML5 Foundations Certification Final Project',
                    duration: '02:40',
                    preview: false,
                    icon: <Image src={PlayContent} alt="play content" />,
                    locked: true
                }
            ]
        },
        {
            title: 'Certified HTML5 Foundations 2023/2024',
            lectures: [
                {
                    title: 'About The Course',
                    duration: '01:20',
                    preview: true,
                    icon: <Image src={PlayContent} alt="play content" />,
                    locked: false
                },
                {
                    title: 'Tools Introduction',
                    duration: '07:50',
                    preview: true,
                    icon: <Image src={ToolContent} alt="tool content" />,
                    locked: false
                },
                {
                    title: 'Basic Document Structure',
                    duration: '06:30',
                    preview: true,
                    icon: <Image src={Question} alt="question" />,
                    locked: true
                },
                {
                    title: 'HTML5 Foundations Certification Final Project',
                    duration: '02:40',
                    preview: false,
                    icon: <Image src={PlayContent} alt="play content" />,
                    locked: true
                }
            ]
        },
        {
            title: 'Your Development Toolbox',
            lectures: [
                {
                    title: 'About The Course',
                    duration: '01:20',
                    preview: true,
                    icon: <Image src={PlayContent} alt="play content" />,
                    locked: false
                },
                {
                    title: 'Tools Introduction',
                    duration: '07:50',
                    preview: true,
                    icon: <Image src={ToolContent} alt="tool content" />,
                    locked: false
                },
                {
                    title: 'Basic Document Structure',
                    duration: '06:30',
                    preview: true,
                    icon: <Image src={Question} alt="question" />,
                    locked: true
                },
                {
                    title: 'HTML5 Foundations Certification Final Project',
                    duration: '02:40',
                    preview: false,
                    icon: <Image src={PlayContent} alt="play content" />,
                    locked: true
                }
            ]
        },
        {
            title: 'JavaScript Specialist',
            lectures: [
                {
                    title: 'About The Course',
                    duration: '01:20',
                    preview: true,
                    icon: <Image src={PlayContent} alt="play content" />,
                    locked: false
                },
                {
                    title: 'Tools Introduction',
                    duration: '07:50',
                    preview: true,
                    icon: <Image src={ToolContent} alt="tool content" />,
                    locked: false
                },
                {
                    title: 'Basic Document Structure',
                    duration: '06:30',
                    preview: true,
                    icon: <Image src={Question} alt="question" />,
                    locked: true
                },
                {
                    title: 'HTML5 Foundations Certification Final Project',
                    duration: '02:40',
                    preview: false,
                    icon: <Image src={PlayContent} alt="play content" />,
                    locked: true
                }
            ]
        }
    ];
    const toggleSection = (index: number) => {
        setOpenSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
    };
    return (
        <div className={cn(dmSans.className, 'max-w-[900px] mx-auto p-4 text-[#131836]')}>
            <h2 className="text-2xl font-bold mb-4">Course Content</h2>
            {sections.map((section, sectionKey) => (
                <div key={sectionKey} className="border rounded-lg p-4 w-full max-w-4xl mt-4 ">
                    <button
                        onClick={() => toggleSection(sectionKey)}
                        className="flex w-full text-left text-lg font-semibold p-4 gap-x-3 "
                    >
                        <ChevronDown
                            className={`transition-transform ${openSections.includes(sectionKey) ? 'rotate-180' : ''}`}
                        />
                        <div className="flex justify-between items-center w-full">
                            {section.title}
                            <span className="text-sm font-normal">3 lectures • 9 min</span>
                        </div>
                    </button>
                    {openSections.includes(sectionKey) && (
                        <div className="mt-2 border-t pt-2 space-y-2">
                            {section.lectures &&
                                Array.isArray(section.lectures) &&
                                section.lectures.map((lecture) => (
                                    <div key={lecture.title} className="flex justify-between items-center h-[35px]">
                                        <span className="flex items-center gap-2">
                                            <span className="p-5">{lecture.icon}</span>
                                            <button className='hover:text-[#E27447]' onClick={() => redirect('/')}>{lecture.title}</button>
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-[##131836]">{lecture.duration}</span>
                                            {lecture.preview && (
                                                <button className="text-[#E27447] border border-[#E27447] px-2 py-1 text-sm rounded">
                                                    Preview
                                                </button>
                                            )}
                                            {lecture.locked && <Image src={LockIcon} alt="locked" />}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            ))}
            <button
                className="flex justify-center items-center gap-[10px] border border-[#131836] hover:border-[#E27447] rounded-lg mt-4 w-full h-[55px]"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                78 More Sections
                <Image src={MoreSections} alt="more sections" />
            </button>
        </div>
    );
}
