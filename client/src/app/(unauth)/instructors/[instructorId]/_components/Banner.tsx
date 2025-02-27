import React from 'react';
import Image from 'next/image';
import star from '@/public/assets/icons/star-outline.svg';
import timeTable from '@/public/assets/icons/timetable.svg';
import student from '@/public/assets/icons/students.svg';
import Bannerr from '@/components/ui/Banner';
import { User } from '@/types/User';
import { cookies } from 'next/headers';
interface Props {
    readonly user: User;
}

export default async function Banner({ user }: Props) {
    console.log('user,', user);
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();

    const res = await fetch(`http://localhost:8000/api/user/total-upload-courses`, {
        credentials: 'include',
        headers: {
            Cookie: cookie // Pass the cookies in the headers
        }
    });

    // Đảm bảo tên trường trả về là 'uploadedCoursesCount' thay vì 'count'
    const { uploadedCoursesCount } = await res.json();

    return (
        <div>
            <Bannerr
                title={`Hi, I Am ${user.name}`}
                breadcrumbs={[
                    { href: '/', text: 'Development' },
                    { href: '/', text: 'Web Development' }
                ]}
                contentAlignment="left"
                background="https://creativelayers.net/themes/upskill-html/images/page-title/inner-page.png"
            >
                <p className="text-primary-800 mb-6">Developer and Teacher</p>
                <div className="flex items-center text-primary-800 mt-2 pb-4">
                    <Image alt="Star Icon" src={star} />
                    <span className="pl-[6px] pr-6"> {user!.rating.toString()}</span>
                    <Image alt="Time Table Icon" src={timeTable} width={20} height={20} />
                    <span className="pl-[6px] pr-6"> {uploadedCoursesCount} Lessons</span>
                    <Image alt="Student Icon" src={student} />
                    <span className="pl-[6px] pr-6"> 229 Students</span>
                </div>
            </Bannerr>
        </div>
    );
}
