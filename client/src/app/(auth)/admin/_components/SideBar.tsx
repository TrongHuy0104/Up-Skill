'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import manageUser from '@/public/assets/icons/students.svg';
import manageCourse from '@/public/assets/icons/timetable.svg';
import dashboard from '@/public/assets/icons/dashboard.svg';
import manageInstructor from '@/public/assets/icons/students.svg';

const menuItems = [
    {
        title: 'DASHBOARD',
        items: [{ icon: dashboard, label: 'DashBoard', path: '/admin/dashboard' }]
    },
    {
        title: 'DATA',
        items: [
            { icon: manageUser, label: 'User', path: '/admin/users' },
            { icon: manageInstructor, label: 'Instructors', path: '/admin/instructors' },
            { icon: manageCourse, label: 'Manage Course', path: '/admin/courses' }
        ]
    }
];

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <div>
            {/* Logo */}
            <div className=" flex items-center p-4 gap-4">
                <Image src="/assets/images/logo/favicon.png" alt="Logo" width={50} height={50} />
                <div className="text-white text-2xl">UpSkill</div>
            </div>
            {/* Avatar and Role */}
            <div className="mt-4 text-white px-4 py-8 flex flex-col items-center gap-2">
                <Image
                    src="/assets/images/avatar/default-avatar.jpg"
                    alt="User Avatar"
                    width={50}
                    height={50}
                    className="rounded-full"
                />
                <div className="text-2xl">tên</div>
                <div>role</div>
            </div>

            {/* Menu */}
            <div className="w-full max-h-screen overflow-y-auto overflow-x-hidden p-4 text-white">
                {menuItems.map((i) => (
                    <div className="flex flex-col gap-2 w-full" key={i.title}>
                        <span className="hidden lg:block font-light my-4">{i.title}</span>
                        {i.items.map((item) => (
                            <Link
                                href={item.path}
                                key={item.label}
                                className={`flex items-center justify-center lg:justify-start gap-4 py-2 rounded-md ${
                                    pathname === item.path ? 'bg-[#4845AA]' : ''
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
        </div>
    );
};

export default Sidebar;
