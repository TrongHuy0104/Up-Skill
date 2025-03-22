import React from 'react';
import axios from 'axios';
import { cookies } from 'next/headers';
import DashboardClient from './_components/DashboardClient';

const fetchCourseStats = async () => {
    const cookieStore = cookies();
    const cookie = cookieStore.toString();

    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/instructor/all`, {
        headers: { Cookie: cookie },
        withCredentials: true
    });

    if (response.data.success) {
        const purchasedCourses: any = response.data.purchasedCourses;
        const uploadedCourses: any = response.data.uploadedCourses;
        const courses = [...purchasedCourses, ...uploadedCourses];

        const publishedCourses = uploadedCourses.filter((course: any) => course.isPublished);
        const totalStudent = publishedCourses.reduce((sum: number, course: any) => sum + (course.purchased || 0), 0);

        return {
            totalCourses: courses.length,
            publishedCourses: publishedCourses.length,
            pendingCourses: uploadedCourses.length - publishedCourses.length,
            totalStudent,
            studentCompleted: 0,
            studentInprogress: totalStudent - 0,
            courseEnrolled: purchasedCourses.length,
            courseActive: 0,
            courseCompleted: 0
        };
    }

    throw new Error('Failed to fetch course stats');
};

const fetchUserData = async () => {
    const cookieStore = cookies();
    const cookie = cookieStore.toString();

    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/user/me`, {
        headers: { Cookie: cookie },
        withCredentials: true
    });

    if (response.data.success) {
        return {
            courseEnrolled: response.data.user.purchasedCourses.length
        };
    }

    throw new Error('Failed to fetch user data');
};

export default async function Dashboard() {
    const [courseStats, userData] = await Promise.all([fetchCourseStats(), fetchUserData()]);

    const stats = {
        ...courseStats,
        courseEnrolled: userData.courseEnrolled
    };

    return <DashboardClient stats={stats} />;
}
