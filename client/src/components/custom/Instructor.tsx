import Image from 'next/image';
import { DM_Sans } from 'next/font/google';
import img from '@/public/assets/images/instructors/instructors-01.jpg';
import studentTotal from '@/public/assets/icons/student-total.svg';
import play from '@/public/assets/icons/play.svg';
import star from '@/public/assets/icons/star.svg';
import { cn } from '@/utils/helpers';

interface InstructorCardProps {
    isHorizontal?: boolean; // Optional: Layout type
    width?: string; // Optional: Custom width
    name?: string; // Instructor's name
    jobTitle?: string; // Instructor's job title
    rating?: number; // Instructor's rating
    students?: number; // Number of students
    courses?: number; // Number of courses
    imageUrl?: string; // URL of the instructor's image
}

const dmSans = DM_Sans({ subsets: ['latin'] });

export default function InstructorCard({
    isHorizontal = false,
    width = '260px',
    name = 'Sarah', // Default name
    jobTitle = 'Professional Web Developer', // Default job title
    rating = 4.9, // Default rating
    students = 345, // Default number of students
    courses = 34, // Default number of courses
    imageUrl = img.src, // Default image URL
}: InstructorCardProps) {
    return (
        <div className={cn('bg-white text-left', isHorizontal ? 'flex w-full items-center' : 'w-full')}>
            <div
                className={cn(
                    'relative overflow-hidden',
                    isHorizontal ? 'w-25 h-25 flex-shrink-0' : 'w-full h-48 sm:h-64'
                )}
            >
                <div className="group overflow-hidden rounded-xl">
                    <Image
                        className="object-cover transition duration-1000 group-hover:scale-125"
                        style={{ width }}
                        src={imageUrl}
                        alt={name}
                        width={260} // Set appropriate width
                        height={190} // Set appropriate height
                    />
                </div>
            </div>
            <div
                className={cn(
                    dmSans.className,
                    isHorizontal
                        ? 'pl-4 flex flex-col justify-center flex-1'
                        : 'pt-[8px] pb-[8px] border-b-[1px] border-gray-200'
                )}
            >
                <div className="flex mb-[4px] text-[#585d69]">
                    <div className="flex items-center gap-[5px]">
                        <Image src={studentTotal} alt="studentTotal" className="w-[14px] h-[14px]" />
                        <p className="font-normal text-sm leading-6">{students} Students</p>
                        <span className="text-[#e4e4e7] after:top-[-9px] pr-[5px]">|</span>
                    </div>
                    <div className="flex items-center gap-[8px]">
                        <Image src={play} alt="play" className="w-[14px] h-[14px]" />
                        <p className="font-normal text-sm leading-6">{courses} Courses</p>
                    </div>
                </div>
                <div className="text-left">
                    <h3 className="text-base font-medium leading-6 mb-1">{name}</h3>
                </div>
                <p className="text-sm text-gray-600 font-normal text-left mb-1">{jobTitle}</p>

                <div className="flex items-center text-sm text-left">
                    <div className="text-black-300">{rating}</div>
                    <Image
                        className="relative bottom-[1px] ml-2"
                        src={star}
                        alt="star rating"
                        width={12}
                        height={12}
                    />
                </div>
            </div>
        </div>
    );
}