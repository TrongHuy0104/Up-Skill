'use client';
import Search from "@/components/common/Search";
import SortBy from "./_components/SortBy";
import CourseVerticalCard from "@/components/ui/CourseCard";
import PaginationComponent from "@/components/ui/PaginationComponent";
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
const sortOptions = [
    { value: "date_created", label: "Date Created" },
    { value: "oldest", label: "Oldest" },
    { value: "3_days", label: "3 days" },
];

export default function Page() {
    // pagination
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className="px-10 py-10 ml-auto max-w-[1000px] border-[1px] border-primary-100 rounded-xl">
                <div className="row -mx-3">
                    <div className="flex items-center justify-center gap-5 pb-8">
                        <Search />
                        <SortBy options={sortOptions} defaultValue="Date Created" />
                    </div>
                </div>
                <Tabs className="px-1" defaultValue="enrolled">
                    <TabsList>
                        <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
                        <TabsTrigger value="active">Active Courses</TabsTrigger>
                        <TabsTrigger value="completed">Completed Courses</TabsTrigger>
                    </TabsList>

                    <TabsContent value="enrolled">
                        <p className="text-gray-700">Here are your enrolled courses.</p>
                    </TabsContent>
                    <TabsContent value="active">
                        <p className="text-gray-700">These are your active courses.</p>
                    </TabsContent>
                    <TabsContent value="completed">
                        <p className="text-gray-700">You have completed these courses.</p>
                    </TabsContent>
                </Tabs>
                <div className="row flex flex-wrap -mx-3 px-4 gap-[26px]">
                    <CourseVerticalCard isProgress={true} progress={70} />
                    <CourseVerticalCard isProgress={true} progress={70} />
                    <CourseVerticalCard isProgress={true} progress={70} />
                    <CourseVerticalCard isProgress={true} progress={70} />
                    <CourseVerticalCard isProgress={true} progress={70} />
                    <CourseVerticalCard isProgress={true} progress={70} />
                </div>


                {/* Pagination */}
                <div className="p-5">
                    <PaginationComponent currentPage={currentPage} totalPages={10} onPageChange={handlePageChange} />
                </div>
            </div>

        </>
    );
}
