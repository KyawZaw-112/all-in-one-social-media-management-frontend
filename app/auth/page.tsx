"use client";

import { useState } from "react";
import  supabase  from "@/lib/supabase";
import ResendEmail from "@/components/ResendEmail";

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setMessage(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage("✅ Logged in successfully");
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                setMessage("📩 Check your email to confirm your account");
            }
        } catch (err: any) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded">
            <h1 className="text-2xl font-bold mb-4">
                {isLogin ? "Login" : "Sign Up"}
            </h1>

            <form onSubmit={handleAuth} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white p-2 disabled:opacity-50"
                >
                    {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
                </button>
            </form>

            {message && <p className="mt-4 text-sm">{message}</p>}

            {!isLogin && message?.includes("Check your email") && (
                <ResendEmail email={email} />
            )}

            <button
                onClick={() => setIsLogin(!isLogin)}
                className="mt-4 text-sm underline"
            >
                {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Login"}
            </button>
        </div>
    );
}
