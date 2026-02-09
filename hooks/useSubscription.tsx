"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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


            const { data, error } = await supabase
                .from("subscriptions")
                .select("*")
                .eq("user_id", session.user.id)
                .single();

            if (error || !data) {
                setLoading(false);
                return;
            }

            const now = new Date();
            const expiresAt = data.expires_at
                ? new Date(data.expires_at)
                : null;

            const isActive =
                data.status === "active" &&
                expiresAt !== null &&
                expiresAt > now;

            setSubscription(data);
            setActive(isActive);
            setLoading(false);
    console.log(data)
        };

        load();
    }, []);



    return { loading, active, subscription };
}
