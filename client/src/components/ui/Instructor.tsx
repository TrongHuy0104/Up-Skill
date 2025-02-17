import Image from 'next/image';
import { DM_Sans } from 'next/font/google';
import { cn } from '@/utils/helpers';
import studentTotal from '@/public/assets/icons/student-total.svg';
import play from '@/public/assets/icons/play.svg';
import star from '@/public/assets/icons/star.svg';
import ava from '@/public/assets/images/instructors/instructors-01.jpg';

const dmSans = DM_Sans({ subsets: ['latin'] });
// Định nghĩa kiểu dữ liệu cho instructor
interface Instructor {
    name: string;
    avatar?: string; // Có thể không có avatar, nên đánh dấu là optional
    students: number;
    courses: number;
    rating: number;
    profession: string;
}

export default function InstructorCard({
    instructor,
    isHorizontal = false
}: {
    instructor: Instructor;
    isHorizontal?: boolean;
}) {
    // Lấy các dữ liệu instructor từ props
    const { name, avatar, students, courses, rating, profession } = instructor;

    return (
        <div className={cn('bg-white text-left', isHorizontal ? 'flex w-full items-center' : 'w-full sm:w-64')}>
            <div
                className={cn(
                    'relative overflow-hidden',
                    isHorizontal ? 'w-25 h-25 flex-shrink-0' : 'w-full h-48 sm:h-64'
                )}
            >
                <div className="group overflow-hidden rounded-sm">
                    {/* Hiển thị ảnh của instructor */}
                    <Image
                        className="w-full h-full object-cover transition duration-1000 group-hover:scale-125"
                        src={avatar || ava} // Dự phòng ảnh nếu không có avatar
                        alt="Instructor"
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
                <p className="text-sm text-gray-600 font-normal text-left mb-1">{profession}</p>

                <div className="flex items-center text-sm text-left">
                    <div className="text-black-300">{rating}</div>
                    <Image className="relative bottom-[1px] ml-2" src={star} alt="star rating" width={12} height={12} />
                </div>
            </div>
        </div>
    );
}
