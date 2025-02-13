import CoursesDetailBanner from '@/components/CoursesDetailBanner';
import Image from 'next/image';
import star from '@/public/assets/icons/star-outline.svg';
import time from '@/public/assets/icons/hour.svg';
import timeTable from '@/public/assets/icons/timetable.svg';
import student from '@/public/assets/icons/students.svg';
import CoursesDetailInfor from '@/components/CoursesDetailInfor';

const Page = () => {
    return (
        <div>
            <CoursesDetailBanner
                title="The Complete 2024 Web Development Bootcamp"
                breadcrumbs={[
                    { href: '/development', text: 'Development' },
                    { href: '/web-development', text: 'Web Development' }
                ]}
                contentAlignment="left"
                backgroundColor="bg-white"
            >
                <p className="text-primary-800 py-5">
                    Learn: HTML | CSS | JavaScript | Web programming | Web development | Front-end | Responsive | JQuery
                </p>
                <div className="flex items-center text-primary-800 mt-2 pb-4">
                    <Image alt="Star Icon" src={star} />
                    <span className="pl-[6px] pr-6"> 4.9 (315,475 rating)</span>
                    <Image alt="Time Table Icon" src={timeTable} />
                    <span className="pl-[6px] pr-6"> 11 Lessons</span>
                    <Image alt="Student Icon" src={student} />
                    <span className="pl-[6px] pr-6"> 229 Students</span>
                    <Image alt="Time Icon" src={time} />
                    <span className="pl-[6px] pr-6">Last updated 12/2024</span>
                </div>
                <div className="flex items-center mt-4">
                    <Image
                        src="/path-to-author-image.jpg"
                        alt="Instructor"
                        width={40}
                        height={40}
                        className="rounded-full mr-2 border-4 border-white outline outline-[1px] outline-accent-600"
                    />
                    <div className="text-primary-800 flex gap-1">
                        <p>By</p>
                        <div className="hover:text-accent-800 cursor-pointer">Theresa Edin</div>
                        <p>In</p>
                        <div className="hover:text-accent-800 cursor-pointer">Development</div>
                    </div>
                </div>
            </CoursesDetailBanner>

            <CoursesDetailInfor />
        </div>
    );
};

export default Page;
