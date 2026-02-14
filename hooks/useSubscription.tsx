"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export function useSubscription() {
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<any>(null);
    const [status, setStatus] = useState<"active" | "pending" | "expired" | "none">("none");

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
                    setLoading(false);
                    return;
                }

                setSubscription(data);

                if (data.status === "active") {
                    setStatus("active");
                } else if (data.status === "expired") {
                    setStatus("expired");
                } else {
                    setStatus("none");
                }

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        load();
    }, []);

    return { loading, status, subscription };
}
