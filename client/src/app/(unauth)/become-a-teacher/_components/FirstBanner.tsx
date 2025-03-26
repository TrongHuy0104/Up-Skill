'use client';
import React, { useState, useEffect } from 'react';
import Banner from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import Arrow from '@/public/assets/icons/arrow-top-right.svg';
import Image from 'next/image';
import axios from 'axios';

export default function FirstBanner() {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState(''); // Để rỗng ban đầu, tránh lỗi render

    // 🛠 Lấy thông tin user từ Backend khi component mount
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user/get-user-information', {
                    withCredentials: true // Gửi token/cookie để xác thực
                });
                setRole(response.data.user.role); // Cập nhật role từ BE
            } catch (error) {
                console.error('Lỗi lấy role:', error);
            }
        };

        fetchUserRole();
    }, []);

    const handleUpgradeRole = async () => {
        // 🛑 Kiểm tra nếu user đã là Instructor
        if (role === 'instructor') {
            alert('Bạn đã là Instructor từ trước!');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.put(
                'http://localhost:8000/api/user/update-role',
                { role: 'instructor' },
                { withCredentials: true }
            );
            console.log('Response:', response);

            if (response.data.success) {
                setRole('instructor');
                alert('Bạn đã trở thành Instructor!');
            } else {
                alert('Cập nhật thất bại!');
            }
        } catch (error) {
            console.error('Lỗi cập nhật role:', error);
            alert('Đã có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Banner
            title="Become An Instructor"
            breadcrumbs={[{ href: '/', text: 'Home' }, { href: '/pages', text: 'Pages' }, { text: 'Instructor' }]}
            contentAlignment="center"
            backgroundColor="bg-accent-100"
        >
            <p className="text-[16px] mb-8 text-primary-800 text-center">
                Become an instructor and change lives — including your own
            </p>

            {/* Căn giữa Button */}
            <div className="flex justify-center">
                <Button
                    className="bg-primary-800 text-white px-6 py-3 w-44 h-14 text-[16px] flex items-center gap-2 justify-center"
                    onClick={handleUpgradeRole}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Get Started'}
                    <Image src={Arrow} alt="Arrow Icon" />
                </Button>
            </div>
        </Banner>
    );
}
