'use client';
import React, { useState } from 'react';
import Banner from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import Arrow from '@/public/assets/icons/arrow-top-right.svg';
import Image from 'next/image';
import axios from 'axios';

export default function FirstBanner() {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('user');

    const handleUpgradeRole = async () => {
        try {
            setLoading(true);
            const response = await axios.put(
                'http://localhost:8000/api/user/update-user',
                { role: 'instructor' },
                { withCredentials: true }
            );

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
            title="Become A Instructor"
            breadcrumbs={[{ href: '/', text: 'Home' }, { href: '/pages', text: 'Pages' }, { text: 'Instructor' }]}
            contentAlignment="center"
            backgroundColor="bg-accent-100"
        >
            <p className="text-[16px] mb-8 text-primary-800 text-center just">
                Become an instructor and change lives — including your own
            </p>

            {/* Căn giữa Button */}
            <div className="flex justify-center">
                {role !== 'instructor' ? (
                    <Button
                        className="bg-primary-800 text-white px-6 py-3 w-44 h-14 text-[16px] flex items-center gap-2 justify-center"
                        onClick={handleUpgradeRole}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Get Started'}
                        <Image src={Arrow} alt="Arrow Icon" />
                    </Button>
                ) : (
                    <p className="text-green-600 font-semibold text-center">You are already an Instructor!</p>
                )}
            </div>
        </Banner>
    );
}
