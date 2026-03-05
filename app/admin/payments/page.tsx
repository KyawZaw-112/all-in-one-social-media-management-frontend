"use client";

import { useEffect, useState } from "react";
import { Table, Tag, Button, Space, Card, Typography, message, Modal, Row, Col, Statistic, Input, Avatar, Badge } from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    SearchOutlined,
    EyeOutlined,
    DollarOutlined,
    WalletOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { API_URL } from "@/lib/apiConfig";
import supabase from "@/lib/supabase";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function PaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [searchText, setSearchText] = useState("");

    const getSignedUrl = async (path: string): Promise<string | null> => {
        const { data, error } = await supabase.storage
            .from("payment-proofs")
            .createSignedUrl(path, 600);
        if (error) {
            console.error("Signed URL error:", error);
            return null;
        }
        return data.signedUrl;
    };

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.get(`${API_URL}/api/admin/payments/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPayments(res.data || []);
        } catch (err) {
            console.error("Failed to fetch payments:", err);
            message.error("Failed to load payments");
        } finally {
            setLoading(false);
        }
    };

    const approvePayment = async (id: string) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.post(`${API_URL}/api/admin/payments/approve/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success("Payment approved! ✅");
            fetchPayments();
        } catch (err) {
            message.error("Approval failed");
        }
    };

    const rejectPayment = async (id: string) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.post(`${API_URL}/api/admin/payments/reject`, { paymentId: id }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success("Payment rejected");
            fetchPayments();
        } catch (err) {
            message.error("Rejection failed");
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const pendingCount = payments.filter(p => p.status === "pending").length;
    const approvedCount = payments.filter(p => p.status === "approved").length;
    const rejectedCount = payments.filter(p => p.status === "rejected").length;
    const totalRevenue = payments
        .filter(p => p.status === "approved")
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const filteredData = payments.filter(p =>
        p.user_id?.toLowerCase().includes(searchText.toLowerCase()) ||
        p.transaction_id?.toLowerCase().includes(searchText.toLowerCase()) ||
        p.payment_provider?.toLowerCase().includes(searchText.toLowerCase()) ||
        p.plan?.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: "No",
            key: "no",
            width: 60,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: "Plan",
            dataIndex: "plan",
            key: "plan",
            render: (plan: string) => (
                <Tag color={plan === "cargo" ? "orange" : "blue"} style={{ borderRadius: 20 }}>
                    {(plan || "N/A").toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number) => (
                <Text strong style={{ color: "#722ed1" }}>
                    {Number(amount || 0).toLocaleString()} Ks
                </Text>
            ),
        },
        {
            title: "Method",
            dataIndex: "payment_provider",
            key: "method",
            render: (provider: string) => provider || "—",
        },
        {
            title: "Transaction ID",
            dataIndex: "transaction_id",
            key: "txn",
            render: (id: string) => id ? <Text copyable={{ text: id }}>{id.slice(0, 12)}...</Text> : "—",
        },
        {
            title: "Proof",
            key: "proof",
            render: (_: any, record: any) => record.screenshot_url || record.proof_url ? (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    loading={previewLoading}
                    onClick={async () => {
                        const path = record.proof_url || record.screenshot_url;
                        if (!path) return;
                        setPreviewLoading(true);
                        const signedUrl = await getSignedUrl(path);
                        setPreviewLoading(false);
                        if (signedUrl) {
                            setPreview(signedUrl);
                        } else {
                            message.error("Failed to load proof image");
                        }
                    }}
                >
                    View
                </Button>
            ) : <Text type="secondary">—</Text>,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            filters: [
                { text: "Pending", value: "pending" },
                { text: "Approved", value: "approved" },
                { text: "Rejected", value: "rejected" },
            ],
            onFilter: (value: any, record: any) => record.status === value,
            render: (status: string) => {
                const config: any = {
                    pending: { color: "orange", icon: <ClockCircleOutlined />, text: "PENDING" },
                    approved: { color: "green", icon: <CheckCircleOutlined />, text: "APPROVED" },
                    rejected: { color: "red", icon: <CloseCircleOutlined />, text: "REJECTED" },
                };
                const c = config[status] || config.pending;
                return (
                    <Badge status={status === "pending" ? "processing" : status === "approved" ? "success" : "error"}>
                        <Tag color={c.color} icon={c.icon} style={{ borderRadius: 20 }}>
                            {c.text}
                        </Tag>
                    </Badge>
                );
            },
        },
        {
            title: "Date",
            dataIndex: "created_at",
            key: "date",
            sorter: (a: any, b: any) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
            render: (date: string) => (
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(date).format("DD MMM YYYY HH:mm")}
                </Text>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) =>
                record.status === "pending" ? (
                    <Space>
                        <Button
                            type="primary"
                            size="small"
                            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                            onClick={() => approvePayment(record.id)}
                        >
                            Approve
                        </Button>
                        <Button danger size="small" onClick={() => rejectPayment(record.id)}>
                            Reject
                        </Button>
                    </Space>
                ) : (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {record.approved_at ? `Approved ${dayjs(record.approved_at).format("DD MMM")}` : record.reviewed_at ? `Reviewed ${dayjs(record.reviewed_at).format("DD MMM")}` : "—"}
                    </Text>
                ),
        },
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>💳 Payment Management</Title>
                    <Text type="secondary">Review, approve, and manage all payment submissions.</Text>
                </div>
                <Input
                    placeholder="Search by plan, transaction ID..."
                    prefix={<SearchOutlined />}
                    style={{ width: 320, borderRadius: 10 }}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                />
            </div>

            {/* Stats */}
            <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 16, background: "linear-gradient(135deg, #667eea33 0%, #764ba233 100%)" }}>
                        <Statistic
                            title={<Text type="secondary">Total Payments</Text>}
                            value={payments.length}
                            prefix={<WalletOutlined style={{ color: "#722ed1" }} />}
                            valueStyle={{ fontWeight: 800 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 16, background: "linear-gradient(135deg, #fa8c1633 0%, #ffc65833 100%)" }}>
                        <Statistic
                            title={<Text type="secondary">Pending Review</Text>}
                            value={pendingCount}
                            prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
                            valueStyle={{ fontWeight: 800, color: "#faad14" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 16, background: "linear-gradient(135deg, #43e97b33 0%, #38f9d733 100%)" }}>
                        <Statistic
                            title={<Text type="secondary">Approved</Text>}
                            value={approvedCount}
                            prefix={<CheckCircleOutlined style={{ color: "#43e97b" }} />}
                            valueStyle={{ fontWeight: 800, color: "#43e97b" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 16, background: "linear-gradient(135deg, #4facfe33 0%, #00f2fe33 100%)" }}>
                        <Statistic
                            title={<Text type="secondary">Total Revenue</Text>}
                            value={totalRevenue}
                            prefix={<DollarOutlined style={{ color: "#1890ff" }} />}
                            suffix="Ks"
                            valueStyle={{ fontWeight: 800, color: "#1890ff" }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Table */}
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
                <Table
                    rowKey="id"
                    columns={columns as any}
                    dataSource={filteredData}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} payments`,
                    }}
                />
            </Card>

            {/* Proof Preview Modal */}
            <Modal
                open={!!preview}
                footer={null}
                onCancel={() => setPreview(null)}
                width={800}
                title="Payment Proof"
            >
                {preview && (
                    <img
                        src={preview}
                        alt="Payment Proof"
                        style={{ width: "100%", height: "auto", borderRadius: 8 }}
                    />
                )}
            </Modal>
        </div>
    );
}
