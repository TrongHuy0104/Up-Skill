'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserAnalyticsChart = ({data}: any) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-black text-xl font-semibold mb-4">Users Analytics</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(7, 7, 7, 0.2)" />
                    <XAxis dataKey="date" stroke="#000" />
                    <YAxis stroke="#000" tickFormatter={(value) => Math.round(value).toString()} allowDecimals={false} />
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
