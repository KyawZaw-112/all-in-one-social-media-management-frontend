"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type AdminRecord = {
    role?: string | null;
    is_active?: boolean | null;
};

function hasAdminAccess(record: AdminRecord | null) {
    if (!record) return false;

    const roleAllowed = !record.role || record.role === "admin";
    const activeAllowed = record.is_active !== false;

    return roleAllowed && activeAllowed;
}

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

            const { data, error } = await supabase
                .from("admin_users")
                .select("*")
                .eq("user_id", user.id)
                .limit(1)
                .maybeSingle();

            if (error || !hasAdminAccess((data as AdminRecord | null) ?? null)) {
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
