'use client';

import { useState, useEffect } from 'react';
import { PiChalkboardTeacher } from 'react-icons/pi';

const CountInstructorChart = () => {
  const [totalInstructors, setTotalInstructors] = useState(0);
  const growthRate = 150; // % tăng trưởng

  useEffect(() => {
    // Giả lập dữ liệu từ API
    setTotalInstructors(450);
  }, []);

  return (
    <div className="bg-[#131836] p-6 rounded-xl shadow-lg w-1/3 h-[150px] flex items-center justify-between text-white">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <PiChalkboardTeacher className="w-10 h-10 text-gray-500" />
        <div>
          <h2 className="text-2xl font-bold">{totalInstructors.toLocaleString()}</h2>
          <p className="text-sm text-green-400">New Instructors</p>
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

export default CountInstructorChart;