'use client';


import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueChart({data}: any) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-black text-center">Total Income</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="month" stroke="#000" />
          <YAxis stroke="#000" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <Tooltip formatter={(value, name) => [`${value}%`, name]} />
          <Area type="monotone" dataKey="platformIncome" stackId="1" stroke="#000" fill="#ffdd57" name="Income of Instructor (90%)" />
          <Area type="monotone" dataKey="adminShare" stackId="1" stroke="#000" fill="#a0d468" name="Income of Admin (10%)" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-center mt-4">
        <div className="flex items-center mr-4">
          <div className="w-4 h-4 bg-[#a0d468] mr-2"></div>
          <span className="text-black">Income of Admin (10%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#ffdd57] mr-2"></div>
          <span className="text-black">Income of Instructor (90%)</span>
        </div>
      </div>
    </div>
  );
}


