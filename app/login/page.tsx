"use client";

import { useState } from "react";
import Link from "next/link";
import  supabase  from "@/lib/supabase";

import {
    Card,
    Form,
    Input,
    Button,
    Typography,
    Alert,
    Space,
} from "antd";
import {
    EyeInvisibleOutlined,
    EyeTwoTone,
    MailOutlined,
    UserOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const login = async (values: { email: string; password: string }) => {
        setLoading(true);
        setErrorMsg(null);

        const { data,error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
        });

        setLoading(false);

        if (error) {
            setErrorMsg(error.message);
            return;
        }
        const user = data.user

        await fetch("/api/log-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: user.id,
                email: user.email,
            }),
        });

        window.location.href = "/dashboard";
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
                background: "#fafafa",
            }}
        >
            <Card style={{ width: "100%", maxWidth: 380 }}>
                <Space orientation="vertical" size={16} style={{ width: "100%" }}>
                    <div>
                        <Title level={3} style={{ marginBottom: 4 }}>
                            Welcome back
                        </Title>
                        <Text type="secondary">Sign in to your account</Text>
                    </div>

                    <Form layout="vertical" onFinish={login}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Please enter your email" },
                                { type: "email", message: "Invalid email address" },
                            ]}
                        >
                            <Input
                                placeholder="you@example.com"
                                prefix={<UserOutlined />}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: "Please enter your password" }]}
                        >
                            <Input.Password
                                placeholder="••••••••"
                                iconRender={(visible) =>
                                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                }
                            />
                        </Form.Item>

                        {errorMsg && (
                            <Alert
                                type="error"
                                showIcon
                                message={errorMsg}
                                description={
                                    <span>
                    Trouble logging in?{" "}
                                        <a href="mailto:developer@example.com">
                      Contact developer
                    </a>
                  </span>
                                }
                                style={{ marginBottom: 16 }}
                            />
                        )}

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                        >
                            Login
                        </Button>
                    </Form>
                </Space>
            </Card>
        </div>
    );
}
