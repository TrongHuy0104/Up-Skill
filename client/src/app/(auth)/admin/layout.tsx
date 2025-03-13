// app/admin/layout.tsx
import { ReactNode } from 'react';
import Sidebar from './_components/SideBar';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="overflow-x-hidden relative">
                <div className="h-screen flex">
                    {/* LEFT - Menu Sidebar */}
                    <div className="w-1/5 p-4 bg-[#131836]">
                        <Sidebar />
                    </div>

                    {/* RIGHT - Nội dung động */}
                    <div className="w-4/5 flex-1 p-6 bg-[#14132D] overflow-auto">{children}</div>
                </div>
            </body>
        </html>
    );
}
