'use client';

import { PiChalkboardTeacher } from 'react-icons/pi';

const CountInstructorChart = ({totalInstructor}: any) => {
  const growthRate = 150; // % tăng trưởng

  return (
    <div className="bg-white p-6 rounded-xl w-1/4 h-[150px] flex items-center justify-between text-white">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <PiChalkboardTeacher className="w-10 h-10 text-gray-500" />
        <div>
          <h2 className="text-2xl font-bold text-black">{totalInstructor}</h2>
          <p className="text-sm text-green-400">New Instructors</p>
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

export default CountInstructorChart;