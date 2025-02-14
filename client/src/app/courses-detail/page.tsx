import React from 'react';
import Banner from './_component/Banner';
import CoursesInfor from './_component/CoursesInfor';
import Review from './_component/Review';
import SideBar from './_component/SideBar';
import CoursesContent from './_component/CoursesContent';
import CoursesDetailLine from '@/components/ui/CoursesDetailLine';

export default function page() {
    return (
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-24 py-10">
            <div className="left-content ml-7">
                <Banner />
                <CoursesDetailLine />
                <CoursesInfor />
                <CoursesDetailLine />

                <CoursesContent />
                <CoursesDetailLine />

                <Review />
            </div>
            <div className="right-content w-full md:w-1/3 ">
                <div className="sticky top-0">
                    <SideBar />
                </div>
            </div>
        </div>
    );
}
