'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Course {
    _id: string;
    name: string;
    price: number;
    thumbnail: { url: string };
    rating: number;
    createdAt: string; // Thêm trường ngày tạo
}

export default function CourseList() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const hasFetched = useRef(false);

    // Fetch all courses
    useEffect(() => {
        if (hasFetched.current) return;

        const fetchCourses = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/get-courses`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) throw new Error('Lỗi khi lấy danh sách khóa học.');

                const data = await response.json();
                setCourses(data.courses);
            } catch (error: any) {
                setError(error.message || 'Không thể lấy dữ liệu khóa học.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
        hasFetched.current = true;
    }, []);

    if (loading) return <p className="text-gray-500">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">List of Courses</h2>
            <div className="rounded-xl overflow-hidden border  ">
                <table className="w-full bg-white text-left">
                    <thead className="bg-white border-b border-primary-100">
                        <tr className="text-gray-700 text-base">
                            <th className="px-4 py-4 text-left">Course&apos;s Name</th>
                            <th className="px-4 py-4 text-left">Price</th>
                            <th className="px-4 py-4 text-left">Rating</th>
                            <th className="px-4 py-4 text-left">Date created</th> {/* Thêm cột ngày tạo */}
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course._id} className="border-b border-gray-200 hover:bg-gray-50 transition-all">
                                {/* Hình ảnh */}

                                {/* Tên khóa học */}
                                <td className="px-4 py-4 flex items-center gap-4 text-p text-primary-800">
                                    <Image
                                        src={course.thumbnail?.url || '/'}
                                        alt="Thumbnail"
                                        width={40}
                                        height={40}
                                        className="rounded-md shadow-md h-[40px] object-cover"
                                    />
                                    {course.name}
                                </td>

                                {/* Giá */}
                                <td className="px-4 py-4 text-primary-800">
                                    {course.price ? `${course.price.toLocaleString()} $` : 'Free'}
                                </td>

                                {/* Đánh giá */}
                                <td className="px-4 py-4 align-middle">
                                    <div className="flex items-center space-x-1 text-yellow-500">
                                        {/* <Image
                                            src={starIcon}
                                            alt="Star Icon"
                                            width={16}
                                            height={16}
                                            className="inline-block relative top-[-1px]"
                                        /> */}
                                        <span className="text-primary-800">{course.rating.toFixed(1)}</span>
                                    </div>
                                </td>

                                {/* Ngày tạo */}
                                <td className="px-4 py-4 text-sm text-primary-800">
                                    {new Date(course.createdAt).toLocaleDateString()} {/* Định dạng ngày tháng */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
