// page.tsx
import React from 'react';
import Search from './_component/SearchBar';
import Banner from './_component/BannerInstructor';
import Sort from './_component/Sort';
import InstructorList from './_component/InstructorsList';

export default async function page() {
    // Gọi API để lấy dữ liệu instructors
    const res = await fetch('http://localhost:8000/api/user/get-instructors');
    const instructors = await res.json();

    return (
        <div className="pb-[160px]">
            <Banner />
            <div className="flex justify-between w-[1400px] px-[14px] mx-auto  pt-[60px] pb-[40px]">
                <Search />
                <Sort />
            </div>
            <InstructorList instructors={instructors.instructors} />
        </div>
    );
}
