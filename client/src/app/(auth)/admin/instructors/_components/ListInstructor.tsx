'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import defaultAvatar from '@/public/assets/images/avatar/default-avatar.jpg';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: { url: string };
}

export default function ListInstructor() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const hasFetched = useRef(false); // ✅ Ngăn gọi API nhiều lần

    useEffect(() => {
        if (hasFetched.current) return; // Nếu đã fetch rồi thì không fetch lại

        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/user/get-users`, {
                    method: 'GET',
                    credentials: 'include' // Nếu API yêu cầu cookie hoặc token
                });

                if (!response.ok) throw new Error('Lỗi khi lấy danh sách người dùng.');

                const data = await response.json();
                setUsers(data.users); // API trả về danh sách user
            } catch (error: any) {
                setError(error.message || 'Không thể lấy dữ liệu người dùng.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
        hasFetched.current = true; // ✅ Đánh dấu đã fetch API
    }, []);

    if (loading) return <p className="text-gray-500">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const filteredUsers = users.filter((user) => user.role === 'instructor');

    return (
        <div className="p-4 text-white">
            <h2 className="text-xl font-bold mb-4">Manage Instructors</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full rounded-lg bg-[#131836] text-white">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Instructor</th>
                            <th className="px-4 py-2 text-center">Role</th>
                            <th className="px-4 py-2 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-[#4845AA] transition">
                                <td className="px-4 py-4 flex items-center space-x-2">
                                    <Image
                                        src={user.avatar?.url || defaultAvatar}
                                        alt={user.name}
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                    <span>{user.name}</span>
                                </td>
                                <td className="px-4 py-4 text-center align-middle">
                                    <span className="px-4 py-1">{user.role}</span>
                                </td>
                                <td className="px-4 py-4 text-center align-middle space-x-2">
                                    <button className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                                    <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
