"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Form, Input, Button, Card, message, Typography, Result, Spin } from "antd";
import { LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import supabase from "@/lib/supabase";

const { Title, Text } = Typography;

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Supabase will redirect here with hash params after email link click
    // The client SDK handles token exchange automatically

    const onFinish = async (values: any) => {
        if (values.password !== values.confirmPassword) {
            message.error("Password နှစ်ခု မတူညီပါ");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: values.password
            });

            if (error) throw error;

            setSuccess(true);
            message.success("Password အောင်မြင်စွာ ပြောင်းလဲပြီးပါပြီ!");
        } catch (err: any) {
            message.error(err.message || "Password ပြောင်းလဲ၍ မရပါ");
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
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
                        title="Password ပြောင်းပြီးပါပြီ!"
                        subTitle="Password အသစ်ဖြင့် login ပြန်ဝင်နိုင်ပါပြီ"
                        extra={[
                            <Link key="login" href="/login">
                                <Button type="primary" size="large" style={{
                                    borderRadius: 12,
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    border: "none",
                                    height: 48,
                                    padding: "0 40px"
                                }}>
                                    Login ဝင်မည်
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
                    <LockOutlined style={{ fontSize: 32, color: "white" }} />
                </div>
                <Title level={2} style={{ margin: 0 }}>Password အသစ် သတ်မှတ်ရန်</Title>
                <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                    Password အသစ်ကို ရိုက်ထည့်ပါ (အနည်းဆုံး ၆ လုံး)
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
                        name="password"
                        rules={[
                            { required: true, message: "Password အသစ် ထည့်ပေးပါ" },
                            { min: 6, message: "အနည်းဆုံး ၆ လုံး ရှိရပါမည်" }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: "#bbb" }} />}
                            placeholder="Password အသစ်"
                            size="large"
                            style={{ borderRadius: 12, height: 50 }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: "Password ကို ထပ်မံရိုက်ထည့်ပါ" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Password နှစ်ခု မတူညီပါ'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: "#bbb" }} />}
                            placeholder="Password ကို ထပ်ရိုက်ထည့်ပါ"
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
                            Password ပြောင်းလဲမည်
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Spin size="large" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
