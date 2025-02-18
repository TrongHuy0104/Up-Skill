import React from 'react';
import Image from 'next/image';
import star from '@/public/assets/icons/star-outline.svg';
import time from '@/public/assets/icons/hour.svg';
import timeTable from '@/public/assets/icons/timetable.svg';
import student from '@/public/assets/icons/students.svg';
import avatar from '@/public/assets/images/avatar/user-1.png';
import CoursesDetailBanner from './CoursesDetailBanner';
export default function Banner() {
    return (
        <div>
            <CoursesDetailBanner
                title="The Complete 2024 Web Development Bootcamp"
                breadcrumbs={[
                    { href: '/development', text: 'Development' },
                    { href: '/web-development', text: 'Web Development' }
                ]}
                contentAlignment="left"
                backgroundColor="bg-white"
            >
                <p className="text-primary-800 py-5">
                    Learn: HTML | CSS | JavaScript | Web programming | Web development | Front-end | Responsive | JQuery
                </p>
                <div className="flex items-center text-primary-800 mt-2 pb-4">
                    <Image alt="Star Icon" src={star} />
                    <span className="pl-[6px] pr-6"> 4.9 (315,475 rating)</span>
                    <Image alt="Time Table Icon" src={timeTable} width={20} height={20} />
                    <span className="pl-[6px] pr-6"> 11 Lessons</span>
                    <Image alt="Student Icon" src={student} />
                    <span className="pl-[6px] pr-6"> 229 Students</span>
                    <Image alt="Time Icon" src={time} />
                    <span className="pl-[6px] pr-6">Last updated 12/2024</span>
                </div>
                <div className="flex items-center mt-4 gap-4">
                    <Image
                        src={avatar}
                        alt="Instructor"
                        width={40}
                        height={40}
                        className="rounded-full  border-4 border-white outline outline-[1px] outline-accent-600 min-w-[40px] max-w[40px]"
                    />
                    <div className="text-primary-800 flex gap-1">
                        <p>By</p>
                        <div className="hover:text-accent-800 cursor-pointer">Theresa Edin</div>
                        <p>In</p>
                        <div className="hover:text-accent-800 cursor-pointer">Development</div>
                    </div>
                </div>
            </CoursesDetailBanner>
        </div>
    );
}
