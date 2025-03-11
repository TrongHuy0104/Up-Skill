// app/admin/layout.tsx
import { ReactNode } from 'react';
import Sidebar from './_components/SideBar';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="overflow-x-hidden relative">
                <div className="h-screen flex">
                    {/* LEFT - Menu Sidebar */}
                    <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 bg-[#131836]">
                        <Sidebar />
                    </div>

                    {/* RIGHT - Nội dung động */}
                    <div className="flex-1 p-6 bg-[#14132D] overflow-auto">{children}</div>
                </div>
            </body>
        </html>
    );
}
