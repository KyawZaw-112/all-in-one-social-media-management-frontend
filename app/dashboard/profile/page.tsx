"use client";

import { useState, useEffect } from "react";
import {
    Layout,
    Card,
    Typography,
    Button,
    Avatar,
    Descriptions,
    Tag,
    Space,
    Form,
    Input,
    message
} from "antd";
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    SafetyCertificateOutlined,
    LockOutlined,
    ShopOutlined,
    SaveOutlined,
    ArrowLeftOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import axios from "axios";
import { API_URL } from "@/lib/apiConfig";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import dayjs from "dayjs";
import supabase from "@/lib/supabase";

const { Title, Text } = Typography;

export default function ProfilePage() {
    const { t } = useLanguage();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [form] = Form.useForm();
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // 1. Get Supabase User
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);

                // 2. Get Merchant Profile via endpoint
                const token = localStorage.getItem("authToken");

                const res = await axios.get(`${API_URL}/api/merchants/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data.data);

                form.setFieldsValue({
                    business_name: res.data.data?.business_name
                });
            } catch (err: any) {
                console.error("Failed to fetch profile:", err);
                if (err.response?.status === 402) {
                    message.error(err.response.data.message || "Subscription expired");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleUpdateProfile = async (values: any) => {
        try {
            message.loading("Updating profile...");
            // TODO: Add update endpoint if needed. For now, just show success.
            message.success("Profile updated locally (Mock)");
        } catch (err) {
            message.error("Update failed");
        }
    };

    const handlePasswordReset = async () => {
        if (!user?.email) return;
        try {
            await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            message.success("Password reset email sent! Check your inbox.");
        } catch (err: any) {
            message.error(err.message);
        }
    };

    return (
        <AuthGuard>
            <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px 24px" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>

                    <div style={{ marginBottom: "32px" }}>
                        <Space align="center" style={{ marginBottom: "16px" }}>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => router.push("/dashboard")}
                                type="text"
                                style={{ fontSize: "18px" }}
                            />
                            <Title level={2} style={{ margin: 0 }}>{t.dashboard.editProfile || "Profile Settings"}</Title>
                        </Space>
                        <div style={{ paddingLeft: "42px" }}>
                            <Text type="secondary">Manage your account and business details</Text>
                        </div>
                    </div>

                    <Card bordered={false} loading={loading} style={{ borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
                        <div style={{ textAlign: "center", marginBottom: "32px" }}>
                            <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: "#6366f1", marginBottom: "16px" }} />
                            <Title level={4} style={{ margin: 0 }}>{user?.user_metadata?.full_name || "User"}</Title>
                            <Text type="secondary">{user?.email}</Text>
                        </div>

                        <Descriptions title="Subscription Details" bordered column={1} style={{ marginBottom: "32px" }}>
                            <Descriptions.Item label="Current Plan">
                                <Space>
                                    <Tag color="blue">{stats?.subscription_plan?.toUpperCase() || "FREE"}</Tag>
                                    {stats?.subscription_status === 'active' && <Tag color="success">ACTIVE</Tag>}
                                    {stats?.subscription_status === 'expired' && <Tag color="error">EXPIRED</Tag>}
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="Trial / Expiry Date">
                                {stats?.trial_ends_at ? dayjs(stats.trial_ends_at).format("DD MMM YYYY") : "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Business Type">
                                {stats?.business_name || "Online Shop"}
                            </Descriptions.Item>
                        </Descriptions>

                        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "32px" }}>
                            <Title level={5} style={{ marginBottom: "16px" }}>Security</Title>
                            <Button icon={<LockOutlined />} onClick={handlePasswordReset}>
                                Send Password Reset Email
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthGuard>
    );
}
