"use client";

import { useState, useEffect } from "react";
import {
    Card, Table, Tag, Button, Input, Select, Space, Typography,
    message, Modal, Row, Col, Statistic, Spin, Empty, Progress,
    Form, Descriptions, Badge, Divider
} from "antd";
import {
    SendOutlined, PlusOutlined, ArrowLeftOutlined,
    DeleteOutlined, PlayCircleOutlined, EyeOutlined,
    CheckCircleOutlined, CloseCircleOutlined, FilterOutlined,
    UserOutlined, TagOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import axios from "axios";
import { API_URL } from "@/lib/apiConfig";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function BroadcastPage() {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [previewCount, setPreviewCount] = useState<number | null>(null);

    // Form state
    const [campaignName, setCampaignName] = useState("");
    const [campaignMessage, setCampaignMessage] = useState("");
    const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
    const [filterTag, setFilterTag] = useState<string | undefined>(undefined);
    const [filterMinOrders, setFilterMinOrders] = useState<number | undefined>(undefined);

    const [allTags, setAllTags] = useState<string[]>([]);

    const getToken = () => localStorage.getItem("authToken");

    const fetchCampaigns = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/merchants/campaigns`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setCampaigns(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch campaigns", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTags = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/customers/stats`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setAllTags((res.data.data?.top_tags || []).map((t: any) => t.tag));
        } catch (err) { }
    };

    useEffect(() => { fetchCampaigns(); fetchTags(); }, []);

    const previewRecipients = async () => {
        try {
            const filter: any = {};
            if (filterStatus) filter.status = filterStatus;
            if (filterTag) filter.tag = filterTag;
            if (filterMinOrders) filter.min_orders = filterMinOrders;

            const res = await axios.post(`${API_URL}/api/merchants/campaigns/preview-count`, {
                target_filter: filter
            }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setPreviewCount(res.data.count);
        } catch (err) {
            message.error("Failed to preview count");
        }
    };

    useEffect(() => { previewRecipients(); }, [filterStatus, filterTag, filterMinOrders]);

    const createCampaign = async () => {
        if (!campaignName || !campaignMessage) {
            message.warning("Please enter campaign name and message");
            return;
        }

        try {
            const filter: any = {};
            if (filterStatus) filter.status = filterStatus;
            if (filterTag) filter.tag = filterTag;
            if (filterMinOrders) filter.min_orders = filterMinOrders;

            await axios.post(`${API_URL}/api/merchants/campaigns`, {
                name: campaignName,
                message: campaignMessage,
                target_filter: filter
            }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            message.success("Campaign created!");
            setCreateModalOpen(false);
            setCampaignName("");
            setCampaignMessage("");
            setFilterStatus(undefined);
            setFilterTag(undefined);
            setFilterMinOrders(undefined);
            fetchCampaigns();
        } catch (err) {
            message.error("Failed to create campaign");
        }
    };

    const sendCampaign = async (id: string) => {
        Modal.confirm({
            title: "Send Campaign?",
            content: "This will send messages to all targeted customers. This action cannot be undone.",
            okText: "Send Now",
            okType: "primary",
            onOk: async () => {
                setSending(true);
                try {
                    const res = await axios.post(`${API_URL}/api/merchants/campaigns/${id}/send`, {}, {
                        headers: { Authorization: `Bearer ${getToken()}` }
                    });
                    message.success(res.data.message);
                    fetchCampaigns();
                } catch (err: any) {
                    message.error(err.response?.data?.error || "Failed to send campaign");
                } finally {
                    setSending(false);
                }
            }
        });
    };

    const deleteCampaign = async (id: string) => {
        try {
            await axios.delete(`${API_URL}/api/merchants/campaigns/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            message.success("Campaign deleted");
            fetchCampaigns();
        } catch (err) {
            message.error("Failed to delete campaign");
        }
    };

    const openDetail = async (record: any) => {
        setDetailLoading(true);
        setDetailModalOpen(true);
        try {
            const res = await axios.get(`${API_URL}/api/merchants/campaigns/${record.id}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setSelectedCampaign(res.data.data);
        } catch (err) {
            message.error("Failed to load campaign detail");
        } finally {
            setDetailLoading(false);
        }
    };

    const statusColors: Record<string, string> = {
        draft: "blue", sending: "orange", completed: "green", failed: "red", scheduled: "purple"
    };

    const columns = [
        {
            title: "Campaign", dataIndex: "name", key: "name",
            render: (name: string, record: any) => (
                <a onClick={() => openDetail(record)} style={{ fontWeight: 500 }}>{name}</a>
            )
        },
        {
            title: "Status", dataIndex: "status", key: "status",
            render: (s: string) => <Tag color={statusColors[s]}>{s?.toUpperCase()}</Tag>
        },
        {
            title: "Recipients", dataIndex: "total_recipients", key: "total_recipients",
            render: (v: number) => v || 0
        },
        {
            title: "Delivery", key: "delivery",
            render: (_: any, record: any) => {
                if (record.status === "draft") return <Text type="secondary">Not sent yet</Text>;
                const total = record.total_recipients || 0;
                const sent = record.sent_count || 0;
                const pct = total > 0 ? Math.round((sent / total) * 100) : 0;
                return <Progress percent={pct} size="small" status={record.failed_count > 0 ? "exception" : "success"} />;
            }
        },
        {
            title: "Created", dataIndex: "created_at", key: "created_at",
            render: (v: string) => dayjs(v).format("MMM D, YYYY HH:mm")
        },
        {
            title: "Actions", key: "actions",
            render: (_: any, record: any) => (
                <Space>
                    {record.status === "draft" && (
                        <>
                            <Button type="primary" size="small" icon={<PlayCircleOutlined />} onClick={() => sendCampaign(record.id)} loading={sending}>
                                Send
                            </Button>
                            <Button danger size="small" icon={<DeleteOutlined />} onClick={() => deleteCampaign(record.id)} />
                        </>
                    )}
                    <Button size="small" icon={<EyeOutlined />} onClick={() => openDetail(record)}>Detail</Button>
                </Space>
            )
        }
    ];

    const completedCampaigns = campaigns.filter(c => c.status === "completed");
    const totalSent = completedCampaigns.reduce((sum, c) => sum + (c.sent_count || 0), 0);
    const totalFailed = completedCampaigns.reduce((sum, c) => sum + (c.failed_count || 0), 0);

    return (
        <AuthGuard>
            <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px 24px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    {/* Header */}
                    <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => router.push("/dashboard")} style={{ marginBottom: 8 }}>Dashboard</Button>
                            <Title level={2} style={{ margin: 0, fontWeight: 300 }}>📢 Broadcast Campaigns</Title>
                            <Text type="secondary">Send targeted messages to your customers</Text>
                        </div>
                        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}
                            style={{ background: "#6366f1", borderColor: "#6366f1", borderRadius: 12 }}>
                            New Campaign
                        </Button>
                    </div>

                    {/* Stats */}
                    <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
                        <Col xs={8}>
                            <Card bordered={false} style={{ borderRadius: 16, background: "#eef2ff" }}>
                                <Statistic title="Total Campaigns" value={campaigns.length} valueStyle={{ color: "#6366f1" }} prefix={<SendOutlined />} />
                            </Card>
                        </Col>
                        <Col xs={8}>
                            <Card bordered={false} style={{ borderRadius: 16, background: "#ecfdf5" }}>
                                <Statistic title="Messages Sent" value={totalSent} valueStyle={{ color: "#10b981" }} prefix={<CheckCircleOutlined />} />
                            </Card>
                        </Col>
                        <Col xs={8}>
                            <Card bordered={false} style={{ borderRadius: 16, background: "#fef2f2" }}>
                                <Statistic title="Failed" value={totalFailed} valueStyle={{ color: "#ef4444" }} prefix={<CloseCircleOutlined />} />
                            </Card>
                        </Col>
                    </Row>

                    {/* Table */}
                    <Card bordered={false} style={{ borderRadius: 16 }}>
                        <Table
                            columns={columns}
                            dataSource={campaigns}
                            rowKey="id"
                            loading={loading}
                            pagination={{ pageSize: 10 }}
                            locale={{ emptyText: <Empty description="No campaigns yet. Create one to get started!" /> }}
                        />
                    </Card>
                </div>

                {/* Create Campaign Modal */}
                <Modal
                    title="Create New Campaign"
                    open={createModalOpen}
                    onCancel={() => setCreateModalOpen(false)}
                    onOk={createCampaign}
                    okText="Create Campaign"
                    width={640}
                >
                    <Space direction="vertical" style={{ width: "100%" }} size="middle">
                        <div>
                            <Text strong>Campaign Name</Text>
                            <Input placeholder="e.g. New Year Promo" value={campaignName} onChange={e => setCampaignName(e.target.value)} />
                        </div>
                        <div>
                            <Text strong>Message</Text>
                            <TextArea rows={4} placeholder="Type your broadcast message..." value={campaignMessage} onChange={e => setCampaignMessage(e.target.value)} showCount maxLength={1000} />
                        </div>
                        <Divider>
                            <FilterOutlined /> Target Audience
                        </Divider>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Text type="secondary" style={{ fontSize: 12 }}>Customer Status</Text>
                                <Select placeholder="All statuses" value={filterStatus} onChange={setFilterStatus} allowClear style={{ width: "100%" }}
                                    options={[
                                        { value: "active", label: "Active" },
                                        { value: "vip", label: "⭐ VIP" },
                                        { value: "blocked", label: "🚫 Blocked" }
                                    ]}
                                />
                            </Col>
                            <Col span={8}>
                                <Text type="secondary" style={{ fontSize: 12 }}>Tag</Text>
                                <Select placeholder="All tags" value={filterTag} onChange={setFilterTag} allowClear style={{ width: "100%" }}
                                    options={allTags.map(t => ({ value: t, label: t }))}
                                />
                            </Col>
                            <Col span={8}>
                                <Text type="secondary" style={{ fontSize: 12 }}>Min Orders</Text>
                                <Input type="number" placeholder="0" value={filterMinOrders} onChange={e => setFilterMinOrders(parseInt(e.target.value) || undefined)} />
                            </Col>
                        </Row>
                        <Card style={{ background: "#f0f9ff", borderColor: "#bae6fd", textAlign: "center" }}>
                            <Statistic title="Matching Recipients" value={previewCount ?? "..."} valueStyle={{ color: "#0284c7", fontSize: 32 }} prefix={<UserOutlined />} />
                        </Card>
                    </Space>
                </Modal>

                {/* Campaign Detail Modal */}
                <Modal
                    title={selectedCampaign?.name || "Campaign Detail"}
                    open={detailModalOpen}
                    onCancel={() => { setDetailModalOpen(false); setSelectedCampaign(null); }}
                    footer={null}
                    width={700}
                >
                    {detailLoading ? <Spin /> : selectedCampaign && (
                        <div>
                            <Descriptions column={2} bordered size="small">
                                <Descriptions.Item label="Status"><Tag color={statusColors[selectedCampaign.status]}>{selectedCampaign.status?.toUpperCase()}</Tag></Descriptions.Item>
                                <Descriptions.Item label="Created">{dayjs(selectedCampaign.created_at).format("MMM D, YYYY HH:mm")}</Descriptions.Item>
                                <Descriptions.Item label="Recipients">{selectedCampaign.total_recipients}</Descriptions.Item>
                                <Descriptions.Item label="Sent">{selectedCampaign.sent_count}</Descriptions.Item>
                                <Descriptions.Item label="Failed">{selectedCampaign.failed_count}</Descriptions.Item>
                                <Descriptions.Item label="Sent At">{selectedCampaign.sent_at ? dayjs(selectedCampaign.sent_at).format("MMM D, YYYY HH:mm") : "—"}</Descriptions.Item>
                            </Descriptions>

                            <Card style={{ marginTop: 16, background: "#f8fafc" }}>
                                <Text strong>Message:</Text>
                                <Paragraph style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{selectedCampaign.message}</Paragraph>
                            </Card>

                            {selectedCampaign.logs?.length > 0 && (
                                <>
                                    <Title level={5} style={{ marginTop: 24 }}>Delivery Logs</Title>
                                    <Table
                                        size="small"
                                        dataSource={selectedCampaign.logs}
                                        rowKey="id"
                                        pagination={{ pageSize: 10 }}
                                        columns={[
                                            { title: "Customer", dataIndex: "customer_name", key: "customer_name", render: (v: string) => v || "Unknown" },
                                            {
                                                title: "Status", dataIndex: "status", key: "status",
                                                render: (s: string) => <Tag color={s === "sent" ? "green" : "red"}>{s}</Tag>
                                            },
                                            { title: "Error", dataIndex: "error_message", key: "error_message", render: (v: string) => v || "—" },
                                            { title: "Time", dataIndex: "sent_at", key: "sent_at", render: (v: string) => v ? dayjs(v).format("HH:mm:ss") : "—" }
                                        ]}
                                    />
                                </>
                            )}
                        </div>
                    )}
                </Modal>
            </div>
        </AuthGuard>
    );
}
