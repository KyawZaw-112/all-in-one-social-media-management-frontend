"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // 1️⃣ Login via Supabase Auth
        const { data, error: authError } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (authError || !data.user) {
            setError("Invalid email or password");
            setLoading(false);
            return;
        }

        // 2️⃣ Check admin_users table
        const { data: admin, error: adminError } = await supabase
            .from("admin_users")
            .select("id, role, is_active")
            .eq("user_id", data.user.id)
            .single();

        if (adminError || !admin || !admin.is_active) {
            await supabase.auth.signOut();
            setError("You do not have admin access");
            setLoading(false);
            return;
        }

        // 3️⃣ Success → go to admin dashboard
        router.replace("/admin");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-sm bg-white p-6 rounded-lg shadow"
            >
                <h1 className="text-2xl font-semibold mb-6 text-center">
                    Admin Login
                </h1>

                {error && (
                    <div className="mb-4 text-sm text-red-600">{error}</div>
                )}

                <div className="mb-4">
                    <label className="block text-sm mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>
            </form>
        </div>
    );
}
