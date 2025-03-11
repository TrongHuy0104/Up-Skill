'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { date: 'Jan', users: 120, instructors: 10 },
    { date: 'Feb', users: 180, instructors: 20 },
    { date: 'Mar', users: 240, instructors: 30 },
    { date: 'Apr', users: 300, instructors: 50 },
    { date: 'May', users: 450, instructors: 80 },
    { date: 'Jun', users: 500, instructors: 120 }
];

const UserAnalyticsChart = () => {
    return (
        <div className="bg-[#131836] p-4 rounded-lg shadow-md">
            <h2 className="text-white text-xl font-semibold mb-4">Users Analytics</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                    <XAxis dataKey="date" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#4ADE80"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="New Users"
                    />
                    <Line
                        type="monotone"
                        dataKey="instructors"
                        stroke="#F87171"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="Instructors"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UserAnalyticsChart;
