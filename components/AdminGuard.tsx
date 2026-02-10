"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { checkCurrentUserAdminAccess } from "@/lib/adminAccess";

export default function AdminGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAdmin() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.replace("/admin/login");
                return;
            }

            const hasAccess = await checkCurrentUserAdminAccess(user.id);

            if (!hasAccess) {
                router.replace("/admin/login");
                return;
            }

            setLoading(false);
        }

        checkAdmin();
    }, [router]);

    if (loading) return null;

    return <>{children}</>;
}
