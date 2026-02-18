"use client";

import { useState, useEffect } from "react";
import {
    Layout,
    Card,
    Row,
    Col,
    Statistic,
    Button,
    Typography,
    Space,
    Badge,
    List,
    Avatar,
    Tag,
    Divider
} from "antd";
import {
    HomeOutlined,
    RobotOutlined,
    BarChartOutlined,
    UserOutlined,
    PlusOutlined,
    ArrowRightOutlined,
    BellOutlined,
    FacebookOutlined,
    CreditCardOutlined,
    SettingOutlined,
    LogoutOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import axios from "axios";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const { Title, Text, Paragraph } = Typography;

export default function UserDashboard() {
    const router = useRouter();
    const { t } = useLanguage();
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            try {
                const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
                const res = await axios.get(`${apiUrl}/api/automation/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data.data);
            } catch (err) {
                console.error("Failed to fetch stats");
            }
        };
        fetchStats();
    }, []);

    return (
        <AuthGuard>
            <div style={{ minHeight: "100vh", background: "#ffffff", padding: "40px 24px" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

                    {/* Header */}
                    <div style={{ marginBottom: "48px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                            <Text type="secondary" style={{ fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase" }}>{t.dashboard.overview}</Text>
                            <Title level={2} style={{ margin: "4px 0 0 0", fontWeight: 300 }}>{t.dashboard.dashboard}</Title>
                        </div>
                        <Button icon={<SettingOutlined />} type="text" size="large" />
                    </div>

                    {/* Stats Grid */}
                    <Row gutter={[24, 24]} style={{ marginBottom: "48px" }}>
                        <Col xs={24} sm={8}>
                            <Card bordered={false} style={{ background: "#f8fafc", borderRadius: "16px" }}>
                                <Statistic
                                    title={<Text type="secondary">{t.dashboard.activeFlows}</Text>}
                                    value={stats?.active_flows || 0}
                                    valueStyle={{ fontSize: "36px", fontWeight: 300 }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card bordered={false} style={{ background: "#f8fafc", borderRadius: "16px" }}>
                                <Statistic
                                    title={<Text type="secondary">{t.dashboard.totalReplies}</Text>}
                                    value={stats?.conversations?.completed || 0}
                                    valueStyle={{ fontSize: "36px", fontWeight: 300 }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card bordered={false} style={{ background: "#f8fafc", borderRadius: "16px", cursor: "pointer" }} onClick={() => router.push("/dashboard/platforms")}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
                                    <div>
                                        <Text type="secondary" style={{ display: "block", marginBottom: "8px" }}>{t.dashboard.status}</Text>
                                        <Text strong style={{ fontSize: "18px", color: "#10b981" }}>{t.dashboard.systemActive}</Text>
                                    </div>
                                    <div style={{ background: "#ffffff", padding: "12px", borderRadius: "50%" }}>
                                        <RobotOutlined style={{ fontSize: "20px" }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    {/* Main Content Split */}
                    <Row gutter={[48, 48]}>
                        <Col xs={24} md={16}>
                            <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Title level={4} style={{ margin: 0, fontWeight: 400 }}>{t.dashboard.quickActions}</Title>
                            </div>

                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Card hoverable bordered style={{ borderRadius: "12px", borderColor: "#e2e8f0" }} onClick={() => router.push("/automation/facebook")}>
                                        <Space direction="vertical">
                                            <RobotOutlined style={{ fontSize: "24px", color: "#6366f1" }} />
                                            <Text strong>{t.dashboard.createNewFlow}</Text>
                                            <Text type="secondary" style={{ fontSize: "12px" }}>{t.dashboard.automateResponses}</Text>
                                        </Space>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card hoverable bordered style={{ borderRadius: "12px", borderColor: "#e2e8f0" }} onClick={() => router.push("/dashboard/platforms")}>
                                        <Space direction="vertical">
                                            <FacebookOutlined style={{ fontSize: "24px", color: "#1877f2" }} />
                                            <Text strong>{t.dashboard.connectPage}</Text>
                                            <Text type="secondary" style={{ fontSize: "12px" }}>{t.dashboard.linkFacebook}</Text>
                                        </Space>
                                    </Card>
                                </Col>
                            </Row>

                            <Divider style={{ margin: "40px 0" }} />

                            <div style={{ marginBottom: "24px" }}>
                                <Title level={4} style={{ margin: 0, fontWeight: 400 }}>{t.dashboard.recentActivity}</Title>
                            </div>

                            {stats?.conversations?.total > 0 ? (
                                <List
                                    itemLayout="horizontal"
                                    dataSource={[1, 2, 3]}
                                    renderItem={() => (
                                        <List.Item style={{ padding: "24px 0", borderBottom: "1px solid #f1f5f9" }}>
                                            <List.Item.Meta
                                                avatar={<Avatar style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} icon={<UserOutlined />} />}
                                                title={<Text>{t.dashboard.newMessageProcessed}</Text>}
                                                description={<Text type="secondary" style={{ fontSize: "12px" }}>{t.dashboard.autoReplySent}</Text>}
                                            />
                                            <Tag bordered={false} color="success">{t.dashboard.completed}</Tag>
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <div style={{ padding: "60px 0", textAlign: "center", background: "#fafafa", borderRadius: "16px" }}>
                                    <Text type="secondary">{t.dashboard.noActivity}</Text>
                                </div>
                            )}
                        </Col>

                        <Col xs={24} md={8}>
                            <Card bordered={false} style={{ borderRadius: "24px", background: "#f8fafc" }}>
                                <div style={{ textAlign: "center", padding: "24px 0" }}>
                                    <Avatar size={80} style={{ backgroundColor: "#1e293b", marginBottom: "16px" }} icon={<UserOutlined />} />
                                    <Title level={4} style={{ marginBottom: "4px" }}>{t.dashboard.merchantAccount}</Title>
                                    <Text type="secondary">{t.dashboard.freeUser}</Text>

                                    <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                        <Button block size="large" onClick={() => router.push("/dashboard/profile")}>{t.dashboard.editProfile}</Button>
                                        <Button block size="large" onClick={() => router.push("/dashboard/billing")} icon={<CreditCardOutlined />}>{t.dashboard.billingHistory}</Button>
                                        <Button block type="text" danger icon={<LogoutOutlined />} onClick={() => { localStorage.clear(); router.push("/login"); }}>{t.nav.signOut}</Button>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </AuthGuard>
    );
}
