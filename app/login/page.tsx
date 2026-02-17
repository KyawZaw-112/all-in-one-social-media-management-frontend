"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import axios from "axios";

const { Title, Text } = Typography;

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const response = await axios.post(`${apiUrl}/api/oauth/login`, values);

            if (response.data.token) {
                localStorage.setItem("authToken", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));

                message.success("Login အောင်မြင်ပါသည်။ 👋");

                const isAdmin = values.email === "admin@autoreply.biz";

                setTimeout(() => {
                    if (isAdmin) {
                        router.push("/admin/dashboard");
                    } else {
                        router.push("/dashboard");
                    }
                }, 500);
            }
        } catch (error: any) {
            message.error(error.response?.data?.error || "Email သို့မဟုတ် Password မှားယွင်းနေပါသည်။");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#0a0a0f",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 20px",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Background Glow */}
            <div style={{
                position: "absolute",
                width: 500,
                height: 500,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)",
                top: "10%",
                left: "20%",
                filter: "blur(60px)",
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute",
                width: 400,
                height: 400,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)",
                bottom: "10%",
                right: "20%",
                filter: "blur(60px)",
                pointerEvents: "none",
            }} />

            <div style={{ textAlign: "center", marginBottom: 30, position: "relative", zIndex: 1 }}>
                <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: 28,
                }}>
                    🤖
                </div>
                <Title level={2} style={{ margin: 0, color: "#f1f5f9" }}>Welcome Back</Title>
                <Text style={{ color: "#94a3b8" }}>သင့် Dashboard သို့ ပြန်လည်ဝင်ရောက်ပါ</Text>
            </div>

            <Card style={{
                width: "100%",
                maxWidth: 420,
                borderRadius: 24,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(20px)",
                position: "relative",
                zIndex: 1,
            }}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: "Email ထည့်ပေးပါ" },
                            { type: "email", message: "Email ပုံစံ မှန်ကန်မှု မရှိပါ" }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined style={{ color: "#64748b" }} />}
                            placeholder="Email Address"
                            size="large"
                            style={{
                                borderRadius: 14,
                                height: 52,
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "#f1f5f9",
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: "Password ထည့်ပေးပါ" }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: "#64748b" }} />}
                            placeholder="Password"
                            size="large"
                            style={{
                                borderRadius: 14,
                                height: 52,
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "#f1f5f9",
                            }}
                        />
                    </Form.Item>

                    <div style={{ textAlign: "right", marginBottom: 20 }}>
                        <Link href="/forgot-password" style={{ fontSize: 13, color: "#818cf8" }}>
                            Password မေ့နေပါသလား?
                        </Link>
                    </div>

                    <Form.Item style={{ marginBottom: 16 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
                            style={{
                                borderRadius: 14,
                                height: 52,
                                background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                                border: "none",
                                fontWeight: 600,
                                fontSize: 16,
                                boxShadow: "0 8px 24px rgba(129,140,248,0.3)"
                            }}
                        >
                            Login ဝင်မည်
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: "center" }}>
                        <Text style={{ color: "#94a3b8" }}>အကောင့်မရှိသေးဘူးလား? </Text>
                        <Link href="/signup" style={{ color: "#818cf8", fontWeight: 600 }}>Sign Up လုပ်ရန်</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
