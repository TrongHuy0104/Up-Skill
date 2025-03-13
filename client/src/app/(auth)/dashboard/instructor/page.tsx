'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/Badge';
import IncomeChart from '../_components/IncomeChart';
import PaginationComponent from '@/components/custom/PaginationComponent';


interface Course {
    _id: string;
    name: string;
    isPublished: boolean;
    price?: number;
    purchased: number;
    thumbnail?: { url: string };
}

const Dashboard = () => {
    const router = useRouter();
    const [stats, setStats] = useState({
        totalCourses: 0,
        publishedCourses: 0,
        pendingCourses: 0,
        totalStudent: 0,
        studentCompleted: 0,
        studentInprogress: 0,
        courseEnrolled: 0,
        courseActive: 0,
        courseCompleted: 0
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [bestSellingCourses, setBestSellingCourses] = useState<Course[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    const totalPages = Math.max(1, Math.ceil(bestSellingCourses.length / 4));



    useEffect(() => {
        const fetchCourseStats = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/instructor/all`, {
                    withCredentials: true
                });

                if (response.data.success) {
                    const purchasedCourses: Course[] = response.data.purchasedCourses;
                    const uploadedCourses: Course[] = response.data.uploadedCourses;

                    //Course Stats
                    const publishedCourses = uploadedCourses.filter((course: Course) => course.isPublished);
                    const totalStudent = publishedCourses.reduce((sum, course) => sum + (course.purchased || 0), 0);

                    setStats((prevStats) => ({
                        ...prevStats,
                        totalCourses: uploadedCourses.length,
                        publishedCourses: publishedCourses.length,
                        pendingCourses: uploadedCourses.length - publishedCourses.length,
                        totalStudent: totalStudent,
                        studentCompleted: 0,
                        studentInprogress: totalStudent - 0,
                        courseEnrolled: purchasedCourses.length
                        // courseActive: 0,
                        // courseCompleted: 0
                    }));

                    //Best Selling Course
                    // const bestSellingCourses = publishedCourses
                    //     .sort((a: Course, b: Course) => (b.purchased || 0) - (a.purchased || 0));

                    setBestSellingCourses(uploadedCourses);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/user/me`, {
                    withCredentials: true
                });

                if (response.data.success) {
                    const user = response.data.user;
                    const courseEnrolled = user.purchasedCourses.length;
                    const userId = user._id;

                    setStats((prevStats) => ({
                        ...prevStats,
                        courseEnrolled: courseEnrolled
                    }));
                    setUserId(userId);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchData = async () => {
            await fetchCourseStats();
            await fetchUserData();
        };
        fetchData();
    }, []);

    //Pagination handle
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    //Edit course handle
    // const handleEditCourse = (courseId: number) => {
    //   console.log('Editing course:', courseId);
    // };

    //Delete course handle
    // const handleDeleteCourse = (courseId: number) => {
    //   console.log('Deleting course:', courseId);
    // };

    //Stats
    const statsConfig = [
        { title: 'Total Courses', value: stats.totalCourses, icon: '/assets/icons/total-course.svg' },
        { title: 'Published Courses', value: stats.publishedCourses, icon: '/assets/icons/published-course.svg' },
        { title: 'Pending Courses', value: stats.pendingCourses, icon: '/assets/icons/pending-course.svg' },
        { title: 'Total Students', value: stats.totalStudent, icon: '/assets/icons/student-total.svg' },
        { title: 'Students Completed', value: 0, icon: '/assets/icons/student-completed.svg' },
        { title: 'Students In-progress', value: stats.studentInprogress, icon: '/assets/icons/student-inprogress.svg' },
        { title: 'Enrolled Courses', value: stats.courseEnrolled, icon: '/assets/icons/play-content.svg' },
        { title: 'Active Courses', value: 0, icon: '/assets/icons/check-icon.svg' },
        { title: 'Completed Courses', value: 0, icon: '/assets/icons/certificate.svg' }
    ];

    return (
        <div className="container mx-auto pl-10">
            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {statsConfig.map((stat) => (
                    <div
                        key={stat.title}
                        className="whitespace-nowrap w-[320px] h-[150px] bg-primary-50 rounded-lg p-9 flex items-center space-x-6 border border-primary-100"
                    >
                        <div className="bg-accent-100 p-5 rounded-full">
                            <Image src={stat.icon} alt={stat.title} width={30} height={30} unoptimized />
                        </div>
                        <div>
                            <p className="text-primary-800 text-base">{stat.title}</p>
                            <p className="text-[26px] text-accent-900 font-semibold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Income Chart */}
            <div className="container bg-primary-50 rounded-lg p-[34px] border border-primary-100 mb-8">
                <h1 className="text-[22px] text-primary-800 font-medium">Total Income</h1>
                {userId && <IncomeChart userId={userId} />} {/* Pass userId to IncomeChart */}

            </div>

            {/* Best Selling Courses Section */}
            <div className="bg-primary-50 rounded-lg p-[34px] border border-primary-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[22px] text-primary-800 font-medium">Best Selling Courses</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-[15px] text-primary-800 bg-accent-100">
                                <th className="px-[30px] py-[26px] rounded-l-lg font-medium">Course Name</th>
                                <th className="py-[26px] font-medium px-8">Sales</th>
                                <th className="py-[26px] font-medium pl-10 pr-6">Amount</th>
                                <th className="py-[26px] font-medium px-12 text-center">Status</th>
                                <th className="py-[26px] font-medium rounded-r-lg pr-8 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bestSellingCourses.slice((currentPage - 1) * 4, currentPage * 4).map((course) => (
                                <tr key={course._id} className="border-b border-primary-100">
                                    <td className="py-5 pl-6">
                                        <div className="flex items-center">
                                            <div className="relative">
                                                <Image
                                                    src={
                                                        course.thumbnail?.url || '/assets/images/courses/courses-01.jpg'
                                                    }
                                                    alt={course.name}
                                                    width={100}
                                                    height={80}
                                                    className="w-[100px] h-[80px] object-contain"
                                                />
                                            </div>
                                            <span className="truncate w-[400px] text-[15px] text-primary-800 font-medium pl-[30px]">
                                                {course.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="text-[15px] text-primary-800 font-medium pl-8">
                                        {course.purchased}
                                    </td>
                                    <td className="text-[15px] text-primary-800 font-medium pl-10">
                                        ${course.price ? course.price.toLocaleString() : 'N/A'}
                                    </td>
                                    <td className="text-[15px] text-primary-800 font-medium pl-10">
                                        <Badge
                                            className={`bg-slate-500 ${course.isPublished && 'bg-accent-600 text-primary-50'}`}
                                        >
                                            {course.isPublished ? 'Published' : 'Draft'}
                                        </Badge>
                                    </td>
                                    <td className="py-4 pl-6">
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() =>
                                                    router.push(`/dashboard/instructor/courses/${course._id}`)
                                                }
                                                className="p-2 rounded-xl group border border-primary-100 bg-accent-100 hover:bg-primary-800 transition-colors duration-200"
                                            >
                                                <div className="relative w-4 h-4">
                                                    <Image
                                                        src="/assets/icons/edit.svg"
                                                        alt="Edit"
                                                        fill
                                                        className="group-hover:brightness-0 group-hover:invert transition-all duration-200"
                                                    />
                                                </div>
                                            </button>
                                            <button
                                                // onClick={() => handleDeleteCourse(course.id)}
                                                className="p-2 rounded-xl group border border-primary-100 hover:bg-accent-900 transition-colors duration-200"
                                            >
                                                <div className="relative w-4 h-4">
                                                    <Image
                                                        src="/assets/icons/delete.svg"
                                                        alt="Delete"
                                                        fill
                                                        className="group-hover:brightness-0 group-hover:invert transition-all duration-200"
                                                    />
                                                </div>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center my-8">
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
