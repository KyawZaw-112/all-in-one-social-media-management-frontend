"use client";

import { useState, useEffect } from "react";
import {
    Card, Row, Col, Statistic, Typography, Button, Spin, Select, Space
} from "antd";
import {
    ArrowLeftOutlined, UserOutlined, ShoppingCartOutlined,
    DollarOutlined, RiseOutlined, MessageOutlined,
    SendOutlined, PercentageOutlined, TeamOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import axios from "axios";
import { API_URL } from "@/lib/apiConfig";

const { Title, Text } = Typography;

// Simple bar chart component (no external chart library needed)
function MiniChart({ data, dataKey, color = "#6366f1", height = 120 }: { data: any[]; dataKey: string; color?: string; height?: number }) {
    if (!data || data.length === 0) return <Text type="secondary">No data</Text>;
    const maxVal = Math.max(...data.map(d => d[dataKey] || 0), 1);
    const barWidth = Math.max(4, Math.floor(100 / data.length) - 1);

    return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height, width: "100%" }}>
            {data.map((d, i) => {
                const val = d[dataKey] || 0;
                const barH = Math.max(2, (val / maxVal) * height);
                return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div
                            style={{
                                width: "100%",
                                maxWidth: 24,
                                height: barH,
                                background: color,
                                borderRadius: "4px 4px 0 0",
                                opacity: 0.7 + (0.3 * (val / maxVal)),
                                transition: "height 0.3s ease"
                            }}
                            title={`${d.date}: ${val}`}
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default function AnalyticsPage() {
    const router = useRouter();
    const [overview, setOverview] = useState<any>(null);
    const [orderChart, setOrderChart] = useState<any[]>([]);
    const [customerChart, setCustomerChart] = useState<any>(null);
    const [messageChart, setMessageChart] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(30);

    const getToken = () => localStorage.getItem("authToken");

    const fetchAll = async () => {
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${getToken()}` };

            const [overviewRes, ordersRes, customersRes, messagesRes] = await Promise.all([
                axios.get(`${API_URL}/api/analytics/overview`, { headers }),
                axios.get(`${API_URL}/api/analytics/orders?days=${days}`, { headers }),
                axios.get(`${API_URL}/api/analytics/customers?days=${days}`, { headers }),
                axios.get(`${API_URL}/api/analytics/messages?days=${days}`, { headers })
            ]);

            setOverview(overviewRes.data.data);
            setOrderChart(ordersRes.data.data || []);
            setCustomerChart(customersRes.data.data);
            setMessageChart(messagesRes.data.data || []);
        } catch (err) {
            console.error("Failed to fetch analytics:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, [days]);

    if (loading) {
        return (
            <AuthGuard>
                <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Spin size="large" />
                </div>
            </AuthGuard>
        );
    }

    const totalOrderChartOrders = orderChart.reduce((s, d) => s + d.orders, 0);
    const totalOrderChartRevenue = orderChart.reduce((s, d) => s + d.revenue, 0);
    const totalIncoming = messageChart.reduce((s, d) => s + d.incoming, 0);
    const totalOutgoing = messageChart.reduce((s, d) => s + d.outgoing, 0);

    return (
        <AuthGuard>
            <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px 24px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    {/* Header */}
                    <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => router.push("/dashboard")} style={{ marginBottom: 8 }}>Dashboard</Button>
                            <Title level={2} style={{ margin: 0, fontWeight: 300 }}>📊 Analytics Dashboard</Title>
                            <Text type="secondary">Track your business performance</Text>
                        </div>
                        <Select value={days} onChange={setDays} style={{ width: 160 }}
                            options={[
                                { value: 7, label: "Last 7 Days" },
                                { value: 14, label: "Last 14 Days" },
                                { value: 30, label: "Last 30 Days" },
                                { value: 90, label: "Last 90 Days" }
                            ]}
                        />
                    </div>

                    {/* Overview Cards */}
                    <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
                        <Col xs={12} sm={6}>
                            <Card bordered={false} style={{ borderRadius: 16, background: "linear-gradient(135deg, #eef2ff, #e0e7ff)" }}>
                                <Statistic title="Total Customers" value={overview?.customers || 0} valueStyle={{ color: "#6366f1", fontSize: 28 }} prefix={<UserOutlined />} />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card bordered={false} style={{ borderRadius: 16, background: "linear-gradient(135deg, #ecfdf5, #d1fae5)" }}>
                                <Statistic title="Total Orders" value={overview?.orders || 0} valueStyle={{ color: "#10b981", fontSize: 28 }} prefix={<ShoppingCartOutlined />} />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card bordered={false} style={{ borderRadius: 16, background: "linear-gradient(135deg, #fefce8, #fef3c7)" }}>
                                <Statistic title="Revenue" value={overview?.revenue || 0} suffix="Ks" valueStyle={{ color: "#eab308", fontSize: 28 }} prefix={<DollarOutlined />} />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card bordered={false} style={{ borderRadius: 16, background: "linear-gradient(135deg, #fdf2f8, #fce7f3)" }}>
                                <Statistic title="Conversion Rate" value={overview?.conversion_rate || 0} suffix="%" valueStyle={{ color: "#ec4899", fontSize: 28 }} prefix={<PercentageOutlined />} />
                            </Card>
                        </Col>
                    </Row>

                    {/* Charts Row 1 */}
                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                        <Col xs={24} md={12}>
                            <Card bordered={false} style={{ borderRadius: 16 }} title={
                                <Space><ShoppingCartOutlined style={{ color: "#6366f1" }} /> <span>Orders Trend</span></Space>
                            } extra={<Text type="secondary">{totalOrderChartOrders} orders</Text>}>
                                <MiniChart data={orderChart} dataKey="orders" color="#6366f1" height={140} />
                                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between" }}>
                                    <Text type="secondary" style={{ fontSize: 11 }}>{orderChart[0]?.date}</Text>
                                    <Text type="secondary" style={{ fontSize: 11 }}>{orderChart[orderChart.length - 1]?.date}</Text>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card bordered={false} style={{ borderRadius: 16 }} title={
                                <Space><DollarOutlined style={{ color: "#eab308" }} /> <span>Revenue Trend</span></Space>
                            } extra={<Text type="secondary">{totalOrderChartRevenue.toLocaleString()} Ks</Text>}>
                                <MiniChart data={orderChart} dataKey="revenue" color="#eab308" height={140} />
                                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between" }}>
                                    <Text type="secondary" style={{ fontSize: 11 }}>{orderChart[0]?.date}</Text>
                                    <Text type="secondary" style={{ fontSize: 11 }}>{orderChart[orderChart.length - 1]?.date}</Text>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    {/* Charts Row 2 */}
                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                        <Col xs={24} md={12}>
                            <Card bordered={false} style={{ borderRadius: 16 }} title={
                                <Space><TeamOutlined style={{ color: "#10b981" }} /> <span>New Customers</span></Space>
                            } extra={<Text type="secondary">{customerChart?.total || 0} total</Text>}>
                                <MiniChart data={customerChart?.growth || []} dataKey="new_customers" color="#10b981" height={140} />
                                <Row gutter={16} style={{ marginTop: 16 }}>
                                    <Col span={8}>
                                        <Statistic title="Active" value={customerChart?.by_status?.active || 0} valueStyle={{ fontSize: 18, color: "#10b981" }} />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic title="VIP" value={customerChart?.by_status?.vip || 0} valueStyle={{ fontSize: 18, color: "#eab308" }} />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic title="Repeat" value={customerChart?.repeat_customers || 0} valueStyle={{ fontSize: 18, color: "#6366f1" }} />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card bordered={false} style={{ borderRadius: 16 }} title={
                                <Space><MessageOutlined style={{ color: "#0ea5e9" }} /> <span>Message Volume</span></Space>
                            } extra={<Text type="secondary">{totalIncoming + totalOutgoing} messages</Text>}>
                                <MiniChart data={messageChart} dataKey="incoming" color="#0ea5e9" height={60} />
                                <Text type="secondary" style={{ fontSize: 11 }}>↑ Incoming ({totalIncoming})</Text>
                                <div style={{ marginTop: 8 }}>
                                    <MiniChart data={messageChart} dataKey="outgoing" color="#8b5cf6" height={60} />
                                    <Text type="secondary" style={{ fontSize: 11 }}>↑ Outgoing ({totalOutgoing})</Text>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    {/* Secondary Stats */}
                    <Row gutter={[16, 16]}>
                        <Col xs={12} sm={6}>
                            <Card bordered={false} style={{ borderRadius: 16 }}>
                                <Statistic title="Conversations" value={overview?.conversations || 0} prefix={<MessageOutlined />} />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card bordered={false} style={{ borderRadius: 16 }}>
                                <Statistic title="Completed" value={overview?.completed_conversations || 0} prefix={<RiseOutlined />} />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card bordered={false} style={{ borderRadius: 16 }}>
                                <Statistic title="Shipments" value={overview?.shipments || 0} prefix={<SendOutlined />} />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card bordered={false} style={{ borderRadius: 16 }}>
                                <Statistic title="Campaigns" value={overview?.campaigns || 0} prefix={<SendOutlined />} />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </AuthGuard>
    );
}
