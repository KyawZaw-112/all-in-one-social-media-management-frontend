// frontend/components/RequireSubscription.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RequireSubscription({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getSession();

            if (!data.session) {
                router.push("/login");
                return;
            }

            const res = await fetch("http://localhost:4000/subscriptions/me", {
                headers: {
                    Authorization: `Bearer ${data.session.access_token}`,
                },
            });

            const json = await res.json();

            if (json.status !== "active") {
                router.push("/subscribe");
            }
        })();
    }, [router]);

    return <>{children}</>;
}
