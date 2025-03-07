import React from 'react';
import { Metadata } from 'next';
import Search from './_component/SearchBar';
import Banner from './_component/BannerInstructor';
import Sort from './_component/Sort';
import InstructorListWrapper from './_component/InstructorListWrapper';

export const metadata: Metadata = {
    title: 'Instructor List',
    description: 'Browse and sort instructors'
};

export default function Page() {
    return (
        <div className="pb-[160px]">
            <Banner />
            <div className="flex justify-between w-[1400px]  mx-auto pt-[60px] pb-[40px]">
                <Search />
                <Sort />
            </div>
            {/* Dùng Client Component để fetch dữ liệu dựa trên `sortType` */}
            <InstructorListWrapper />
        </div>
    );
}
