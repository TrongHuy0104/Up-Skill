import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';

import star from '@/public/assets/icons/star-outline.svg';
import time from '@/public/assets/icons/hour.svg';
import timeTable from '@/public/assets/icons/timetable.svg';
import student from '@/public/assets/icons/students.svg';
import defaultAvatar from '@/public/assets/images/avatar/default-avatar.jpg';
import CoursesDetailBanner from './CoursesDetailBanner';
import { Course } from '@/types/Course';

interface Props {
    readonly course: Course;
}

export default function Banner({ course }: Props) {
    return (
        <div>
            <CoursesDetailBanner
                title={course?.name}
                breadcrumbs={[
                    { href: '/', text: 'Development' },
                    { href: '', text: 'Course Detail' }
                ]}
                contentAlignment="left"
                backgroundColor="bg-white"
            >
                <p className="text-primary-800 py-5">{course?.tags}</p>
                <div className="flex items-center text-primary-800 mt-2 pb-4">
                    <Image alt="Star Icon" src={star} className="relative -top-0.5" />
                    <span className="pl-[6px] pr-6">
                        {' '}
                        {course?.rating} ({course?.reviews?.length} rating)
                    </span>
                    <Image alt="Time Table Icon" src={timeTable} width={20} height={20} />
                    <span className="pl-[6px] pr-6">
                        {' '}
                        {course?.courseData?.length}{' '}
                        {course?.courseData?.length && course?.courseData?.length <= 1 ? 'Lesson' : 'Lessons'}
                    </span>
                    <Image alt="Student Icon" src={student} />
                    <span className="pl-[6px] pr-6">
                        {course.purchased} {course.purchased <= 1 ? 'Student' : 'Students'}{' '}
                    </span>
                    <Image alt="Time Icon" src={time} />
                    <span className="pl-[6px] pr-6">
                        Last updated {format(new Date(course.updatedAt), 'MM/dd/yyyy')}
                    </span>
                </div>
                <div className="flex items-center mt-4 gap-4">
                    <Image
                        src={course?.authorId?.avatar.url || defaultAvatar}
                        alt={course?.authorId?.name}
                        width={40}
                        height={40}
                        className="rounded-full  border-4 border-white outline outline-[1px] outline-accent-600 min-w-[40px] max-w[40px]"
                    />
                    <div className="text-primary-800 flex gap-1">
                        <p>By</p>
                        <Link
                            href={`/instructors/${course?.authorId?._id}`}
                            className="hover:text-accent-800 cursor-pointer"
                        >
                            {course?.authorId?.name}
                        </Link>
                    </div>
                </div>
            </CoursesDetailBanner>
        </div>
    );
}
