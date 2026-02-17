"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Form, Input, Button, Card, message, Typography, Spin } from "antd";
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    ShopOutlined,
    CarOutlined,
    CheckCircleFilled
} from "@ant-design/icons";
import Link from "next/link";
import axios from "axios";

const { Title, Text } = Typography;

function SignupForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const plan = searchParams.get("plan") || "shop";
    const isCargo = plan === "cargo";

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

            const signupData = {
                ...values,
                subscription_plan: plan,
                trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            };

            const response = await axios.post(`${apiUrl}/api/oauth/register`, signupData);

            if (response.data.success) {
                message.success("အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်။ 🚀");
                localStorage.setItem("authToken", response.data.token);
                router.push("/dashboard");
            }
        } catch (error: any) {
            message.error(error.response?.data?.error || "အကောင့်ဖွင့်ခြင်း မအောင်မြင်ပါ။ ပြန်ကြိုးစားကြည့်ပါ။");
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
            padding: "60px 20px",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Background Glow */}
            <div style={{
                position: "absolute",
                width: 500,
                height: 500,
                borderRadius: "50%",
                background: isCargo
                    ? "radial-gradient(circle, rgba(251,146,60,0.08) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)",
                top: "5%",
                right: "10%",
                filter: "blur(60px)",
                pointerEvents: "none",
            }} />

            <div style={{ textAlign: "center", marginBottom: 30, position: "relative", zIndex: 1 }}>
                <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    background: isCargo
                        ? "linear-gradient(135deg, #fb923c, #f59e0b)"
                        : "linear-gradient(135deg, #818cf8, #a78bfa)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: 28,
                }}>
                    {isCargo ? "📦" : "🛍️"}
                </div>
                <Title level={2} style={{ margin: 0, color: "#f1f5f9" }}>Create Account</Title>
                <Text style={{ color: "#94a3b8" }}>
                    {isCargo ? "Cargo & Delivery" : "Online Shop"} Auto-Reply စတင်ရန်
                </Text>
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
                {/* Plan Badge */}
                <div style={{
                    background: isCargo
                        ? "rgba(251,146,60,0.08)"
                        : "rgba(129,140,248,0.08)",
                    padding: "14px 18px",
                    borderRadius: 16,
                    marginBottom: 24,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    border: `1px solid ${isCargo ? "rgba(251,146,60,0.2)" : "rgba(129,140,248,0.2)"}`,
                }}>
                    <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: isCargo
                            ? "linear-gradient(135deg, #fb923c, #f59e0b)"
                            : "linear-gradient(135deg, #818cf8, #a78bfa)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: 20,
                    }}>
                        {isCargo ? <CarOutlined /> : <ShopOutlined />}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 15 }}>
                            {isCargo ? "Cargo & Delivery Plan" : "Online Shop Plan"}
                        </div>
                        <div style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
                            7 Days Free Trial <CheckCircleFilled style={{ color: "#22c55e" }} />
                        </div>
                    </div>
                    <Link href="/#pricing" style={{ fontSize: 12, color: "#818cf8" }}>Change</Link>
                </div>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: "သင့်အမည် ထည့်ပေးပါ" }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: "#64748b" }} />}
                            placeholder="သင့်အမည် (Full Name)"
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
                        rules={[
                            { required: true, message: "Password ထည့်ပေးပါ" },
                            { min: 6, message: "အနည်းဆုံး ၆ လုံး ရှိရပါမည်" }
                        ]}
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
                                background: isCargo
                                    ? "linear-gradient(135deg, #fb923c, #f59e0b)"
                                    : "linear-gradient(135deg, #818cf8, #a78bfa)",
                                border: "none",
                                fontWeight: 600,
                                fontSize: 16,
                                boxShadow: isCargo
                                    ? "0 8px 24px rgba(251,146,60,0.3)"
                                    : "0 8px 24px rgba(129,140,248,0.3)"
                            }}
                        >
                            Sign Up — Free Trial စမည်
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: "center" }}>
                        <Text style={{ color: "#94a3b8" }}>ရှိပြီးသား အကောင့်ရှိလား? </Text>
                        <Link href="/login" style={{ color: "#818cf8", fontWeight: 600 }}>Login ဝင်ရန်</Link>
                    </div>
                </Form>
            </Card>

            <div style={{ marginTop: 40, color: "#475569", fontSize: 12, textAlign: "center", position: "relative", zIndex: 1 }}>
                By signing up, you agree to our Terms and Privacy Policy.
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f" }}>
                <Spin size="large" />
            </div>
        }>
            <SignupForm />
        </Suspense>
    );
}
