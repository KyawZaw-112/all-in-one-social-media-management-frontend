"use client";

import { useState, useEffect } from "react";
import { Table, Card, Typography, Tag, Space, Button, message } from "antd";
import { ReconciliationOutlined, ReloadOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { API_URL } from "@/lib/apiConfig";
import AuthGuard from "@/components/AuthGuard";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const { Title, Text } = Typography;

export default function ShipmentsPage() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const { language } = useLanguage();

    const fetchShipments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.get(`${API_URL}/api/merchants/shipments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data.data || []);
        } catch (error) {
            console.error("Fetch error:", error);
            message.error("Failed to fetch shipments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShipments();
    }, []);

    const columns = [
        {
            title: language === 'my' ? "ရက်စွဲ" : "Date",
            dataIndex: "created_at",
            key: "created_at",
            render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
            sorter: (a: any, b: any) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
        },
        {
            title: language === 'my' ? "ပေးပို့သူ" : "Sender",
            dataIndex: "full_name",
            key: "full_name",
        },
        {
            title: language === 'my' ? "နိုင်ငံ" : "Country",
            dataIndex: "country",
            key: "country",
            render: (c: string) => <Tag color="blue">{c}</Tag>
        },
        {
            title: language === 'my' ? "ပို့ဆောင်မှု" : "Shipping",
            dataIndex: "shipping",
            key: "shipping",
        },
        {
            title: language === 'my' ? "အလေးချိန်" : "Weight",
            dataIndex: "weight",
            key: "weight",
        },
        {
            title: language === 'my' ? "ပစ္စည်းအမည်" : "Item",
            dataIndex: "item_name",
            key: "item_name",
        },
        {
            title: language === 'my' ? "အခြေအနေ" : "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "completed" ? "success" : "processing"}>
                    {status?.toUpperCase()}
                </Tag>
            )
        }
    ];

    return (
        <AuthGuard>
            <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <Space size="middle">
                        <ReconciliationOutlined style={{ fontSize: "24px", color: "#6366f1" }} />
                        <Title level={2} style={{ margin: 0, fontWeight: 300 }}>
                            {language === 'my' ? "ကုန်ပစ္စည်းပို့ဆောင်မှု" : "Cargo Shipments"}
                        </Title>
                    </Space>
                    <Button icon={<ReloadOutlined />} onClick={fetchShipments} loading={loading}>
                        {language === 'my' ? "ပြန်ပွင့်ပါ" : "Refresh"}
                    </Button>
                </div>

                <Card bordered={false} style={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 900 }}
                    />
                </Card>
            </div>
        </AuthGuard>
    );
}
