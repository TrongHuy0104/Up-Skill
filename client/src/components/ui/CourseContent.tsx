'use client';

import { useState, JSX } from 'react';
import Image from 'next/image';
import { DM_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import PlayContent from '@/public/assets/icons/play-content.svg';
import ToolContent from '@/public/assets/icons/tool-content.svg';
import Question from '@/public/assets/icons/question.svg';

const dmSans = DM_Sans({ subsets: ['latin'] });

export default function CourseContent() {
    const [isOpen, setIsOpen] = useState(true);

    interface Lecture {
        title: string;
        duration: string;
        preview: boolean;
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
                    icon: <Image src={PlayContent} alt="play content" />
                },
                {
                    title: 'Tools Introduction',
                    duration: '07:50',
                    preview: true,
                    icon: <Image src={ToolContent} alt="tool content" />
                },
                {
                    title: 'Basic Document Structure',
                    duration: '06:30',
                    preview: true,
                    icon: <Image src={Question} alt="question" />
                },
                {
                    title: 'HTML5 Foundations Certification Final Project',
                    duration: '02:40',
                    preview: false,
                    icon: <Image src={PlayContent} alt="play content" />
                }
            ]
        }
    ];
    return (
        <div className={cn(dmSans.className, 'max-w-[900px] mx-auto p-4')}>
            <h2 className="text-2xl font-bold mb-4">Course Content</h2>
            <div className="border rounded-lg p-4 w-full max-w-4xl bg-white ">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full text-left text-lg font-semibold p-4 gap-x-3"
                >
                    <ChevronDown className={`transition-transform ${isOpen ? 'rotate-1000' : ''}`} />
                    {sections[0].title}
                </button>

                {isOpen && (
                    <div className="mt-2 border-t pt-2 space-y-2">
                        {sections[0].lectures &&
                            Array.isArray(sections[0].lectures) &&
                            sections[0].lectures.map((lecture, index) => (
                                <div key={index} className="flex justify-between items-center h-[35px]">
                                    <span className="flex items-center gap-2">
                                        <span className="p-5">{lecture.icon}</span>
                                        {lecture.title}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">{lecture.duration}</span>
                                        {lecture.preview && (
                                            <button className="text-orange-500 border border-orange-500 px-2 py-1 text-sm rounded">
                                                Preview
                                            </button>
                                        )}
                                        <span>icon</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
            <button className="mt-4 w-full text-blue-600 border-t pt-4">78 More Sections ↗</button>
        </div>
    );
}
