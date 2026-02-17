"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import axios from "axios";

const { Title, Text } = Typography;

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const response = await axios.post(`${apiUrl}/api/oauth/login`, values);

            if (response.data.token) {
                localStorage.setItem("authToken", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));

                message.success("Login အောင်မြင်ပါသည်။ 👋");

                // Admin ဆိုရင် Admin Panel ကို သွား၊ ရိုးရိုး User ဆိုရင် Dashboard ကို သွား
                const isAdmin = values.email === "admin@autoreply.biz";

                setTimeout(() => {
                    if (isAdmin) {
                        router.push("/admin/dashboard");
                    } else {
                        router.push("/dashboard");
                    }
                }, 500); // ခဏလေး စောင့်ပြီးမှ redirect လုပ်မယ် (localStorage သေချာသွားအောင်)
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
            background: "#f0f2f5",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 20px"
        }}>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <Title level={2} style={{ margin: 0 }}>Welcome Back</Title>
                <Text type="secondary">သင့် Dashboard သို့ ပြန်လည်ဝင်ရောက်ပါ</Text>
            </div>

            <Card style={{ width: "100%", maxWidth: "400px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                <Form layout="vertical" onFinish={onFinish}>
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
                        rules={[{ required: true, message: "Password ထည့်ပေးပါ" }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            size="large"
                            style={{ borderRadius: "8px" }}
                        />
                    </Form.Item>

                    <div style={{ textAlign: "right", marginBottom: "20px" }}>
                        <Link href="/forgot-password" style={{ fontSize: "12px" }}>Password မေ့နေပါသလား?</Link>
                    </div>

                    <Form.Item style={{ marginBottom: "12px" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
                            style={{
                                borderRadius: "8px",
                                height: "45px",
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                border: "none"
                            }}
                        >
                            Login ဝင်မည်
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: "center" }}>
                        <Text type="secondary">အကောင့်မရှိသေးဘူးလား? </Text>
                        <Link href="/signup">Sign Up လုပ်ရန်</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
