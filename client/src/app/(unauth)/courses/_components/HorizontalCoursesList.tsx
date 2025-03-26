'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { CourseHorizontalCard } from '@/components/custom/CourseCard';
import PaginationComponent from '@/components/custom/PaginationComponent';
import noData from '@/public/assets/images/courses/no-data.jpg';
import { HorizontalCardSkeleton } from '@/components/ui/Skeleton';
import Sort from './Sort';
import { useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

type Benefit = {
    title: string;
    _id: string;
};

type Prerequisite = {
    title: string;
    _id: string;
};

type CourseData = {
    _id: string;
    title: string;
    description: string;
    videoSection: string;
    videoLength: number;
};

interface Author {
    _id: string;
    name: string;
}
type Thumbnail = {
    public_id: string;
    url: string;
};

export type Course = {
    _id: string;
    name: string;
    thumbnail: Thumbnail;
    description: string;
    authorId: Author;
    price: number;
    estimatedPrice: number;
    tags: string;
    level: string;
    demoUrl: string;
    benefits: Benefit[];
    prerequisites: Prerequisite[];
    courseData: CourseData[];
    rating: number;
    purchased: number;
    reviews: any[];
    __v: number;
};

interface HorizontalCoursesListProps {
    readonly initialCourses: Course[];
    readonly totalPages: number;
    readonly initialTotalCourses: number;
    readonly limit: number;
    readonly page: number;
}

export default function HorizontalCoursesList({
    initialCourses,
    initialTotalCourses,
    totalPages,
    limit,
    page
}: HorizontalCoursesListProps) {
    const [isClient, setIsClient] = useState(false);
    const [currentPage, setCurrentPage] = useState(page);
    const [courses, setCourses] = useState(initialCourses);
    const [isLoading, setIsLoading] = useState(false);
    const [totalCourses, setTotalCourses] = useState(initialTotalCourses);
    const searchParams = useSearchParams();
    const sortType = searchParams.get('sort');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkTablet = () => {
            const width = window.innerWidth;

            setIsTablet(width >= 768 && width < 1024);
        };

        checkTablet();
        window.addEventListener('resize', checkTablet);
        return () => window.removeEventListener('resize', checkTablet);
    }, []);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                if (sortType) {
                    // Nếu có sortType, fetch dữ liệu từ API
                    const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URI}/courses/sort?type=${sortType}`;
                    const res = await fetch(apiUrl);

                    if (!res.ok) {
                        throw new Error(`Failed to fetch courses: ${res.status} ${res.statusText}`);
                    }

                    const data = await res.json();

                    if (!data.courses) {
                        throw new Error('Invalid data format: courses not found');
                    }

                    setCourses(data.courses || []);
                    setTotalCourses(data.courses.length || 0);
                } else {
                    // Nếu không có sortType, sử dụng initialCourses
                    setCourses(initialCourses);
                    setTotalCourses(initialTotalCourses);
                }
            } catch (error) {
                console.error('❌ Fetch Error:', error);
                setCourses([]);
                setTotalCourses(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [sortType, initialCourses, initialTotalCourses]); // Theo dõi thay đổi của sortType, initialCourses và initialTotalCourses

    if (!isClient) {
        return (
            <div className="w-full">
                {[...Array(3)].map((_, index) => (
                    <HorizontalCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    const startIndex = totalCourses === 0 ? 0 : (page - 1) * limit + 1;
    const endIndex = Math.min(page * limit, totalCourses);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="pl-[10px] md:pl-[28px] relative w-full ">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-8 w-full">
                <p className="text-primary-800 mb-4 md:mb-0">
                    Showing {startIndex}-{endIndex} of {totalCourses} Courses
                </p>
                {/* Chỉ hiển thị Sort khi không phải Tablet */}
                {/* {!isTablet && ( */}
                <div className="w-auto max-w-[200px] md:max-w-[250px] md:flex-shrink-0">
                    <Sort />
                </div>
                {/* )} */}
            </div>

            {isLoading && (
                <div className="w-full">
                    {[...Array(3)].map(() => (
                        <HorizontalCardSkeleton key={uuidv4()} />
                    ))}
                </div>
            )}

            {!isLoading && totalCourses === 0 && (
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <Image src={noData} alt="No Courses Found" />
                    <p className="text-primary-600 mt-4">No courses found. Please try a different search.</p>
                </div>
            )}

            {!isLoading &&
                totalCourses > 0 &&
                courses.map((course) => (
                    <div key={course._id} className="w-full md:w-3/4 lg:w-full">
                        <CourseHorizontalCard course={course} />
                    </div>
                ))}
            {/* Pagination */}
            {totalCourses > 0 && (
                <div className="p-5 flex justify-start md:justify-center w-full md:w-2/3 lg:w-full">
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
