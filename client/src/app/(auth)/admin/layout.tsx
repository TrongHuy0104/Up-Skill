import { ReactNode } from 'react';
import Sidebar from './_components/SideBar';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="h-screen flex">
            {/* LEFT - Menu Sidebar */}
            <div className="w-1/5 p-4 bg-white">
                <Sidebar />
            </div>
            {/* RIGHT - Nội dung động */}
            <div className="w-4/5 flex-1 p-4 bg-gray-200 overflow-auto">{children}</div>
        </div>
    );
}
