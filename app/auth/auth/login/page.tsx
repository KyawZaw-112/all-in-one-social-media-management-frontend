"use client";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const login = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: "holeokyawzawwin@gmail.com",
            password: "Password123!", // must match dashboard
        });

        console.log("DATA:", data);
        console.log("ERROR:", error);
    };

    return (
        <button onClick={login}>
            Login
        </button>
    );
}
