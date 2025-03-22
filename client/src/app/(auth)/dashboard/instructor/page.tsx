import React from 'react';
import axios from 'axios';
import { cookies } from 'next/headers';
import DashboardClient from './_components/DashboardClient';

// Helper function to fetch data with cookies
const fetchData = async (url: string) => {
    const cookieStore = cookies();
    const cookie = cookieStore.toString();

    const response = await axios.get(url, {
        headers: { Cookie: cookie },
        withCredentials: true
    });

    if (!response.data.success) {
        throw new Error(`Failed to fetch data from ${url}`);
    }

    return response.data;
};

// Fetch course statistics
const fetchCourseStats = async () => {
    const data = await fetchData(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/instructor/all`);

    const { purchasedCourses, uploadedCourses } = data;

    const publishedCourses = uploadedCourses.filter((course: any) => course.isPublished);
    const totalStudent = publishedCourses.reduce((sum: number, course: any) => sum + (course.purchased || 0), 0);

    return {
        totalCourses: uploadedCourses.length,
        publishedCourses: publishedCourses.length,
        pendingCourses: uploadedCourses.length - publishedCourses.length,
        totalStudent,
        studentCompleted: 0, // Placeholder for actual logic
        studentInprogress: totalStudent - 0, // Placeholder for actual logic
        courseEnrolled: purchasedCourses.length,
        uploadedCourses
    };
};

// Fetch user data
const fetchUserData = async () => {
    const data = await fetchData(`${process.env.NEXT_PUBLIC_SERVER_URI}/user/me`);

    const { user } = data;

    return {
        courseEnrolled: user.purchasedCourses.length,
        userId: user._id
    };
};

// Main Dashboard component
export default async function Dashboard() {
    try {
        const [courseStats, userData] = await Promise.all([fetchCourseStats(), fetchUserData()]);

        const stats = {
            ...courseStats,
            courseEnrolled: userData.courseEnrolled
        };

        const bestSellingCourses = courseStats.uploadedCourses; // Replace with actual logic for best-selling courses

        return <DashboardClient stats={stats} bestSellingCourses={bestSellingCourses} userId={userData.userId} />;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return <div>Failed to load dashboard data</div>;
    }
}
