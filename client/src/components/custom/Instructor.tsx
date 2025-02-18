import Image from 'next/image';
import { DM_Sans } from 'next/font/google';
import img from '@/public/assets/images/instructors/instructors-01.jpg';
import studentTotal from '@/public/assets/icons/student-total.svg';
import play from '@/public/assets/icons/play.svg';
import star from '@/public/assets/icons/star.svg';
import { cn } from '@/utils/helpers';

const dmSans = DM_Sans({ subsets: ['latin'] });

export default function InstructorCard({ isHorizontal = false }) {
    return (
        <div className={cn('bg-white  text-left', isHorizontal ? 'flex w-full items-center ' : 'w-full sm:w-80')}>
            <div
                className={cn(
                    'relative overflow-hidden',
                    isHorizontal ? 'w-25 h-25 flex-shrink-0' : 'w-full h-48 sm:h-64'
                )}
            >
                <div className="group  overflow-hidden rounded-xl">
                    <Image
                        className="w-[100px] h-[100px] object-cover transition duration-1000 group-hover:scale-125"
                        src={img}
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
                <div className="flex mb-[4px] text-[#585d69] ">
                    <div className="flex items-center gap-[5px]">
                        <Image src={studentTotal} alt="studentTotal" className="w-[14px] h-[14px]" />
                        <p className="font-normal text-sm leading-6">345 Students</p>
                        <span className="text-[#e4e4e7] after:top-[-9px] pr-[5px]">|</span>
                    </div>
                    <div className="flex items-center gap-[8px]">
                        <Image src={play} alt="play" className="w-[14px] h-[14px]" />
                        <p className="font-normal text-sm leading-6">34 Courses</p>
                    </div>
                </div>
                <div className="text-left">
                    <h3 className="text-base font-medium leading-6 mb-1">Sarah</h3>
                </div>
                <p className="text-sm text-gray-600 font-normal text-left mb-1">Professional Web Developer</p>

                <div className="flex items-center text-sm  text-left">
                    <div className="text-black-300">4.9</div>
                    <Image className="relative bottom-[1px] ml-2" src={star} alt="star rating" width={12} height={12} />
                </div>
            </div>
        </div>
    );
}
