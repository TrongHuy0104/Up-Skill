'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import defaultThumbnail from '@/public/assets/images/avatar/default-avatar.jpg';
import starIcon from '@/public/assets/icons/star.svg';

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
                    <thead className="bg-gray-100 border-b">
                        <tr className="text-gray-700">
                            <th className="text-left"></th>
                            <th className="px-4 py-2 text-left">Course&apos;s Name</th>
                            <th className="px-4 py-2 text-left">Price</th>
                            <th className="px-4 py-2 text-left">Rating</th>
                            <th className="px-4 py-2 text-left">Date created</th> {/* Thêm cột ngày tạo */}
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course._id} className="border-b border-gray-200 hover:bg-gray-50 transition-all">
                                {/* Hình ảnh */}
                                <td className="px-4 py-4">
                                    <Image
                                        src={course.thumbnail?.url || defaultThumbnail}
                                        alt="Thumbnail"
                                        width={80}
                                        height={80}
                                        className="rounded-md shadow-md"
                                    />
                                </td>

                                {/* Tên khóa học */}
                                <td className="px-4 py-4 font-semibold text-blue-600">{course.name}</td>

                                {/* Giá */}
                                <td className="px-4 py-4 text-green-600">
                                    {course.price ? `${course.price.toLocaleString()} VND` : 'Free'}
                                </td>

                                {/* Đánh giá */}
                                <td className="px-4 py-4 align-middle">
                                    <div className="flex items-center space-x-1 text-yellow-500">
                                        <Image
                                            src={starIcon}
                                            alt="Star Icon"
                                            width={20}
                                            height={20}
                                            className="inline-block"
                                        />
                                        <span className="text-lg font-bold text-black">{course.rating.toFixed(1)}</span>
                                    </div>
                                </td>

                                {/* Ngày tạo */}
                                <td className="px-4 py-4 text-sm text-gray-600">
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
