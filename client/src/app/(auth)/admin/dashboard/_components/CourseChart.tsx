'use client';

import Image from 'next/image';
import courseIcon from '@/public/assets/icons/course.svg';

const CourseChart = ({totalCourse, growthRate}: any) => {
  

  return (
    <div className="bg-white p-6 rounded-xl w-1/4 h-[150px] flex items-center justify-between text-black">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <Image src={courseIcon} alt="Course Icon" width={32} height={32} className="w-8 h-8" />
        <div>
          <h2 className="text-2xl font-bold">{totalCourse}</h2>
          <p className="text-sm text-green-400">New Courses</p>
        </div>
      </div>
      {/* Right Side - Growth Indicator */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-blue-500">+{growthRate}%</span>
        </div>
      </div>
    </div>
  );
};

export default CourseChart;