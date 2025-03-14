'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { MdOutlineDashboardCustomize, MdOutlineSlowMotionVideo } from 'react-icons/md';
import { TbMessageDots } from 'react-icons/tb';
import { FaRegCircleQuestion, FaRegHeart } from 'react-icons/fa6';
import { PiBagBold } from 'react-icons/pi';
import { IoSettingsOutline } from 'react-icons/io5';
import { usePathname } from 'next/navigation';

const navbarList = [
    {
        title: 'Dashboard',
        href: '/dashboard/instructor',
        icon: <MdOutlineDashboardCustomize className="text-[20px]" />
    },
    {
        title: 'My Course',
        href: '/dashboard/instructor/my-course',
        icon: <MdOutlineSlowMotionVideo className="text-[20px]" />
    },
    {
        title: 'Reviews',
        href: '/dashboard/instructor/reviews',
        icon: <TbMessageDots className="text-[20px]" />
    },
    {
        title: 'Wishlist',
        href: '/dashboard/instructor/wishlist',
        icon: <FaRegHeart className="text-[20px]" />
    },
    {
        title: 'Quizzes',
        href: '/dashboard/instructor/quizzes',
        icon: <FaRegCircleQuestion className="text-[20px]" />
    },
    {
        title: 'Order',
        href: '/dashboard/orders',
        icon: <PiBagBold className="text-[20px]" />
    },
    {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: <IoSettingsOutline className="text-[20px]" />
    }
];

const navbarListForUser = [
    {
        title: 'Dashboard',
        href: '/dashboard/user',
        icon: <MdOutlineDashboardCustomize className="text-[20px]" />
    },
    {
        title: 'Order',
        href: '/dashboard/orders',
        icon: <PiBagBold className="text-[20px]" />
    },
    {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: <IoSettingsOutline className="text-[20px]" />
    }
];

const DashboardNavigationBar = () => {
    const pathName = usePathname();
    const [userRole, setUserRole] = useState(null); // State để lưu role của người dùng

    useEffect(() => {
        // Gọi API để lấy thông tin người dùng
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/user/me', {
                    credentials: 'include' // Bao gồm cookie nếu cần
                });

                if (response.ok) {
                    const data = await response.json();

                    setUserRole(data.user.role); // Lưu role vào state
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    // Chọn danh sách điều hướng dựa trên role
    const currentNavbarList = userRole === 'instructor' ? navbarList : navbarListForUser;

    return (
        <div>
            <div className="bg-primary-800 rounded-xl pb-5">
                <div className="text-primary-50 opacity-50 pt-[21px] px-[30px] pb-[11px]">
                    {userRole === 'instructor' ? 'INSTRUCTOR DASHBOARD' : 'USER DASHBOARD'}
                </div>
                {currentNavbarList.map((item) => (
                    <Link
                        href={item.href}
                        key={item.href}
                        className={`px-[30px] py-[14px] flex items-center gap-[10px] text-primary-50 text-base font-medium relative
                            hover:bg-primary-50/10 transition duration-300
                            before:absolute before:content-[''] before:left-0 before:bottom-0 before:w-[2px] before:h-0 before:bg-accent-600 
                            before:transition-all before:duration-300 hover:before:h-full hover:before:top-0 hover:before:bottom-auto
                            ${pathName === item.href ? 'bg-primary-50/10 before:h-full before:top-0 before:bottom-auto' : ''}`}
                    >
                        <i>{item.icon}</i>
                        <span>{item.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default DashboardNavigationBar;
