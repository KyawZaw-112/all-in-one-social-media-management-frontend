"use client";

import { useState } from "react";
import { Card, Input, Button, Typography, message } from "antd";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";

const { Title } = Typography;

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignup = async () => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            message.error(error.message);
            return;
        }

        message.success("Account created. please wait admin's confirmation.");
        router.push("/subscribe/manual");
    };

    return (
        <Card style={{ maxWidth: 400, margin: "100px auto" }}>
            <Title level={3}>Sign Up</Title>

            <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: 10 }}
            />

            <Input.Password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginBottom: 10 }}
            />

            <Button type="primary" block onClick={handleSignup}>
                Sign Up
            </Button>
        </Card>
    );
}
