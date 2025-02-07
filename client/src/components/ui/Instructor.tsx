import Image from 'next/image';
import { DM_Sans } from 'next/font/google';
import img from '@/public/assets/images/instructors/instructors-01.jpg';
import studentTotal from '@/public/assets/icons/student-total.svg';
import play from '@/public/assets/icons/play.svg';
import star from '@/public/assets/icons/star.svg';
import { cn } from '@/utils/helpers';

const dmSans = DM_Sans({ subsets: ['latin'] });

export default function InstructorCard({ isHorizontal = false}) {
    return (
        <div className={cn("bg-white p-4 sm:p-6 text-left", isHorizontal ? "flex w-full items-center" : "w-full sm:w-80")}> 
            <div className={cn("relative overflow-hidden", isHorizontal ? "w-32 h-32 flex-shrink-0" : "w-full h-48 sm:h-64")}> 
                <div className="group w-full h-full overflow-hidden rounded-sm">
                    <Image
                        className="w-full h-full object-cover transition duration-1000 group-hover:scale-125"
                        src={img}
                        alt="Instructor"
                    />
                </div>
            </div>
            <div className={cn(dmSans.className, isHorizontal ? "pl-6 flex flex-col justify-center flex-1" : "pt-[8px] pb-[8px] border-b-[1px] border-gray-200")}> 
                <div className="flex mb-[4px] text-[#585d69] gap-[20px]">
                    <div className="flex items-center gap-[10px]">
                        <Image src={studentTotal} alt="studentTotal" />
                        <p className="font-normal text-sm leading-7">345 Students</p>
                        <span className="text-[#e4e4e7] after:top-[-9px]">|</span>
                    </div>
                    <div className="flex items-center gap-[8px]">
                        <Image src={play} alt="play" />
                        <p className="font-normal text-sm leading-7">34 Courses</p>
                    </div>
                </div>
                <div className="text-left">
                    <p className="font-sans text-base font-medium leading-5 mb-3">Sarah</p>
                </div>
                <p className="text-sm text-gray-600 font-normal text-left">Professional Web Developer</p>

                <div className="flex items-center text-sm h-12 text-left">
                    <div className="text-black-300">4.9</div>
                    <Image className="ml-2" src={star} alt="star rating" width={12} height={12} />
                </div>
            </div>
        </div>
    );
}
