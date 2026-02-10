"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { checkCurrentSessionAdminAccess } from "@/lib/adminAccess";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const login = async () => {
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        const hasAccess = await checkCurrentSessionAdminAccess();

        if (!hasAccess) {
            await supabase.auth.signOut();
            setError("You do not have admin access");
            setLoading(false);
            return;
        }

        router.push("/admin");
    };

    return (
        <div className="p-6 max-w-sm mx-auto">
            <h1 className="text-xl font-bold mb-4">Admin Login</h1>

            {error && <div className="text-red-500 mb-2">{error}</div>}

            <input
                className="border p-2 w-full mb-2"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                className="border p-2 w-full mb-4"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                onClick={login}
                disabled={loading}
                className="bg-black text-white px-4 py-2 w-full"
            >
                {loading ? "Signing in..." : "Sign In"}
            </button>
        </div>
    );
}
