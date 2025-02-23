import Image from 'next/image';
import { GoArrowUpRight } from 'react-icons/go';
import Link from 'next/link';
import { FaRegHeart } from 'react-icons/fa';

import img from '@/public/assets/images/courses/courses-01.jpg';
import timeTableIcon from '@/public/assets/icons/timetable.svg';
import hourIcon from '@/public/assets/icons/hour.svg';
import studentsIcon from '@/public/assets/icons/students.svg';
import starIcon from '@/public/assets/icons/star.svg';
import starOutlineIcon from '@/public/assets/icons/star-outline.svg';
import { Course } from '@/app/(unauth)/courses/_components/HorizontalCoursesList';

interface CourseVerticalCardProps {
    readonly isProgress?: boolean; // Show progress bar only if true
    readonly progress?: number; // Progress percentage (0-100)
    readonly width?: string; // Custom width
    readonly height?: string; // Custom height
}

interface CourseHorizontalCard {
    readonly width?: string; // Custom width
    readonly height?: string; // Custom height
    readonly course: Course;
}

export default function CourseVerticalCard({
    isProgress = false,
    progress = 0,
    width = '260px',
    height = '190px'
}: CourseVerticalCardProps) {
    return (
        <div className="group shrink-0 h-full relative transition-transform" style={{ width }}>
            <div className="relative rounded-sm overflow-hidden" style={{ height }}>
                <Image
                    src={img}
                    alt=""
                    className="w-full h-full object-cover transition-all duration-1000 ease-in-out 
                        group-hover:scale-110 group-hover:transition-all group-hover:duration-1000 group-hover:ease-in-out"
                />
                <div
                    className="absolute top-[10px] right-[10px] flex items-center justify-center w-[35px] h-[35px] rounded-full
                     bg-[rgba(19,24,54,0.302)] shadow-[0px_6px_15px_0px_rgba(64,79,104,0.051)] text-white opacity-0 
                     invisible cursor-pointer transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:visible"
                >
                    <FaRegHeart />
                </div>
            </div>
            <div className="pt-[15px]">
                <div className="mb-2 text-primary-600 gap-3 flex items-center justify-start flex-wrap">
                    <div
                        className='pr-[10px] relative flex items-center justify-start gap-[7px]
                        after:absolute after:content-[""] after:right-0 after:w-[1px] after:h-4 after:bg-primary-100'
                    >
                        <Image src={timeTableIcon} alt="" />
                        <p>11 Lessons</p>
                    </div>
                    <div className="pr-[10px] relative flex items-center justify-start gap-[7px]">
                        <Image src={hourIcon} alt="" />
                        <p>16 hours</p>
                    </div>
                </div>
                <h6 className="mb-[10px] line-clamp-2 font-medium text-base leading-7">
                    <Link
                        href="#!"
                        className="bg-no-repeat bg-[length:0_100%] bg-[position-y:0px] bg-gradient-to-b from-transparent 
                    from-[calc(100%-1px)] to-current to-[1px] transition-all duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)] 
                    backface-hidden group-hover:bg-[length:100%_100%] group-hover:delay-300 hover:text-accent-600"
                    >
                        Become a Certified Web Developer: HTML, CSS and JavaScript
                    </Link>
                </h6>
                <div className="mb-[8px] flex items-center gap-[7px]">
                    <span>4.9</span>
                    <div className="flex items-center relative gap-[6px] pb-[2px]">
                        <Image src={starIcon} alt="" />
                        <Image src={starIcon} alt="" />
                        <Image src={starIcon} alt="" />
                        <Image src={starIcon} alt="" />
                        <Image src={starOutlineIcon} alt="" />
                    </div>
                    <span>(230)</span>
                </div>
                {/* Conditional Progress Bar */}
                {isProgress && (
                    <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-1.5 my-3">
                            <div className="bg-accent-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex text-[15px] text-primary-800 mt-1 items-center justify-between pb-2">
                            <p>Complete</p>
                            <p>{progress}%</p>
                        </div>
                    </div>
                )}
                {!isProgress && (
                    <>
                        <div className="text-primary-600 mb-[13px]">
                            By:{' '}
                            <Link href="#!" className="hover:text-accent-600 transition-colors duration-300">
                                Carolyn Welborn
                            </Link>
                        </div>
                        <div className="flex items-center justify-between border-t border-primary-100 pt-[13px]">
                            <h6 className="text-accent-600 font-medium text-base leading-7">$89.29</h6>
                            <Link
                                href="#!"
                                className="flex items-center justify-center w-max gap-[10px] font-medium text-base leading-7
                                            transition-colors cursor-pointer duration-300 hover:text-accent-600"
                            >
                                <span className="font-medium">Enroll Course</span>
                                <GoArrowUpRight />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export function CourseHorizontalCard({course }: CourseHorizontalCard) {
    return (
        <div className="group flex gap-5 pb-5 mb-5 border-b border-primary-100">
            <div className="h-[240px] w-[320px] relative rounded-sm overflow-hidden flex-shrink-0">
                <Image
                    src={img}
                    alt=""
                    className="w-full h-full object-cover transition-all duration-1000 ease-in-out 
                        group-hover:scale-110 group-hover:transition-all group-hover:duration-1000 group-hover:ease-in-out"
                />
                <div
                    className="absolute top-[10px] right-[10px] flex items-center justify-center w-[35px] h-[35px] rounded-full
                     bg-[rgba(19,24,54,0.302)] shadow-[0px_6px_15px_0px_rgba(64,79,104,0.051)] text-white opacity-0 
                     invisible cursor-pointer transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:visible"
                >
                    <FaRegHeart />
                </div>
            </div>
            <div className="w-full">
                <div className="flex items-center justify-between flex-wrap mt-[-8px] mb-[6px]">
                    <div className="text-primary-600 gap-3 flex items-center justify-start flex-wrap">
                        <div
                            className='pr-[10px] relative flex items-center justify-start gap-[7px]
                            after:absolute after:content-[""] after:right-0 after:w-[1px] after:h-4 after:bg-primary-100'
                        >
                            <Image src={timeTableIcon} className="relative bottom-[1px]" alt="" />
                            <p>{course?.courseData?.length} Lessons</p>
                        </div>
                        <div
                            className='pr-[10px] relative flex items-center justify-start gap-[7px]
                            after:absolute after:content-[""] after:right-0 after:w-[1px] after:h-4 after:bg-primary-100'
                        >
                            <Image src={studentsIcon} className="relative bottom-[1px]" alt="" />
                            <p>229 Students</p>
                        </div>
                        <div className="pr-[10px] relative flex items-center justify-start gap-[7px]">
                            <Image src={hourIcon} className="relative bottom-[1px]" alt="" />
                            <p>16 hours</p>
                        </div>
                    </div>
                    <div className="text-accent-600 font-medium text-lg leading-7">${course?.price}</div>
                </div>
                <h6 className="mb-[10px] line-clamp-2 font-medium text-base leading-7">
                    <Link
                        href="#!"
                        className="text-lg bg-no-repeat bg-[length:0_100%] bg-[position-y:0px] bg-gradient-to-b from-transparent 
                    from-[calc(100%-1px)] to-current to-[1px] transition-all duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)] 
                    backface-hidden group-hover:bg-[length:100%_100%] group-hover:delay-300 hover:text-accent-600"
                    >
                        {course?.name}
                    </Link>
                </h6>
                <p className="mb-[10px] text-sm leading-7 max-w-[80%]">
                    {course?.description?.length > 100 ? course.description.slice(0, 100) + '...' : course.description}
                </p>
                <div className="mb-[8px] flex items-center gap-[7px]">
                    <span>{course.rating}</span>
                    <div className="flex items-center relative gap-[7px] pb-[2px]">
                        <Image src={starIcon} alt="" />
                        <Image src={starIcon} alt="" />
                        <Image src={starIcon} alt="" />
                        <Image src={starIcon} alt="" />
                        <Image src={starOutlineIcon} alt="" />
                    </div>
                    <span>(230)</span>
                </div>
                <div className="text-primary-600 mb-[13px]">
                    By:{' '}
                    <Link href="#!" className="hover:text-accent-600 transition-colors duration-300">
                        Carolyn Welborn
                    </Link>
                </div>
                <div className="flex items-center justify-between border-t border-primary-100 pt-[13px]">
                    <Link
                        href="#!"
                        className="flex items-center justify-center w-max gap-[10px] font-medium text-base leading-7
                        transition-colors cursor-pointer duration-300 hover:text-accent-600"
                    >
                        <span className="font-medium">Enroll Course</span>
                        <GoArrowUpRight />
                    </Link>
                </div>
            </div>
        </div>
    );
}
