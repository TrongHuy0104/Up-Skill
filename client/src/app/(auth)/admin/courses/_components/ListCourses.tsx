'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import defaultAvatar from '@/public/assets/images/avatar/default-avatar.jpg';

interface Course {
    _id: string;
    name: string;
    description: string;
    authorId: string;
    price: number;
    thumbnail: { url: string };
    tags: string;
    level: string;
    rating: number;
}

export default function ListCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [authors, setAuthors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const hasFetched = useRef(false);

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
                setCourses(data.courses.filter((course: Course) => course.authorId)); // Chỉ lấy course có authorId
            } catch (error: any) {
                setError(error.message || 'Không thể lấy dữ liệu khóa học.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
        hasFetched.current = true;
    }, []);

    // Gọi API lấy thông tin tác giả một lần duy nhất
    useEffect(() => {
        const fetchAuthors = async () => {
            const uniqueAuthorIds = [...new Set(courses.map((course) => course.authorId))];
            const newAuthors: { [key: string]: string } = {};

            await Promise.all(
                uniqueAuthorIds.map(async (authorId) => {
                    try {
                        const response = await fetch(
                            `${process.env.NEXT_PUBLIC_SERVER_URI}/users/get-user?id=${authorId}`,
                            {
                                method: 'GET',
                                credentials: 'include'
                            }
                        );

                        if (!response.ok) throw new Error();

                        const data = await response.json();
                        newAuthors[authorId] = data.user.name;
                    } catch {
                        newAuthors[authorId] = 'Không rõ';
                    }
                })
            );

            setAuthors((prev) => ({ ...prev, ...newAuthors }));
        };

        if (courses.length > 0) {
            fetchAuthors();
        }
    }, [courses]);

    if (loading) return <p className="text-gray-500">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Danh sách khóa học</h2>
            <div className="rounded-xl overflow-hidden border border-gray-300 shadow-md">
                <table className="w-full bg-white text-left">
                    <thead className="bg-gray-100 border-b">
                        <tr className="text-gray-700">
                            <th className="px-4 py-3 text-left">Hình ảnh</th>
                            <th className="px-4 py-2 text-left w-1/4">Tên khóa học</th>
                            <th className="px-4 py-2 text-left">Mô tả</th>
                            <th className="px-4 py-2 text-left w-1/6">Tác giả</th>
                            <th className="px-4 py-2 text-left">Giá</th>
                            <th className="px-4 py-2 text-left">Tags</th>
                            <th className="px-4 py-2 text-left">Mức độ</th>
                            <th className="px-4 py-2 text-left">Đánh giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course._id} className="border-b border-gray-200 hover:bg-gray-50 transition-all">
                                {/* Hình ảnh */}
                                <td className="px-4 py-4">
                                    <Image
                                        src={course.thumbnail?.url || defaultAvatar}
                                        alt="Thumbnail"
                                        width={80}
                                        height={50}
                                        className="rounded-md shadow-md"
                                    />
                                </td>

                                {/* Tên khóa học */}
                                <td className="px-4 py-4 font-semibold text-blue-600">{course.name}</td>

                                {/* Mô tả */}
                                <td className="px-4 py-4 text-gray-600 text-sm">{course.description}</td>

                                {/* Tác giả */}
                                <td className="px-4 py-4 text-gray-800">{authors[course.authorId] || 'Đang tải...'}</td>

                                {/* Giá */}
                                <td className="px-4 py-4 text-green-600">
                                    {course.price ? `${course.price.toLocaleString()} VND` : 'Miễn phí'}
                                </td>

                                {/* Tags */}
                                <td className="px-4 py-4 text-gray-500">
                                    {course?.tags?.split(',').map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-md mr-1"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </td>

                                {/* Mức độ */}
                                <td className="px-4 py-4 text-sm text-gray-600">{course.level}</td>

                                {/* Đánh giá */}
                                <td className="px-4 py-4 flex items-center space-x-1 text-yellow-500">
                                    <span className="text-lg font-bold">⭐ {course.rating.toFixed(1)}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
