"use client";

import { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Statistic,
    Button,
    Typography,
    Space,
    List,
    Avatar,
    Tag,
    Divider,
    Switch,
    message,
    Spin,
    Table
} from "antd";
import {
    RobotOutlined,
    UserOutlined,
    FacebookOutlined,
    CreditCardOutlined,
    SettingOutlined,
    LogoutOutlined,
    ShoppingCartOutlined,
    SendOutlined,
    MessageOutlined,
    CheckCircleOutlined,
    CustomerServiceOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import axios from "axios";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { API_URL } from "@/lib/apiConfig";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

export default function UserDashboard() {
    const router = useRouter();
    const { t } = useLanguage();
    const [stats, setStats] = useState<any>(null);
    const [autoReplyOn, setAutoReplyOn] = useState(false);
    const [toggling, setToggling] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
            const res = await axios.get(`${API_URL}/api/merchants/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = res.data.data;
            setStats(data);
            setAutoReplyOn((data.active_flows || 0) > 0);
        } catch (err) {
            console.error("Failed to fetch stats");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleToggleAutoReply = async (checked: boolean) => {
        setToggling(true);
        try {
            const token = localStorage.getItem("authToken");
            await axios.patch(`${API_URL}/api/merchants/toggle-auto-reply`, {
                is_active: checked
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAutoReplyOn(checked);
            message.success(checked ? "Auto-Reply ဖွင့်လိုက်ပါပြီ ✅" : "Auto-Reply ပိတ်လိုက်ပါပြီ");
        } catch (err) {
            message.error("Toggle failed");
        } finally {
            setToggling(false);
        }
    };


    const getStatusIcon = (status: string) => {
        if (status === "replied") return <SendOutlined style={{ color: "#10b981" }} />;
        if (status === "received") return <MessageOutlined style={{ color: "#6366f1" }} />;
        return <CheckCircleOutlined style={{ color: "#94a3b8" }} />;
    };

    if (loading) {
        return (
            <AuthGuard>
                <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Spin size="large" />
                </div>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard>
            <div style={{ minHeight: "100vh", background: "#ffffff", padding: "40px 24px" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

                    {/* Header */}
                    <div style={{ marginBottom: "48px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                            <Text type="secondary" style={{ fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase" }}>{t.dashboard.overview}</Text>
                            <Title level={2} className="hidden md:block" style={{ margin: "4px 0 0 0", fontWeight: 300 }}>{t.dashboard.dashboard}</Title>
                        </div>
                        <Button
                            icon={<SettingOutlined />}
                            type="text"
                            size="large"
                            onClick={() => router.push("/dashboard/profile")}
                        />
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
                        {stats?.business_type === 'cargo' ? (
                            <Col xs={24} sm={8}>
                                <Card bordered={false} style={{ background: "#fffbeb", borderRadius: "16px", cursor: "pointer", border: "1px solid #fef3c7" }} onClick={() => router.push("/dashboard/orders")}>
                                    <Statistic
                                        title={<Text type="secondary" style={{ color: "#92400e" }}>Shipment Requests</Text>}
                                        value={stats?.shipments_count || 0}
                                        valueStyle={{ fontSize: "36px", fontWeight: 300, color: "#f59e0b" }}
                                        prefix={<SendOutlined style={{ fontSize: "20px", marginRight: "8px" }} />}
                                    />
                                </Card>
                            </Col>
                        ) : (
                            <Col xs={24} sm={8}>
                                <Card bordered={false} style={{ background: "#eef2ff", borderRadius: "16px", cursor: "pointer", border: "1px solid #e0e7ff" }} onClick={() => router.push("/dashboard/orders")}>
                                    <Statistic
                                        title={<Text type="secondary" style={{ color: "#3730a3" }}>Orders</Text>}
                                        value={stats?.orders_count || 0}
                                        valueStyle={{ fontSize: "36px", fontWeight: 300, color: "#6366f1" }}
                                        prefix={<ShoppingCartOutlined style={{ fontSize: "20px", marginRight: "8px" }} />}
                                    />
                                </Card>
                            </Col>
                        )}
                    </Row>

                    {/* Main Content Split */}
                    <Row gutter={[48, 48]}>
                        <Col xs={24} md={16}>

                            {/* Auto-Reply Toggle */}
                            <Card bordered={false} style={{
                                borderRadius: "16px",
                                background: autoReplyOn ? "linear-gradient(135deg, #ecfdf5, #f0fdf4)" : "#f8fafc",
                                marginBottom: "32px",
                                border: autoReplyOn ? "1px solid #86efac" : "1px solid #e2e8f0"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Space size="middle">
                                        <RobotOutlined style={{ fontSize: "28px", color: autoReplyOn ? "#10b981" : "#94a3b8" }} />
                                        <div>
                                            <Text strong style={{ fontSize: "16px" }}>Auto-Reply Bot</Text>
                                            <br />
                                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                                {autoReplyOn
                                                    ? "Bot is actively responding to customers"
                                                    : "Bot is currently inactive"}
                                            </Text>
                                        </div>
                                    </Space>
                                    <Switch
                                        checked={autoReplyOn}
                                        onChange={handleToggleAutoReply}
                                        loading={toggling}
                                        checkedChildren="ON"
                                        unCheckedChildren="OFF"
                                        style={{ minWidth: "60px" }}
                                    />
                                </div>
                            </Card>

                            {/* Quick Actions */}
                            <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Title level={4} style={{ margin: 0, fontWeight: 400 }}>{t.dashboard.quickActions}</Title>
                            </div>

                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Card hoverable bordered style={{ borderRadius: "12px", borderLeft: "4px solid #6366f1" }} onClick={() => window.open("https://m.me/vibe.myanmar.app", "_blank")}>
                                        <Space direction="vertical">
                                            <CustomerServiceOutlined style={{ fontSize: "24px", color: "#6366f1" }} />
                                            <Text strong>{t.dashboard.contactAdmin}</Text>
                                            <Text type="secondary" style={{ fontSize: "12px" }}>{t.dashboard.getSupport}</Text>
                                        </Space>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card hoverable bordered style={{ borderRadius: "12px", borderLeft: "4px solid #1877f2" }} onClick={() => router.push("/dashboard/platforms")}>
                                        <Space direction="vertical">
                                            <FacebookOutlined style={{ fontSize: "24px", color: "#1877f2" }} />
                                            <Text strong>{t.dashboard.connectPage}</Text>
                                            <Text type="secondary" style={{ fontSize: "12px" }}>{t.dashboard.linkFacebook}</Text>
                                        </Space>
                                    </Card>
                                </Col>
                            </Row>

                            <Divider style={{ margin: "40px 0" }} />

                            {/* Recent Activity - REAL DATA */}
                            <div style={{ marginBottom: "24px" }}>
                                <Title level={4} style={{ margin: 0, fontWeight: 400 }}>{t.dashboard.recentActivity}</Title>
                            </div>

                            {stats?.recent_activities && stats.recent_activities.length > 0 ? (
                                <List
                                    itemLayout="horizontal"
                                    dataSource={stats.recent_activities}
                                    renderItem={(item: any) => (
                                        <List.Item style={{ padding: "16px 0", borderBottom: "1px solid #f1f5f9" }}>
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar
                                                        style={{
                                                            backgroundColor: item.status === 'replied' ? '#ecfdf5' : '#f1f5f9',
                                                            color: item.status === 'replied' ? '#10b981' : '#64748b'
                                                        }}
                                                        icon={getStatusIcon(item.status)}
                                                    />
                                                }
                                                title={
                                                    <Space>
                                                        <Text strong style={{ fontSize: "14px" }}>{item.sender_name}</Text>
                                                        <Tag
                                                            bordered={false}
                                                            color={item.status === 'replied' ? 'success' : item.status === 'received' ? 'processing' : 'default'}
                                                            style={{ fontSize: "11px" }}
                                                        >
                                                            {item.status?.toUpperCase()}
                                                        </Tag>
                                                    </Space>
                                                }
                                                description={
                                                    <div>
                                                        <Text type="secondary" style={{ fontSize: "13px" }}>
                                                            {item.body?.substring(0, 80)}{item.body?.length > 80 ? "..." : ""}
                                                        </Text>
                                                        <br />
                                                        <Text type="secondary" style={{ fontSize: "11px", color: "#94a3b8" }}>
                                                            {dayjs(item.created_at).fromNow()} • {item.channel}
                                                        </Text>
                                                    </div>
                                                }
                                            />
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
                            <Card bordered={false} style={{ borderRadius: "24px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                                <div style={{ textAlign: "center", padding: "24px 0" }}>
                                    <Avatar size={80} style={{ backgroundColor: "#1e293b", marginBottom: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} icon={<UserOutlined />} />
                                    <Title level={4} style={{ marginBottom: "4px" }}>
                                        {stats?.business_name || t.dashboard.merchantAccount}
                                    </Title>
                                    <Text type="secondary">
                                        {stats?.business_type === 'cargo' ? '📦 Cargo & Delivery' : '🛍️ Online Shop'}
                                    </Text>
                                    <br />
                                    <Tag color={stats?.subscription_status === 'active' ? 'green' : 'orange'} style={{ marginTop: "8px" }}>
                                        {stats?.subscription_status?.toUpperCase() || 'FREE'}
                                    </Tag>

                                    <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                        {stats?.business_type === 'cargo' ? (
                                            <Button block size="large" type="primary" style={{ background: "#f59e0b", borderColor: "#f59e0b" }} onClick={() => router.push("/dashboard/orders")}>
                                                <SendOutlined /> View Shipment Requests ({stats?.shipments_count || 0})
                                            </Button>
                                        ) : (
                                            <Button block size="large" type="primary" onClick={() => router.push("/dashboard/orders")}>
                                                <ShoppingCartOutlined /> View Orders ({stats?.orders_count || 0})
                                            </Button>
                                        )}
                                        <Button block size="large" type="dashed" icon={<CreditCardOutlined />} onClick={() => router.push("/subscribe")}>
                                            {t.dashboard.renewPlan}
                                        </Button>
                                        <Button block size="large" onClick={() => router.push("/dashboard/platforms")} icon={<FacebookOutlined />}>
                                            {t.dashboard.connectPage}
                                        </Button>
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
