"use client";

import { useState, useEffect } from "react";
import {
    Card,
    Typography,
    Table,
    Tag,
    Space,
    Row,
    Col,
    Statistic,
    Skeleton,
    Input,
    Badge,
    Progress,
    Avatar,
} from "antd";
import {
    CheckCircleOutlined,
    StopOutlined,
    ShopOutlined,
    CarOutlined,
    SearchOutlined,
    CreditCardOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function SubscriptionsPage() {
    const [merchants, setMerchants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
                const res = await axios.get(`${apiUrl}/api/admin/merchants`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMerchants(res.data.data || []);
            } catch (err) {
                console.error("Failed to load subscriptions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const activeSubs = merchants.filter((m) => m.subscription_status === "active");
    const expiredSubs = merchants.filter((m) => m.subscription_status !== "active");
    const shopCount = merchants.filter((m) => m.subscription_plan === "shop").length;
    const cargoCount = merchants.filter((m) => m.subscription_plan === "cargo").length;

    const filteredData = merchants.filter(
        (m) =>
            m.business_name?.toLowerCase().includes(searchText.toLowerCase()) ||
            m.user?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
            m.subscription_plan?.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: "Merchant",
            key: "merchant",
            render: (record: any) => (
                <Space>
                    <Avatar
                        style={{
                            background:
                                record.subscription_status === "active"
                                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                    : "#d9d9d9",
                            backgroundColor:
                                record.subscription_status === "active" ? "#722ed1" : "#bbb",
                        }}
                    >
                        {record.business_name?.[0]?.toUpperCase()}
                    </Avatar>
                    <div>
                        <Text strong>{record.business_name}</Text>
                        <div style={{ fontSize: 12, color: "#999" }}>
                            {record.user?.email}
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: "Plan",
            dataIndex: "subscription_plan",
            key: "plan",
            render: (plan: string) => (
                <Tag
                    color={plan === "cargo" ? "orange" : "blue"}
                    icon={plan === "cargo" ? <CarOutlined /> : <ShopOutlined />}
                    style={{ borderRadius: 20, padding: "2px 12px" }}
                >
                    {plan?.toUpperCase()}
                </Tag>
            ),
            filters: [
                { text: "Shop", value: "shop" },
                { text: "Cargo", value: "cargo" },
            ],
            onFilter: (value: any, record: any) => record.subscription_plan === value,
        },
        {
            title: "Status",
            dataIndex: "subscription_status",
            key: "status",
            render: (status: string) => (
                <Badge
                    status={status === "active" ? "processing" : "error"}
                    text={
                        <Tag
                            color={status === "active" ? "green" : "red"}
                            icon={
                                status === "active" ? (
                                    <CheckCircleOutlined />
                                ) : (
                                    <StopOutlined />
                                )
                            }
                            style={{ borderRadius: 20, margin: 0 }}
                        >
                            {status?.toUpperCase()}
                        </Tag>
                    }
                />
            ),
            filters: [
                { text: "Active", value: "active" },
                { text: "Expired", value: "expired" },
            ],
            onFilter: (value: any, record: any) => record.subscription_status === value,
        },
        {
            title: "Price",
            key: "price",
            render: (record: any) => (
                <Text strong style={{ color: "#722ed1" }}>
                    {record.subscription_plan === "cargo" ? "20,000" : "15,000"} Ks
                </Text>
            ),
        },
        {
            title: "Trial / Expiry",
            dataIndex: "trial_ends_at",
            key: "trial",
            render: (date: string) => {
                const isExpired = dayjs().isAfter(dayjs(date));
                return (
                    <Space>
                        <CalendarOutlined style={{ color: isExpired ? "#f5222d" : "#999" }} />
                        <Text type={isExpired ? "danger" : undefined}>
                            {dayjs(date).format("DD MMM YYYY")}
                        </Text>
                        {isExpired && (
                            <Tag color="red" style={{ borderRadius: 20, fontSize: 10 }}>
                                Expired
                            </Tag>
                        )}
                    </Space>
                );
            },
            sorter: (a: any, b: any) =>
                dayjs(a.trial_ends_at).unix() - dayjs(b.trial_ends_at).unix(),
        },
        {
            title: "Joined",
            dataIndex: "created_at",
            key: "joined",
            render: (date: string) => (
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(date).format("DD MMM YYYY")}
                </Text>
            ),
            sorter: (a: any, b: any) =>
                dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
        },
    ];

    if (loading) {
        return (
            <div>
                <Skeleton active paragraph={{ rows: 2 }} />
                <Row gutter={[20, 20]} style={{ marginTop: 24 }}>
                    {[1, 2, 3, 4].map((i) => (
                        <Col xs={24} sm={12} lg={6} key={i}>
                            <Skeleton.Node active style={{ width: "100%", height: 100 }} />
                        </Col>
                    ))}
                </Row>
                <Skeleton active paragraph={{ rows: 8 }} style={{ marginTop: 24 }} />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div
                style={{
                    marginBottom: 24,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>
                    <Title level={2} style={{ margin: 0 }}>
                        💳 Active Subscriptions
                    </Title>
                    <Text type="secondary">
                        View and manage all merchant subscriptions and billing status.
                    </Text>
                </div>
                <Input
                    placeholder="Search by name, email, or plan..."
                    prefix={<SearchOutlined />}
                    style={{ width: 320, borderRadius: 10 }}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                />
            </div>

            {/* Stats Cards */}
            <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: 16,
                            background: "linear-gradient(135deg, #667eea33 0%, #764ba233 100%)",
                        }}
                    >
                        <Statistic
                            title={<Text type="secondary">Total Subscriptions</Text>}
                            value={merchants.length}
                            prefix={<CreditCardOutlined style={{ color: "#722ed1" }} />}
                            valueStyle={{ fontWeight: 800 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: 16,
                            background: "linear-gradient(135deg, #43e97b33 0%, #38f9d733 100%)",
                        }}
                    >
                        <Statistic
                            title={<Text type="secondary">Active</Text>}
                            value={activeSubs.length}
                            prefix={<CheckCircleOutlined style={{ color: "#43e97b" }} />}
                            valueStyle={{ fontWeight: 800, color: "#43e97b" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: 16,
                            background: "linear-gradient(135deg, #f5576c33 0%, #f093fb33 100%)",
                        }}
                    >
                        <Statistic
                            title={<Text type="secondary">Expired / Inactive</Text>}
                            value={expiredSubs.length}
                            prefix={<StopOutlined style={{ color: "#f5576c" }} />}
                            valueStyle={{ fontWeight: 800, color: "#f5576c" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: 16,
                            background: "linear-gradient(135deg, #4facfe33 0%, #00f2fe33 100%)",
                        }}
                    >
                        <Statistic
                            title={<Text type="secondary">Est. Monthly Revenue</Text>}
                            value={shopCount * 15000 + cargoCount * 20000}
                            prefix={<span>💰</span>}
                            suffix="Ks"
                            valueStyle={{ fontWeight: 800, color: "#1890ff" }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Plan Breakdown Bar */}
            <Card
                bordered={false}
                style={{
                    borderRadius: 16,
                    marginBottom: 24,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                }}
            >
                <Row align="middle" gutter={24}>
                    <Col flex="auto">
                        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                            <Text strong>Plan Distribution</Text>
                            <Tag color="blue" icon={<ShopOutlined />} style={{ borderRadius: 20 }}>
                                Shop: {shopCount}
                            </Tag>
                            <Tag color="orange" icon={<CarOutlined />} style={{ borderRadius: 20 }}>
                                Cargo: {cargoCount}
                            </Tag>
                        </div>
                        <Progress
                            percent={100}
                            success={{
                                percent: merchants.length > 0
                                    ? Math.round((shopCount / merchants.length) * 100)
                                    : 0,
                                strokeColor: "#667eea",
                            }}
                            strokeColor="#fa8c16"
                            showInfo={false}
                            size={["100%", 14] as any}
                            style={{ borderRadius: 20 }}
                        />
                    </Col>
                    <Col>
                        <Statistic
                            title="Conversion"
                            value={merchants.length > 0 ? Math.round((activeSubs.length / merchants.length) * 100) : 0}
                            suffix="%"
                            valueStyle={{ color: "#43e97b", fontWeight: 800 }}
                        />
                    </Col>
                </Row>
            </Card>

            {/* Data Table */}
            <Card
                bordered={false}
                style={{
                    borderRadius: 16,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                }}
            >
                <Table
                    dataSource={filteredData}
                    columns={columns as any}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} subscriptions`,
                    }}
                    style={{ borderRadius: 12 }}
                />
            </Card>
        </div>
    );
}
