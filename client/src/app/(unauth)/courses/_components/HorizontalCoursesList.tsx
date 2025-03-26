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
    const [isClient, setIsClient] = useState(false); // Đảm bảo rằng modal chỉ được hiển thị trên client
    const [currentPage, setCurrentPage] = useState(page);
    const [courses, setCourses] = useState(initialCourses);
    const [isLoading, setIsLoading] = useState(false);
    const [totalCourses, setTotalCourses] = useState(initialTotalCourses);
    const searchParams = useSearchParams();
    const sortType = searchParams.get('sort');

    useEffect(() => {
        setIsClient(true); // Chỉ chạy sau khi component render trên client
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            if (!sortType) return;
            setIsLoading(true);
            try {
                // Đảm bảo URL API chính xác
                let apiUrl = `http://localhost:8000/api/courses}`;
                if (sortType) {
                    apiUrl = `http://localhost:8000/api/courses/sort?type=${sortType}`;
                }
                const res = await fetch(apiUrl);

                // Kiểm tra phản hồi từ API
                if (!res.ok) {
                    throw new Error(`Failed to fetch courses: ${res.status} ${res.statusText}`);
                }

                const data = await res.json();

                // Đảm bảo dữ liệu trả về có cấu trúc đúng
                if (!data.courses) {
                    throw new Error('Invalid data format: courses not found');
                }

                setCourses(data.courses || []);
                setTotalCourses(data.courses.length || 0); // Cập nhật tổng số courses
            } catch (error) {
                console.error('❌ Fetch Error:', error);
                setCourses([]);
                setTotalCourses(0);
            } finally {
                setIsLoading(false);
            }
        };

        // Fetch dữ liệu khi sortType thay đổi
        fetchCourses();
    }, [sortType]);
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
        <div className="pl-[28px] relative w-full">
            <div className="flex justify-between items-center pb-8 w-full">
                <p className="text-primary-800">
                    Showing {startIndex}-{endIndex} Of {totalCourses} Courses
                </p>
                <Sort />
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
                courses.map((course) => <CourseHorizontalCard key={course._id} course={course} />)}

            {/* Pagination */}
            {totalCourses > 0 && (
                <div className="p-5">
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
