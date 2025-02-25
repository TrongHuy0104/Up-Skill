import React from 'react';
import CoursesDetailLine from '@/components/custom/CoursesDetailLine';
import CoursesInfor from './_components/CoursesInfor';
import CoursesContent from './_components/CoursesContent';
import Instructor from './_components/Instructor';
import CoursesList from './_components/CoursesList';
import Review from './_components/Review';
import Sidebar from './_components/SideBar';
import CoursesDetailBanner from './_components/Banner';

export default function page() {
    return (
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-24 py-10">
            <div className="left-content ml-7">
                <CoursesDetailBanner />
                <CoursesDetailLine />

                <CoursesInfor />
                <CoursesDetailLine />

                <CoursesContent />
                <CoursesDetailLine />

                <Instructor />
                <CoursesDetailLine />

                <CoursesList />
                <CoursesDetailLine />

                <Review />
            </div>
            <div className="right-content w-full md:w-1/3 ">
                <div className="sticky top-[20px]">
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}
