import Menu from "./dashboard/_components/Menu";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-[800px] flex">
            {/* LEFT - Menu Sidebar */}
            <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
                <Menu />
            </div>

            {/* RIGHT - Nội dung động */}
            <div className="flex-1 p-6 bg-[#F7F8FA] overflow-auto">
                {children}
            </div>
        </div>
    );
}

