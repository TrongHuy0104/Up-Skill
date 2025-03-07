'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import MyCourses from './_components/MyCourses';

interface Course {
    _id: string;
    name: string;
    isPublished: boolean;
    price?: number;
    purchased: number;
    thumbnail?: { url: string };
}

const Dashboard = () => {
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

    useEffect(() => {
        const fetchCourseStats = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/instructor/all`, {
                    withCredentials: true
                });

                if (response.data.success) {
                    const purchasedCourses: Course[] = response.data.purchasedCourses;
                    const uploadedCourses: Course[] = response.data.uploadedCourses;
                    const courses = [...purchasedCourses, ...uploadedCourses];

                    //Course Stats
                    const publishedCourses = uploadedCourses.filter((course: Course) => course.isPublished);
                    const totalStudent = publishedCourses.reduce((sum, course) => sum + (course.purchased || 0), 0);

                    setStats((prevStats) => ({
                        ...prevStats,
                        totalCourses: courses.length,
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

                    setStats((prevStats) => ({
                        ...prevStats,
                        courseEnrolled: courseEnrolled
                    }));
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
            <MyCourses />
        </div>
    );
};

export default Dashboard;
