import { ReactNode } from 'react';
import Sidebar from './_components/SideBar';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="bg-[#fafafa]">
            <div className="h-screen bg-white w-[260px] z-50 fixed top-0 left-0 p-4 border-r border-primary-100 border-opacity-50">
                <Sidebar />
            </div>
            <div className="ml-[260px] h-full">{children}</div>
        </div>
    );
}
