"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Form, Input, Button, Card, message, Space, Divider, Typography } from "antd";
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

    // Get plan from URL (default to shop if not found)
    const plan = searchParams.get("plan") || "shop";
    const isCargo = plan === "cargo";

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

            // SaaS registration data
            const signupData = {
                ...values,
                subscription_plan: plan,
                trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days trial
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
            background: "#f0f2f5",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px 20px"
        }}>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <Title level={2} style={{ margin: 0 }}>Create Account</Title>
                <Text type="secondary">သင့်လုပ်ငန်းအတွက် Auto-Reply စတင်ရန် အကောင့်ဖွင့်ပါ</Text>
            </div>

            <Card style={{ width: "100%", maxWidth: "400px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                {/* Selected Plan Info */}
                <div style={{
                    background: isCargo ? "#fff7e6" : "#e6f7ff",
                    padding: "12px",
                    borderRadius: "12px",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    border: `1px solid ${isCargo ? "#ffd591" : "#91d5ff"}`
                }}>
                    <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: isCargo ? "#fa8c16" : "#1890ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "20px"
                    }}>
                        {isCargo ? <CarOutlined /> : <ShopOutlined />}
                    </div>
                    <div>
                        <div style={{ fontWeight: "bold" }}>{isCargo ? "Cargo & Delivery Plan" : "Online Shop Plan"}</div>
                        <div style={{ fontSize: "12px", color: "#666" }}>7 Days Free Trial Included <CheckCircleFilled style={{ color: "#52c41a" }} /></div>
                    </div>
                    <Link href="/#pricing" style={{ fontSize: "12px", marginLeft: "auto" }}>Change</Link>
                </div>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: "သင့်အမည် ထည့်ပေးပါ" }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="သင့်အမည် (Full Name)"
                            size="large"
                            style={{ borderRadius: "8px" }}
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
                            prefix={<MailOutlined />}
                            placeholder="Email Address"
                            size="large"
                            style={{ borderRadius: "8px" }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: "Password ထည့်ပေးပါ" }, { min: 6, message: "အနည်းဆုံး ၆ လုံး ရှိရပါမည်" }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            size="large"
                            style={{ borderRadius: "8px" }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: "12px" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
                            style={{ borderRadius: "8px", height: "45px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", border: "none" }}
                        >
                            Sign Up - Free Trial စမည်
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: "center" }}>
                        <Text type="secondary">ရှိပြီးသား အကောင့်ရှိလား? </Text>
                        <Link href="/login">Login ဝင်ရန်</Link>
                    </div>
                </Form>
            </Card>

            <div style={{ marginTop: "40px", color: "#999", fontSize: "12px", textAlign: "center" }}>
                By signing up, you agree to our Terms and Privacy Policy.
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignupForm />
        </Suspense>
    );
}
