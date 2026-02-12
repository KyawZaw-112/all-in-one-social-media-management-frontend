"use client";

import { useEffect, useState } from "react";
import  supabase  from "@/lib/supabase";

export function useSubscription() {
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(false);
    const [subscription, setSubscription] = useState<any>(null);

    useEffect(() => {
        const load = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                setLoading(false);
                return;
            }

            try {
                // Use backend API instead of direct Supabase query to avoid RLS issues
                const response = await fetch("/api/subscriptions/me", {
                    headers: {
                        "Authorization": `Bearer ${session.access_token}`,
                    },
                });

                if (!response.ok) {
                    console.error("Failed to fetch subscription:", response.status);
                    setLoading(false);
                    return;
                }

                const data = await response.json();

                // Backend returns { status, plan }
                if (!data || data.status === "none") {
                    setLoading(false);
                    return;
                }

                const isActive = data.status === "active";

                setSubscription(data);
                setActive(isActive);
                setLoading(false);
                console.log("Subscription:", data);
            } catch (error) {
                console.error("Error fetching subscription:", error);
                setLoading(false);
            }
        };

        load();
    }, []);


    return { loading, active, subscription };
}
