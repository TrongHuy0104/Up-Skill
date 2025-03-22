"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function ClientOnly({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    // Nếu route là `/admin`, không hiển thị layout chung
    if (pathname.startsWith("/admin")) {
        return null;
    }

    return <>{children}</>;
}
