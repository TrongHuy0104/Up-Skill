'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import courseIcon from '@/public/assets/icons/course.svg';

const CourseChart = () => {
  const [totalCourses, setTotalCourses] = useState(0);
  const growthRate = 150; // % tăng trưởng

  useEffect(() => {
    // Giả lập dữ liệu từ API
    setTotalCourses(450);
  }, []);

  return (
    <div className="bg-[#131836] p-6 rounded-xl shadow-lg w-1/3 h-[150px] flex items-center justify-between text-white">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <Image src={courseIcon} alt="Course Icon" width={32} height={32} className="w-8 h-8" />
        <div>
          <h2 className="text-2xl font-bold">{totalCourses.toLocaleString()}</h2>
          <p className="text-sm text-green-400">New Courses</p>
        </div>
      </div>
      {/* Right Side - Growth Indicator */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-2 border-blue-400 rounded-full flex items-center justify-center">
          <span className="text-xs text-blue-400">+{growthRate}%</span>
        </div>
      </div>
    </div>
  );
};

export default CourseChart;