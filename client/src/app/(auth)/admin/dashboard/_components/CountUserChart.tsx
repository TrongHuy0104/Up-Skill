'use client';

import Image from 'next/image';
import studentsIcon from '@/public/assets/icons/students.svg';

const CountUserChart = ({totalUser}: any) => {
  const growthRate = 150; // % tăng trưởng



  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-1/4 h-[150px] flex items-center justify-between text-white">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <Image src={studentsIcon} alt="Users Icon" width={32} height={32} className="w-8 h-8" />
        <div>
          <h2 className="text-2xl font-bold text-black">{totalUser}</h2>
          <p className="text-sm text-green-400">New Users</p>
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

export default CountUserChart;