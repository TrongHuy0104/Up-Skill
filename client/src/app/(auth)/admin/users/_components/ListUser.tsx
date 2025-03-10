'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import defaultAvatar from '@/public/assets/images/avatar/default-avatar.jpg';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: { url: string };
}

export default function ListUser() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/user/get-users`, {
                    method: 'GET',
                    credentials: 'include', // Nếu API yêu cầu cookie hoặc token
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
    }, []);

    if (loading) return <p className="text-gray-500">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Manage User</h2>
            <div className="space-y-2">
                {users.map((user) => (
                    <Link href={`/instructors/${user._id}`} key={user._id} className="block">
                        <div className="flex items-center p-2 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer">
                            <Image
                                src={user.avatar?.url || defaultAvatar}
                                alt={user.name}
                                width={40}
                                height={40}
                                className="rounded-full mr-2"
                            />
                            <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.role}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
