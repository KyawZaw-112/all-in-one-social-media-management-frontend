"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchWithAuth } from "@/lib/api";

type SubscriptionStatus = "active" | "expired" | "none";

export function useSubscription() {
    const [status, setStatus] = useState<SubscriptionStatus>("none");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                setStatus("none");
                setLoading(false);
                return;
            }

            try {
                const res = await fetchWithAuth(
                    "/subscriptions/me",
                    session.access_token
                );

                // expected backend response:
                // { status: "active" | "expired" | "none" }
                setStatus(res.status ?? "none");
            } catch (err) {
                console.error("Failed to load subscription", err);
                setStatus("none");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return {
        loading,
        status,
        active: status === "active",
    };
}
