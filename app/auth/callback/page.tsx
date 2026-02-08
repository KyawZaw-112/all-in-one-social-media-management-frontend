"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(() => {
            router.push("/me");
        });
    }, [router]);

    return <p>Confirming email...</p>;
}
