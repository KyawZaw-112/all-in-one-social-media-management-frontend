"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Form, Input, Button, Card, message, Typography, Spin, Row, Col } from "antd";
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
import { API_URL } from "@/lib/apiConfig";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const { Title, Text } = Typography;

function SignupForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const plan = searchParams.get("plan") || "online_shop";
    const isCargo = plan === "cargo";

    // Sync URL plan to form field
    useEffect(() => {
        form.setFieldsValue({ business_type: plan });
    }, [plan, form]);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/oauth/register`, {
                ...values,
                subscription_plan: values.business_type || plan,
                business_type: values.business_type || plan,
                trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            });

            if (response.data.success) {
                message.success(t.common.success + " 🚀");
                localStorage.setItem("authToken", response.data.token);
                router.push("/dashboard");
            }
        } catch (error: any) {
            message.error(error.response?.data?.error || t.common.error);
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
            {/* Language Switcher */}
            <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
                <LanguageSwitcher />
            </div>

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
                <Title level={2} style={{ margin: 0, color: "#f1f5f9" }}>{t.auth.createAccount}</Title>
                <Text style={{ color: "#94a3b8" }}>
                    {t.auth.signupSubtitle}
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
                            {isCargo ? t.auth.cargoDeliveryPlan : t.auth.onlineShopPlan}
                        </div>
                        <div style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
                            {t.auth.trialIncluded} <CheckCircleFilled style={{ color: "#22c55e" }} />
                        </div>
                    </div>
                    <Link href="/#pricing" style={{ fontSize: 12, color: "#818cf8" }}>{t.auth.changePlan}</Link>
                </div>

                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ business_type: plan }}>
                    <div style={{ marginBottom: 24 }}>
                        <Form.Item name="business_type" noStyle>
                            <Input type="hidden" />
                        </Form.Item>
                        <div style={{ marginBottom: 24 }}>
                            <Text style={{ color: "#94a3b8", display: "block", marginBottom: 12, fontSize: 13 }}>{t.auth.selectBusinessType}</Text>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <div
                                        onClick={() => {
                                            router.replace(`/signup?plan=online_shop`);
                                            form.setFieldsValue({ business_type: "online_shop" });
                                        }}
                                        style={{
                                            padding: "16px 12px",
                                            borderRadius: 16,
                                            background: !isCargo ? "rgba(129,140,248,0.1)" : "rgba(255,255,255,0.02)",
                                            border: `1px solid ${!isCargo ? "rgba(129,140,248,0.4)" : "rgba(255,255,255,0.06)"}`,
                                            textAlign: "center",
                                            cursor: "pointer",
                                            transition: "all 0.3s ease"
                                        }}
                                    >
                                        <div style={{ fontSize: 24, marginBottom: 8 }}>🛍️</div>
                                        <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 13 }}>{t.automation.onlineShop}</div>
                                        <div style={{ color: "#64748b", fontSize: 10, marginTop: 4 }}>{t.auth.onlineShopDesc}</div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div
                                        onClick={() => {
                                            router.replace(`/signup?plan=cargo`);
                                            form.setFieldsValue({ business_type: "cargo" });
                                        }}
                                        style={{
                                            padding: "16px 12px",
                                            borderRadius: 16,
                                            background: isCargo ? "rgba(251,146,60,0.1)" : "rgba(255,255,255,0.02)",
                                            border: `1px solid ${isCargo ? "rgba(251,146,60,0.4)" : "rgba(255,255,255,0.06)"}`,
                                            textAlign: "center",
                                            cursor: "pointer",
                                            transition: "all 0.3s ease"
                                        }}
                                    >
                                        <div style={{ fontSize: 24, marginBottom: 8 }}>📦</div>
                                        <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 13 }}>{t.automation.cargo}</div>
                                        <div style={{ color: "#64748b", fontSize: 10, marginTop: 4 }}>{t.auth.cargoDesc}</div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>

                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: t.auth.nameRequired }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: "#64748b" }} />}
                            placeholder={t.auth.namePlaceholder}
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
                            { required: true, message: t.auth.emailRequired },
                            { type: "email", message: t.auth.emailInvalid }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined style={{ color: "#64748b" }} />}
                            placeholder={t.auth.emailPlaceholder}
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
                            { required: true, message: t.auth.passwordRequired },
                            { min: 6, message: t.auth.passwordMin }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: "#64748b" }} />}
                            placeholder={t.auth.passwordPlaceholder}
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
                            {t.auth.signupButton}
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: "center" }}>
                        <Text style={{ color: "#94a3b8" }}>{t.auth.hasAccount} </Text>
                        <Link href="/login" style={{ color: "#818cf8", fontWeight: 600 }}>{t.auth.loginLink}</Link>
                    </div>
                </Form>
            </Card>

            <div style={{ marginTop: 40, color: "#475569", fontSize: 12, textAlign: "center", position: "relative", zIndex: 1 }}>
                {t.auth.signupTerms}
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
