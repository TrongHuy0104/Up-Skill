'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import manageUser from '@/public/assets/icons/students.svg';
import manageCourse from '@/public/assets/icons/timetable.svg';
import dashboard from '@/public/assets/icons/dashboard.svg';

const menuItems = [
    {
        title: 'DASHBOARD',
        items: [{ icon: dashboard, label: 'Dash Board', path: '/admin/dashboard' }]
    },
    {
        title: 'MENU',
        items: [
            { icon: manageUser, label: 'Manage User', path: '/admin/users' },
            { icon: manageCourse, label: 'Manage Course', path: '/admin/courses' }
        ]
    }
];

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <div className="w-full max-h-screen overflow-y-auto overflow-x-hidden">
            {menuItems.map((i) => (
                <div className="flex flex-col gap-2 w-full" key={i.title}>
                    <span className="hidden lg:block text-gray-400 font-light my-4">{i.title}</span>
                    {i.items.map((item) => (
                        <Link
                            href={item.path}
                            key={item.label}
                            className={`flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md ${
                                pathname === item.path ? 'bg-orange-300' : ''
                            }`}
                        >
                            <Image
                                src={item.icon}
                                alt={item.label}
                                width={20}
                                height={20}
                                className="w-5 h-5 object-contain"
                            />
                            <span className="hidden lg:block">{item.label}</span>
                        </Link>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
