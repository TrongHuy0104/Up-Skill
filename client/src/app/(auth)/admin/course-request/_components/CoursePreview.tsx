import React from 'react';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import Image from 'next/image';
import VideoPlayer from '@/app/(auth)/dashboard/instructor/courses/[courseId]/_components/VideoPlayer';
import Ratings from '@/app/(auth)/dashboard/instructor/courses/[courseId]/_components/Ratings';

const courseData = {
    name: "Fullstack Web Development",
    thumbnail: { url: "/images/course-thumbnail.jpg" },
    demoUrl: { url: "https://www.example.com/demo.mp4" },
    price: 49,
    estimatedPrice: 99,
    benefits: [
        { title: "Master modern web development" },
        { title: "Learn React, Node.js, and more" },
        { title: "Build real-world projects" }
    ],
    prerequisites: [
        { title: "Basic programming knowledge" },
        { title: "Understanding of HTML & CSS" }
    ],
    description: "This course will take you from beginner to advanced in fullstack web development."
};

const discountPercentagePrice = (((courseData.estimatedPrice - courseData.price) / courseData.estimatedPrice) * 100).toFixed(0);

export default function CoursePreview() {
    return (
        <div className="w-full relative">
            <div className="w-full mt-10">
                {courseData.demoUrl?.url ? (
                    <VideoPlayer videoUrl={courseData.demoUrl.url} />
                ) : (
                    <Image
                        src={courseData.thumbnail.url}
                        width={100}
                        height={100}
                        quality={100}
                        alt="Course Thumbnail"
                        className="object-cover w-full aspect-video"
                    />
                )}
            </div>
            <div className="flex items-center mt-4 gap-3">
                <span className="text-[26px] font-medium text-accent-900">{courseData.price}$</span>
                <span className="line-through opacity-80">{courseData.estimatedPrice}$</span>
                <span className="rounded px-4 border border-accent-900 text-accent-900 bg-accent-100">
                    {discountPercentagePrice}% Off
                </span>
            </div>
            <h1 className="text-[36px] font-semibold mt-5">{courseData.name}</h1>
            <Ratings rating={4.5} />
            <h2 className="text-[25px] font-semibold mt-5">What will you learn?</h2>
            {courseData.benefits.map((item, index) => (
                <div key={index} className="flex py-2">
                    <IoIosCheckmarkCircleOutline size={20} />
                    <p className="pl-2">{item.title}</p>
                </div>
            ))}
            <h2 className="text-[25px] font-semibold mt-5">Prerequisites</h2>
            {courseData.prerequisites.map((item, index) => (
                <div key={index} className="flex py-2">
                    <IoIosCheckmarkCircleOutline size={20} />
                    <p className="pl-2">{item.title}</p>
                </div>
            ))}
            <h2 className="text-[25px] font-semibold mt-5">Course Details</h2>
            <p className="mt-2 mb-6 whitespace-pre-line">{courseData.description}</p>
        </div>
    );
}
