"use client";

import { useState, useEffect } from "react";
import {
    Row,
    Col,
    Card,
    Statistic,
    Typography,
    List,
    Tag,
    Avatar,
    Space,
    Progress,
    Badge,
    Skeleton,
    Divider
} from "antd";
import {
    TeamOutlined,
    WalletOutlined,
    GlobalOutlined,
    RiseOutlined,
    UserAddOutlined,
    ShopOutlined,
    CarOutlined,
    ThunderboltOutlined,
    ClockCircleOutlined,
    ArrowUpOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
                const res = await axios.get(`${apiUrl}/api/admin/system-stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data.data);
            } catch (err) {
                console.error("Failed to load admin stats");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Skeleton active paragraph={{ rows: 10 }} />;

    return (
        <div>
            <div style={{ marginBottom: "32px" }}>
                <Title level={2} style={{ margin: 0 }}>📊 Performance Overview</Title>
                <Text type="secondary">သင့် SaaS လုပ်ငန်း၏ လက်ရှိအခြေအနေနှင့် ဝင်ငွေအချက်အလက်များ</Text>
            </div>

            {/* Top Key Stats */}
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                        <Statistic
                            title={<Text type="secondary">Estimated Revenue (Kyats)</Text>}
                            value={stats?.estimatedMonthlyRevenue}
                            precision={0}
                            valueStyle={{ color: "#722ed1", fontWeight: 800 }}
                            prefix={<WalletOutlined style={{ marginRight: 8 }} />}
                            suffix={<Text style={{ fontSize: 14 }}>/mo</Text>}
                        />
                        <div style={{ marginTop: 12 }}>
                            <Tag color="green-preset" icon={<RiseOutlined />}>+12.5% from last month</Tag>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                        <Statistic
                            title="Total Merchants"
                            value={stats?.totalUsers}
                            valueStyle={{ fontWeight: 800 }}
                            prefix={<TeamOutlined style={{ marginRight: 8, color: "#1890ff" }} />}
                        />
                        <div style={{ marginTop: 16 }}>
                            <Progress percent={90} size="small" strokeColor="#1890ff" showInfo={false} />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                        <Statistic
                            title="Active Subscriptions"
                            value={stats?.activeSubs}
                            valueStyle={{ color: "#52c41a", fontWeight: 800 }}
                            prefix={<Badge status="processing" color="#52c41a" style={{ marginRight: 12 }} />}
                        />
                        <div style={{ marginTop: 12, fontSize: "12px", color: "#666" }}>
                            {stats?.expiredSubs} accounts currently expired
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                        <Statistic
                            title="System Health"
                            value={stats?.systemHealth?.fbPages || 0}
                            valueStyle={{ fontWeight: 800 }}
                            prefix={<GlobalOutlined style={{ color: "#fa8c16", marginRight: 8 }} />}
                            suffix="Connected"
                        />
                        <div style={{ marginTop: 12, color: "#999", fontSize: "12px" }}>
                            {stats?.systemHealth?.messagesProcessed} messages automated
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
                {/* Plan Distribution */}
                <Col xs={24} lg={16}>
                    <Card title="📈 Plan Distribution" bordered={false} style={{ borderRadius: "16px", minHeight: "350px" }}>
                        <Row gutter={40} align="middle">
                            <Col xs={24} md={12}>
                                <div style={{ padding: "20px" }}>
                                    <div style={{ marginBottom: "24px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                            <Space><ShopOutlined /> <Text>Online Shop</Text></Space>
                                            <Text strong>{stats?.planDistribution?.shop}</Text>
                                        </div>
                                        <Progress percent={(stats?.planDistribution?.shop / stats?.totalUsers) * 100} strokeColor="#1890ff" strokeWidth={12} />
                                    </div>
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                            <Space><CarOutlined /> <Text>Cargo & Delivery</Text></Space>
                                            <Text strong>{stats?.planDistribution?.cargo}</Text>
                                        </div>
                                        <Progress percent={(stats?.planDistribution?.cargo / stats?.totalUsers) * 100} strokeColor="#fa8c16" strokeWidth={12} />
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} md={12} style={{ borderLeft: "1px solid #f0f0f0", textAlign: "center" }}>
                                <Statistic
                                    title="Conversion Rate"
                                    value={72.4}
                                    suffix="%"
                                    prefix={<ArrowUpOutlined />}
                                    valueStyle={{ color: "#3f8600" }}
                                />
                                <Text type="secondary">Trial to Paid conversion is healthy</Text>
                            </Col>
                        </Row>
                        <Divider />
                        <Title level={5}>System Messages Flow</Title>
                        <Progress
                            type="dashboard"
                            percent={85}
                            strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                            format={() => `Stable`}
                        />
                    </Card>
                </Col>

                {/* System Logs / Short Alerts */}
                <Col xs={24} lg={8}>
                    <Card title="🔔 System Activity" bordered={false} style={{ borderRadius: "16px", minHeight: "350px" }}>
                        <List
                            itemLayout="horizontal"
                            dataSource={[
                                { title: "New Sign Up", desc: "Kyaw Kyaw joined Online Shop plan", time: "2 mins ago", icon: <UserAddOutlined />, color: "#1890ff" },
                                { title: "Payment Received", desc: "Cargo Plus (20,000 Ks)", time: "1 hour ago", icon: <WalletOutlined />, color: "#52c41a" },
                                { title: "Trial Ending", desc: "Thin Thin trial expires in 24h", time: "3 hours ago", icon: <ClockCircleOutlined />, color: "#faad14" },
                                { title: "New Page Connected", desc: "Mandalay One Delivery", time: "5 hours ago", icon: <GlobalOutlined />, color: "#722ed1" },
                            ]}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={item.icon} style={{ backgroundColor: item.color }} />}
                                        title={<Text strong>{item.title}</Text>}
                                        description={
                                            <div>
                                                <div style={{ fontSize: "12px" }}>{item.desc}</div>
                                                <Text type="secondary" style={{ fontSize: "11px" }}>{item.time}</Text>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
