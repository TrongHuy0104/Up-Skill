import Image from 'next/image';
import { DM_Sans } from 'next/font/google';
import img from '@/public/assets/images/instructors/instructors-01.jpg';
import studentTotal from '@/public/assets/icons/student-total.svg';
import play from '@/public/assets/icons/play.svg';
import star from '@/public/assets/icons/star.svg';
import starOutlineIcon from '@/public/assets/icons/star-outline.svg';
import { cn } from '@/utils/helpers';

const dmSans = DM_Sans({ subsets: ['latin'] });

interface InstructorCardProps {
    readonly isHorizontal?: boolean; // Optional: Layout type
    readonly width?: string; // Optional: Custom width
    readonly instructor?: {
        name?: string; // Instructor's name
        role?: string; // Instructor's role (used as jobTitle)
        averageRating?: number; // Instructor's average rating
        totalStudents?: number; // Total number of students
        uploadedCoursesCount?: number; // Total number of courses
        imageUrl?: string; // URL of the instructor's avatar
        _id?: string; // Instructor's ID
    };
}

export default function InstructorCard({
    isHorizontal = false,
    width = '260px',
    instructor = {}, // Default to an empty object
}: InstructorCardProps) {
    // Destructure instructor properties with default values
    const {
        name = 'Instructor Name',
        role = 'Instructor', // Use role as jobTitle
        averageRating = 0,
        totalStudents = 0,
        uploadedCoursesCount = 0,
        imageUrl = img.src, // Default image URL
    } = instructor;

    return (
        <div className={cn('bg-white text-left', isHorizontal ? 'flex w-full items-center' : 'w-full')}>
            {/* Image Section */}
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

            {/* Content Section */}
            <div
                className={cn(
                    dmSans.className,
                    isHorizontal
                        ? 'pl-4 flex flex-col justify-center flex-1'
                        : 'pt-[8px] pb-[8px] border-b-[1px] border-gray-200'
                )}
            >
                {/* Students and Courses */}
                <div className="flex mb-[4px] text-[#585d69]">
                    <div className="flex items-center gap-[5px]">
                        <Image src={studentTotal} alt="studentTotal" className="w-[14px] h-[14px]" />
                        <p className="font-normal text-sm leading-6">{totalStudents} Students</p>
                        <span className="text-[#e4e4e7] after:top-[-9px] pr-[5px]">|</span>
                    </div>
                    <div className="flex items-center gap-[8px]">
                        <Image src={play} alt="play" className="w-[14px] h-[14px]" />
                        <p className="font-normal text-sm leading-6">{uploadedCoursesCount} Courses</p>
                    </div>
                </div>

                {/* Name */}
                <div className="text-left">
                    <h3 className="text-base font-medium leading-6 mb-1">{name}</h3>
                </div>

                {/* Job Title (using role) */}
                <p className="text-sm text-gray-600 font-normal text-left mb-1">{role}</p>

                {/* Rating */}
                <div className="flex items-center relative gap-[6px] pb-[2px]">
                <span >{averageRating.toFixed(1)}</span>
                        {[...Array(5)].map((_, index) => (
                            <Image
                                key={index}
                                src={index < Math.floor(averageRating) ? star : starOutlineIcon}
                                alt={index < Math.floor(averageRating) ? 'Filled Star' : 'Outline Star'}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}