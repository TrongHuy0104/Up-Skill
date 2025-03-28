'use client';

import React, { useState, useMemo } from 'react';
import SortBy from './SortBy';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import Search from '@/components/custom/Search';
import CourseVerticalCard from '@/components/custom/CourseCard';
import { useGetAllCoursesProgressQuery } from '@/lib/redux/features/progress/progressApi';
import Spinner from '@/components/custom/Spinner';
import PaginationComponent from '@/components/custom/PaginationComponent';

const PAGE_SIZE = 6;

const ClientCourseTabs = () => {
    const { data, isLoading, isError } = useGetAllCoursesProgressQuery(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('date_created');

    const sortOptions = [
        { value: 'date_created', label: 'Date Created' },
        { value: 'oldest', label: 'Oldest' },
        { value: '3_days', label: '3 days' }
    ];

    // Gọi useMemo HOẶC xử lý fallback dữ liệu TRƯỚC
    const allCourses = useMemo(() => {
        if (!data?.data) return [];

        // Clone và sort theo lựa chọn
        const sorted = [...data.data].sort((a, b) => {
            if (sortBy === 'date_created') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            if (sortBy === 'oldest') {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
            if (sortBy === '3_days') {
                const now = Date.now();
                const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000;
                return (
                    new Date(b.createdAt).getTime() >= threeDaysAgo ? 1 : -1
                );
            }
            return 0;
        });

        // Format lại dữ liệu cho card
        return sorted.map((course: any) => ({
            _id: course.courseId,
            name: course.courseName,
            progress: course.completionPercentage,
            lessonsCount: course.totalLessons,
            totalCompleted: course.totalCompleted,
            rating: course.rating || 0,
            thumbnail: { url: course.thumbnail },
            reviews: [],
            authorId: {
                _id: course.authorId?._id || '',
                name: course.authorId?.name || 'Unknown Instructor'
            },
            price: course.price || 0,
            isEnrolled: true,
            createdAt: course.createdAt // dùng cho filter 3_days
        }));
    }, [data, sortBy]);


    const courses = useMemo(() => ({
        enrolled: allCourses,
        active: allCourses.filter((c: any) => c.progress < 100),
        completed: allCourses.filter((c: any) => c.progress === 100)
    }), [allCourses]);

    const paginatedCourses = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        const end = currentPage * PAGE_SIZE;
        return {
            enrolled: courses.enrolled.slice(start, end),
            active: courses.active.slice(start, end),
            completed: courses.completed.slice(start, end)
        };
    }, [courses, currentPage]);

    const totalPages = useMemo(() => {
        return Math.ceil(courses.enrolled.length / PAGE_SIZE);
    }, [courses]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    if (isLoading) return <Spinner />;
    if (isError || !data?.data) return <p className="text-center text-red-500">Failed to load courses.</p>;

    const renderCourses = (courseList: any[]) => {
        if (courseList.length === 0) {
            return <p className="text-center text-gray-500">No courses found.</p>;
        }

        return (
            <div
                key={`${sortBy}-${currentPage}`} // mấu chốt: key thay đổi => animate lại
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up transition-all duration-300 animate-cross-fade"
            >
                {courseList.map((course: any) => (
                    <CourseVerticalCard
                        key={course._id}
                        course={course}
                        progress={course.progress}
                        isProgress
                    />
                ))}
            </div>
        );
    };


    return (
        <div className="px-10 py-10 ml-auto max-w-[1000px] border-[1px] border-primary-100 rounded-xl">
            <div className="flex items-center justify-between gap-5 pb-8">
                <Search />
                <SortBy
                    options={sortOptions}
                    defaultValue="Date Created"
                    onChange={(value) => {
                        setSortBy(value);
                        setCurrentPage(1); // reset về page đầu khi sort
                    }}
                />

            </div>

            <Tabs
                defaultValue="enrolled"
                onValueChange={() => setCurrentPage(1)} // reset page khi đổi tab
            >
                <TabsList>
                    <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
                    <TabsTrigger value="active">Active Courses</TabsTrigger>
                    <TabsTrigger value="completed">Completed Courses</TabsTrigger>
                </TabsList>
                <TabsContent value="enrolled">
                    <div className="transition-opacity duration-300 ease-in animate-fade-in-up">
                        {renderCourses(paginatedCourses.enrolled)}
                    </div>
                </TabsContent>
                <TabsContent value="active">
                    <div className="transition-opacity duration-300 ease-in animate-fade-in-up">
                        {renderCourses(paginatedCourses.active)}
                    </div>
                </TabsContent>

                <TabsContent value="completed">
                    <div className="transition-opacity duration-300 ease-in animate-fade-in-up">
                        {renderCourses(paginatedCourses.completed)}
                    </div>
                </TabsContent>

            </Tabs>

            <div className="flex justify-center mt-10 ">
                <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default ClientCourseTabs;
