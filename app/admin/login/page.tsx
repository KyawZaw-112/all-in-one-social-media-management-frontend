"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Input, Button, Typography, message } from "antd";
import  supabase  from "@/lib/supabase";
import { checkCurrentUserAdminAccess } from "@/lib/adminAccess";

const { Title } = Typography;

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

        const hasAccess = await checkCurrentUserAdminAccess(authData.user.id);
        console.log('User ID:', authData.user.id);
        console.log('Has admin access:', hasAccess);
        if (!hasAccess) {
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
