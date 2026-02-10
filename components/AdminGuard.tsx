"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

            const { data  } = await supabase
                .from("admin_users")
                .select("id, role")
                .eq("user_id", user.id)
                .eq("is_active", true)
                .single();

            if (!data || data.role !== "admin") {
                router.replace("/admin/login");
                return;
            }

            if (!data) {
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
