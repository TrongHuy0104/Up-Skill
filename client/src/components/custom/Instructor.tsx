import Image from 'next/image';
import { DM_Sans } from 'next/font/google';
import img from '@/public/assets/images/instructors/instructors-01.jpg';
import studentTotal from '@/public/assets/icons/student-total.svg';
import play from '@/public/assets/icons/play.svg';
import star from '@/public/assets/icons/star.svg';
import starOutlineIcon from '@/public/assets/icons/star-outline.svg';
import { cn } from '@/utils/helpers';
import Link from 'next/link';

const dmSans = DM_Sans({ subsets: ['latin'] });

interface InstructorCardProps {
    readonly isHorizontal?: boolean; // Optional: Layout type
    readonly width?: string; // Optional: Custom width
    readonly instructor?: {
        name?: string; // Instructor's name
        rating?: number; // Instructor's average rating
        totalStudents?: number; // Total number of students
        uploadedCoursesCount?: number; // Total number of courses
        imageUrl?: string; // URL of the instructor's avatar
        avatar?: { url?: string };
        _id?: string; // Instructor's ID
        profession?: string;
        uploadedCourses?: { _id: string }[];
    };
}

export default function InstructorCard({
    isHorizontal = false,
    width = '260px',
    instructor = {} // Default to an empty object
}: InstructorCardProps) {
    // Destructure instructor properties with default values
    const {
        name = 'Instructor Name',
        profession = 'Instructor', // Use role as jobTitle
        rating = 0,
        totalStudents = 0,
        uploadedCoursesCount = instructor?.uploadedCourses?.length || 0,
        imageUrl = instructor?.avatar?.url || img.src // Default image URL
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
                    <Link href={`/instructors/${instructor._id}`}>
                        <Image
                            className="object-cover transition duration-1000 group-hover:scale-125"
                            style={{ width }}
                            src={instructor.imageUrl || imageUrl}
                            alt={name}
                            width={260} // Set appropriate width
                            height={190} // Set appropriate height
                        />
                    </Link>
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

                <h6 className="mb-[10px] line-clamp-1 font-medium text-base leading-6">
                    <Link
                        href={`/instructors/${instructor._id}`}
                        className="bg-no-repeat bg-[length:0_100%] bg-[position-y:0px] bg-gradient-to-b from-transparent 
                    from-[calc(100%-1px)] to-current to-[1px] transition-all duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)] 
                    backface-hidden group-hover:bg-[length:100%_100%] group-hover:delay-300 hover:text-accent-600"
                    >
                        {name}
                    </Link>
                </h6>

                {/* Job Title (using role) */}
                <p className="text-sm text-gray-600 font-normal text-left mb-1">{profession}</p>

                {/* Rating */}
                <div className="flex items-center relative gap-[6px] pb-[2px]">
                    <span>{instructor?.rating?.toFixed(1)}</span>
                    {[...Array(5)].map((_, index) => (
                        <Image
                            key={index}
                            src={index < Math.floor(rating) ? star : starOutlineIcon}
                            alt={index < Math.floor(rating) ? 'Filled Star' : 'Outline Star'}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
