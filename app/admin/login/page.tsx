"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Input, Button, Typography, message } from "antd";
import { supabase } from "@/lib/supabase";

const { Title } = Typography;

type AdminRecord = {
    role?: string | null;
    is_active?: boolean | null;
};

function hasAdminAccess(record: AdminRecord | null) {
    if (!record) return false;

    const roleAllowed = !record.role || record.role === "admin";
    const activeAllowed = record.is_active !== false;

    return roleAllowed && activeAllowed;
}

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setLoading(true);

        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            message.error(error.message);
            setLoading(false);
            return;
        }

        const { data: adminData, error: adminError } = await supabase
            .from("admin_users")
            .select("*")
            .eq("user_id", authData.user.id)
            .limit(1)
            .maybeSingle();

        if (adminError || !hasAdminAccess((adminData as AdminRecord | null) ?? null)) {
            await supabase.auth.signOut();
            message.error("You do not have admin access");
            setLoading(false);
            return;
        }

        message.success("Admin login successful");
        router.replace("/admin");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <Card style={{ width: 360 }}>
                <Title level={4} className="text-center">
                    Admin Login
                </Title>

                <Input
                    placeholder="Admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-3"
                />

                <Input.Password
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4"
                />

                <Button
                    type="primary"
                    block
                    loading={loading}
                    onClick={handleLogin}
                >
                    Login
                </Button>
            </Card>
        </div>
    );
}
