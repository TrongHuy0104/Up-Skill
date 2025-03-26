'use client';
import React from 'react';
import Image from 'next/image';
import star from '@/public/assets/icons/star-outline.svg';
import timeTable from '@/public/assets/icons/timetable.svg';
import student from '@/public/assets/icons/students.svg';
import BannerFromUI from '@/components/ui/Banner';
import { User } from '@/types/User';
interface Props {
    readonly user: User;
}

export default function Banner({ user }: Props) {
    const uploadedCoursesCount = user.uploadedCourses.length;

    return (
        <div>
            <BannerFromUI
                title={`Hi, I Am ${user.name}`}
                breadcrumbs={[
                    { href: '/', text: 'Development' },
                    { href: '/instructors', text: 'Instructors' },
                    { href: '/', text: 'Instructor Detail' }
                ]}
                contentAlignment="left"
                background="https://creativelayers.net/themes/upskill-html/images/page-title/inner-page.png"
            >
                <p className="text-primary-800 mb-6">Developer and Teacher</p>
                <div className="flex items-center text-primary-800 mt-2 pb-4">
                    <Image alt="Star Icon" src={star} />
                    <span className="pl-[6px] pr-6"> {user?.rating?.toString()}</span>
                    <Image alt="Time Table Icon" src={timeTable} width={20} height={20} />
                    <span className="pl-[6px] pr-6"> {uploadedCoursesCount || 0} Lessons</span>
                    <Image alt="Student Icon" src={student} />
                    <span className="pl-[6px] pr-6"> 229 Students</span>
                </div>
            </BannerFromUI>
        </div>
    );
}
