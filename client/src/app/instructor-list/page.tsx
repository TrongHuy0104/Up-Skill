import React from 'react';
import Search from './_component/SearchBar';
import Banner from './_component/BannerInstructor';
import Sort from './_component/Sort';
import InstructorList from './_component/InstructorsList';

export default function page() {
    return (
        <div className="pb-[160px]">
            <Banner />
            <div className="flex justify-between w-[1400px] px-[14px] mx-auto  pt-[60px] pb-[40px]">
                <Search />
                <Sort />
            </div>
            <InstructorList />
        </div>
    );
}
