"use client";

import { useState, useEffect } from "react";
import { Table, Card, Typography, Tag, Space, Button, message } from "antd";
import { ShoppingCartOutlined, ReloadOutlined, SendOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { API_URL } from "@/lib/apiConfig";
import AuthGuard from "@/components/AuthGuard";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const { Title, Text } = Typography;

export default function OrdersPage() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [businessType, setBusinessType] = useState<string | null>(null);
    const { t, language } = useLanguage();

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");

            // 1. Fetch merchant profile to know business type
            const profileRes = await axios.get(`${API_URL}/api/merchants/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const bType = profileRes.data.data.business_type;
            setBusinessType(bType);

            // 2. Fetch appropriate data
            const endpoint = bType === 'cargo' ? '/api/merchants/shipments' : '/api/merchants/orders';
            const res = await axios.get(`${API_URL}${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data.data || []);
        } catch (error) {
            console.error("Fetch error:", error);
            message.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const shopColumns = [
        {
            title: language === 'my' ? "ရက်စွဲ" : "Date",
            dataIndex: "created_at",
            key: "created_at",
            render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
            sorter: (a: any, b: any) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
        },
        {
            title: language === 'my' ? "ဝယ်သူအမည်" : "Customer",
            dataIndex: "full_name",
            key: "full_name",
            render: (text: string) => text || "-",
        },
        {
            title: language === 'my' ? "ဖုန်းနံပါတ်" : "Phone",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: language === 'my' ? "ပစ္စည်းအမည်" : "Item",
            dataIndex: "item_name",
            key: "item_name",
        },
        {
            title: language === 'my' ? "အရေအတွက်" : "Qty",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: language === 'my' ? "ငွေပေးချေမှု" : "Payment",
            dataIndex: "payment_method",
            key: "payment_method",
            render: (method: string) => (
                <Tag color={method === "COD" ? "blue" : "green"}>{method}</Tag>
            )
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

    const cargoColumns = [
        {
            title: language === 'my' ? "ရက်စွဲ" : "Date",
            dataIndex: "created_at",
            key: "created_at",
            render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
        },
        {
            title: language === 'my' ? "ပို့ဆောင်သူ" : "Sender",
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
            title: language === 'my' ? "အမျိုးအစား" : "Type",
            dataIndex: "shipping",
            key: "shipping",
        },
        {
            title: language === 'my' ? "ပစ္စည်း" : "Item",
            dataIndex: "item_name",
            key: "item_name",
        },
        {
            title: language === 'my' ? "အလေးချိန်" : "Weight",
            dataIndex: "weight",
            key: "weight",
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

    const columns = businessType === 'cargo' ? cargoColumns : shopColumns;

    return (
        <AuthGuard>
            <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <Space size="middle">
                        {businessType === 'cargo' ? (
                            <SendOutlined style={{ fontSize: "24px", color: "#f59e0b" }} />
                        ) : (
                            <ShoppingCartOutlined style={{ fontSize: "24px", color: "#6366f1" }} />
                        )}
                        <Title level={2} style={{ margin: 0, fontWeight: 300 }}>
                            {businessType === 'cargo'
                                ? (language === 'my' ? "ပို့ဆောင်မှု တောင်းဆိုချက်များ" : "Shipment Requests")
                                : (language === 'my' ? "အမှာစာများ" : "Orders")
                            }
                        </Title>
                    </Space>
                    <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>
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
                        scroll={{ x: 1000 }}
                    />
                </Card>
            </div>
        </AuthGuard>
    );
}
