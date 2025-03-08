import Image from 'next/image';
import { GoArrowUpRight } from 'react-icons/go';
import Link from 'next/link';
import { FaRegHeart } from 'react-icons/fa';

import defaultImage from '@/public/assets/images/courses/courses-01.jpg';
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
    readonly course?: any;
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
    height = '190px',
    course = {}
}: CourseVerticalCardProps) {
    const {
        thumbnail = defaultImage.src,
        name = 'Become a Certified Web Developer: HTML, CSS and JavaScript',
        lessonsCount = 11,
        duration = '16',
        rating = 0,
        reviews = 0,
        authorId = null,
        price = 0,
        isEnrolled = false,
        _id
    } = course;

    return (
        <div className="group shrink-0 h-full relative transition-transform" style={{ width }}>
            <div className="relative rounded-sm overflow-hidden" style={{ height }}>
                <Link href={`/courses/${_id}`}>
                    <Image
                        src={thumbnail?.url || defaultImage}
                        alt={name}
                        className="w-full h-full object-cover transition-all duration-1000 ease-in-out 
                        group-hover:scale-110 group-hover:transition-all group-hover:duration-1000 group-hover:ease-in-out"
                        width={parseInt(width, 10)}
                        height={parseInt(height, 10)}
                    />
                </Link>
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
                        <Image src={timeTableIcon} alt="Lessons" />
                        <p>{lessonsCount} Lessons</p>
                    </div>
                    <div className="pr-[10px] relative flex items-center justify-start gap-[7px]">
                        <Image src={hourIcon} alt="Duration" />
                        <p>{duration}</p>
                    </div>
                </div>
                <h6 className="mb-[10px] line-clamp-1 font-medium text-base leading-7">
                    <Link
                        href={`/courses/${_id}`}
                        className="bg-no-repeat bg-[length:0_100%] bg-[position-y:0px] bg-gradient-to-b from-transparent 
                    from-[calc(100%-1px)] to-current to-[1px] transition-all duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)] 
                    backface-hidden group-hover:bg-[length:100%_100%] group-hover:delay-300 hover:text-accent-600"
                    >
                        {name}
                    </Link>
                </h6>
                <div className="mb-[8px] flex items-center gap-[7px]">
                    <span>{rating.toFixed(1)}</span>
                    <div className="flex items-center relative gap-[6px] pb-[2px]">
                        {[...Array(5)].map((_, index) => (
                            <Image
                                key={index}
                                src={index < Math.floor(rating) ? starIcon : starOutlineIcon}
                                alt={index < Math.floor(rating) ? 'Filled Star' : 'Outline Star'}
                            />
                        ))}
                    </div>
                    <span>({reviews.length})</span>
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
                            <Link
                                href={`/instructors/${course?.authorId?._id}`}
                                className="hover:text-accent-600 transition-colors duration-300"
                            >
                                {authorId?.name || 'Unknown Instructor'}
                            </Link>
                        </div>
                        <div className="flex items-center justify-between border-t border-primary-100 pt-[13px]">
                            <h6 className="text-accent-600 font-medium text-base leading-7">${price.toFixed(2)}</h6>
                            <Link
                                href="#!"
                                className="flex items-center justify-center w-max gap-[10px] font-medium text-base leading-7
                                            transition-colors cursor-pointer duration-300 hover:text-accent-600"
                            >
                                <span className="font-medium">{isEnrolled ? 'Continue' : 'Enroll Course'}</span>
                                <GoArrowUpRight />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export function CourseHorizontalCard({ course, width = '320px', height = '240px' }: CourseHorizontalCard) {
    return (
        <div className="group flex gap-5 pb-5 mb-5 border-b border-primary-100">
            {/* Course Image */}
            <div className="h-[240px] w-[320px] relative rounded-sm overflow-hidden flex-shrink-0">
                <Link href={`/courses/${course?._id}`}>
                    <Image
                        src={course?.thumbnail?.url || defaultImage}
                        alt={course?.name}
                        className="w-full h-full object-cover transition-all duration-1000 ease-in-out 
                        group-hover:scale-110"
                        width={parseInt(width, 10)}
                        height={parseInt(height, 10)}
                    />
                </Link>
                <div
                    className="absolute top-[10px] right-[10px] flex items-center justify-center w-[35px] h-[35px] rounded-full
                     bg-[rgba(19,24,54,0.302)] shadow-[0px_6px_15px_0px_rgba(64,79,104,0.051)] text-white opacity-0 
                     invisible cursor-pointer transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:visible"
                >
                    <FaRegHeart />
                </div>
            </div>

            {/* Course Details */}
            <div className="w-full">
                {/* Lessons, Students, Duration */}
                <div className="flex items-center justify-between flex-wrap mt-[-8px] mb-[6px]">
                    <div className="text-primary-600 gap-3 flex items-center justify-start flex-wrap">
                        <div
                            className='pr-[10px] relative flex items-center justify-start gap-[7px]
                            after:absolute after:content-[""] after:right-0 after:w-[1px] after:h-4 after:bg-primary-100'
                        >
                            <Image src={timeTableIcon} className="relative bottom-[1px]" alt="" />
                            <p>{course?.courseData?.length} Lessons</p>
                        </div>
                        <div className="pr-[10px] relative flex items-center justify-start gap-[7px] after:absolute after:right-0 after:w-[1px] after:h-4 after:bg-primary-100">
                            <Image src={studentsIcon} className="relative bottom-[1px]" alt="Students" />
                            <p>{course?.purchased} Students</p>
                        </div>
                        <div className="pr-[10px] relative flex items-center justify-start gap-[7px]">
                            <Image src={hourIcon} className="relative bottom-[1px]" alt="Duration" />
                            <p>
                                {(
                                    course?.courseData?.reduce((total, item) => total + (item?.videoLength || 0), 0) /
                                    60
                                ).toFixed(1)}{' '}
                                hour
                            </p>
                        </div>
                    </div>
                    <div className="text-accent-600 font-medium text-lg leading-7">${course?.price}</div>
                </div>

                {/* Course Title */}
                <h6 className="mb-[10px] line-clamp-2 font-medium text-base leading-7">
                    <Link
                        href={`/courses/${course?._id}`}
                        className="text-lg bg-no-repeat bg-[length:0_100%] bg-[position-y:0px] bg-gradient-to-b from-transparent 
                        from-[calc(100%-1px)] to-current to-[1px] transition-all duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)] 
                        backface-hidden group-hover:bg-[length:100%_100%] group-hover:delay-300 hover:text-accent-600"
                    >
                        {course?.name}
                    </Link>
                </h6>
                <p className="mb-[10px] text-sm leading-7 max-w-[80%] break-all">
                    {course?.description
                        ? course.description.slice(0, 100) + (course.description.length > 100 ? '...' : '')
                        : ''}
                </p>
                <div className="mb-[8px] flex items-center gap-[7px]">
                    <span>{course.rating}</span>
                    <div className="flex items-center relative gap-[7px] pb-[2px]">
                        {[...Array(5)].map((_, index) => (
                            <Image
                                key={index}
                                src={index < Math.round(course?.rating) ? starIcon : starOutlineIcon}
                                alt={index < Math.round(course?.rating) ? 'Filled Star' : 'Outline Star'}
                            />
                        ))}
                    </div>
                    <span>{`(${course?.reviews?.length})`}</span>
                </div>

                {/* Instructor Name */}
                <div className="text-primary-600 mb-[13px]">
                    By:{' '}
                    <Link
                        href={`/instructors/${course?.authorId?._id}`}
                        className="hover:text-accent-600 transition-colors duration-300"
                    >
                        {course?.authorId?.name || 'Unknown Instructor'}
                    </Link>
                </div>

                {/* Enroll Button */}
                <div className="flex items-center justify-between border-t border-primary-100 pt-[13px]">
                    <Link
                        href={`/courses/${course?._id}`}
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
