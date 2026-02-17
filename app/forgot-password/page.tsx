"use client";

import { useState } from "react";
import { Form, Input, Button, Card, message, Typography, Result } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import axios from "axios";

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            await axios.post(`${apiUrl}/api/oauth/forgot-password`, { email: values.email });
            setSent(true);
        } catch (error: any) {
            message.error(error.response?.data?.error || "တစ်ခုခု မှားယွင်းနေပါသည်။ ထပ်ကြိုးစားကြည့်ပါ။");
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 20px"
            }}>
                <Card style={{ maxWidth: 450, width: "100%", borderRadius: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.06)", border: "none" }}>
                    <Result
                        status="success"
                        title="Email ပို့ပြီးပါပြီ!"
                        subTitle="သင့် email inbox ကို စစ်ကြည့်ပြီး password reset link ကို နှိပ်ပါ။ Spam folder ကိုလည်း စစ်ကြည့်ပေးပါ။"
                        extra={[
                            <Link key="login" href="/login">
                                <Button type="primary" size="large" style={{
                                    borderRadius: 12,
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    border: "none",
                                    height: 48,
                                    padding: "0 40px"
                                }}>
                                    Login Page သို့
                                </Button>
                            </Link>
                        ]}
                    />
                </Card>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "#f8fafc",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 20px"
        }}>
            <div style={{ textAlign: "center", marginBottom: 30 }}>
                <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                }}>
                    <MailOutlined style={{ fontSize: 32, color: "white" }} />
                </div>
                <Title level={2} style={{ margin: 0 }}>Password မေ့နေပါသလား?</Title>
                <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                    သင့် email ကို ရိုက်ထည့်ပြီး reset link ရယူပါ
                </Text>
            </div>

            <Card style={{
                width: "100%",
                maxWidth: 420,
                borderRadius: 24,
                boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                border: "none"
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
                            prefix={<MailOutlined style={{ color: "#bbb" }} />}
                            placeholder="သင့် Email Address"
                            size="large"
                            style={{ borderRadius: 12, height: 50 }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 12 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
                            style={{
                                borderRadius: 12,
                                height: 50,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                border: "none",
                                fontWeight: 600,
                                fontSize: 16
                            }}
                        >
                            Reset Link ပို့မည်
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: "center" }}>
                        <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <ArrowLeftOutlined /> Login Page သို့ ပြန်သွားမည်
                        </Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
