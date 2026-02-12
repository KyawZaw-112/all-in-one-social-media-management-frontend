"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useAuth() {
    const [token, setToken] = useState<string>("");

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setToken(data.session?.access_token || "");
        };

        getSession();
    }, []);

    return { token };
}
