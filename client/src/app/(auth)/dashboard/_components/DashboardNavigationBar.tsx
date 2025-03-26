'use client';

import Link from 'next/link';
import React from 'react';
import { MdOutlineDashboardCustomize, MdOutlineSlowMotionVideo } from 'react-icons/md';
import { TbMessageDots } from 'react-icons/tb';
import { FaRegCircleQuestion, FaRegHeart } from 'react-icons/fa6';
import { PiBagBold } from 'react-icons/pi';
import { IoSettingsOutline } from 'react-icons/io5';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';
import { DashboardNavigationSkeleton } from '@/components/ui/Skeleton';

const commonNavbarItems = [
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

const instructorNavbarItems = [
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
        href: '/dashboard/quizzes',
        icon: <FaRegCircleQuestion className="text-[20px]" />
    }
];

const userNavbarItems = [
    {
        title: 'Dashboard',
        href: '/dashboard/user',
        icon: <MdOutlineDashboardCustomize className="text-[20px]" />
    }
];

const DashboardNavigationBar = () => {
    const { data: userData, isLoading: isLoadingUser } = useLoadUserQuery(undefined);
    const pathName = usePathname();

    if (isLoadingUser) {
        return <DashboardNavigationSkeleton />;
    }

    const { user } = userData;

    const currentNavbarList =
        user.role === 'instructor'
            ? [...instructorNavbarItems, ...commonNavbarItems]
            : [...userNavbarItems, ...commonNavbarItems];

    return (
        <div>
            <div className="bg-primary-800 rounded-xl pb-5">
                <div className="text-primary-50 opacity-50 pt-[21px] px-[30px] pb-[11px]">
                    {user.role === 'instructor' ? 'INSTRUCTOR DASHBOARD' : 'USER DASHBOARD'}
                </div>
                {currentNavbarList.map((item) => (
                    <Link
                        href={item.href}
                        key={item.href}
                        className={clsx(
                            'px-[30px] py-[14px] flex items-center gap-[10px] text-primary-50 text-base font-medium relative',
                            'hover:bg-primary-50/10 transition duration-300',
                            'before:absolute before:content-[""] before:left-0 before:bottom-0 before:w-[2px] before:h-0 before:bg-accent-600',
                            'before:transition-all before:duration-300 hover:before:h-full hover:before:top-0 hover:before:bottom-auto',
                            {
                                'bg-primary-50/10 before:h-full before:top-0 before:bottom-auto': pathName === item.href
                            }
                        )}
                        aria-current={pathName === item.href ? 'page' : undefined}
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
