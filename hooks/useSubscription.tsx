"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

type SubscriptionStatus = "active" | "expired" | "none";

export function useSubscription() {
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<any>(null);
    const [status, setStatus] = useState<SubscriptionStatus>("none");

    const fetchSubscription = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            setLoading(false);
            return;
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions/me`,
            {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            }
        );

        const data = await response.json();

        if (!data || data.status === "none") {
            setStatus("none");
            setSubscription(null);
            setLoading(false);
            return;
        }

        const isExpired =
            data.expires_at &&
            new Date(data.expires_at) < new Date();

        if (isExpired) {
            setStatus("expired");
        } else {
            setStatus("active");
        }

        setSubscription(data);
        setLoading(false);
    };

    useEffect(() => {
        let channel: any;

        const init = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                setLoading(false);
                return;
            }

            await fetchSubscription();

            // 🔥 REAL-TIME LISTENER
            channel = supabase
                .channel("subscription-changes")
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "subscriptions",
                        filter: `user_id=eq.${session.user.id}`,
                    },
                    (payload) => {
                        console.log("Realtime subscription update:", payload);
                        fetchSubscription(); // auto refresh when updated
                    }
                )
                .subscribe();
        };

        init();

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, []);

    // 🔄 AUTO REFRESH ON TAB FOCUS
    useEffect(() => {
        const handleFocus = () => {
            fetchSubscription();
        };

        window.addEventListener("focus", handleFocus);

        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, []);

    return { loading, status, subscription, refresh: fetchSubscription };
}
