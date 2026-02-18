"use client";

import { useEffect, useState } from "react";
import { Table, Card, Typography, Tag, Space, Alert } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import { API_URL } from "@/lib/apiConfig";

const { Title, Text } = Typography;

export default function PaymentHistory() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("authToken");

                const res = await axios.get(`${API_URL}/api/payments/my-history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setPayments(res.data);
            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const columns = [
        {
            title: "Date",
            dataIndex: "created_at",
            key: "date",
            render: (date: string) => dayjs(date).format("DD MMM YYYY, HH:mm"),
        },
        {
            title: "Plan",
            dataIndex: "plan",
            key: "plan",
            render: (plan: string) => (
                <Tag color="geekblue">{plan?.toUpperCase()}</Tag>
            ),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number) => (
                <Text strong>{amount?.toLocaleString()} Ks</Text>
            ),
        },
        {
            title: "Provider",
            dataIndex: "payment_provider",
            key: "provider",
            render: (provider: string) => (
                <Tag>{provider?.toUpperCase()}</Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color = "default";
                let icon = <ClockCircleOutlined />;

                if (status === "completed" || status === "approved") {
                    color = "success";
                    icon = <CheckCircleOutlined />;
                } else if (status === "rejected" || status === "failed") {
                    color = "error";
                    icon = <CloseCircleOutlined />;
                } else if (status === "pending") {
                    color = "warning";
                    icon = <ClockCircleOutlined />;
                }

                return (
                    <Tag color={color} icon={icon}>
                        {status?.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: "Reference",
            dataIndex: "transaction_id",
            key: "ref",
            render: (ref: string) => <Text copyable>{ref}</Text>,
        },
    ];

    return (
        <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ marginBottom: "24px" }}>
                <Title level={2}>Billing History</Title>
                <Text type="secondary">View your past payments and subscription history</Text>
            </div>

            <Card bordered={false} style={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                {payments.length === 0 && !loading ? (
                    <Alert
                        message="No Payment History Found"
                        description="You haven't made any payments yet."
                        type="info"
                        showIcon
                    />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={payments}
                        loading={loading}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                    />
                )}
            </Card>
        </div>
    );
}
