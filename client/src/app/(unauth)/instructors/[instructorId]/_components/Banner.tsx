import React from 'react';
import Image from 'next/image';
import star from '@/public/assets/icons/star-outline.svg';
import time from '@/public/assets/icons/hour.svg';
import timeTable from '@/public/assets/icons/timetable.svg';
import student from '@/public/assets/icons/students.svg';
import Bannerr from '@/components/ui/Banner';
export default function Banner() {
    return (
        <div>
            <Bannerr
                title="Hi, I Am Ali Tufan"
                breadcrumbs={[
                    { href: '/development', text: 'Development' },
                    { href: '/web-development', text: 'Web Development' }
                ]}
                contentAlignment="left"
                background="https://creativelayers.net/themes/upskill-html/images/page-title/inner-page.png"
            >
                <p className="text-primary-800 mb-6">Developer and Teacher</p>
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
            </Bannerr>
        </div>
    );
}
