"use client";

import { usePathname } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";

export default function AdminLayoutGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return <AdminGuard>{children}</AdminGuard>;
}
