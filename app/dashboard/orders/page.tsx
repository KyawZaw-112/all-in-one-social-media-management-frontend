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

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const token = localStorage.getItem("authToken");
            const endpoint = businessType === 'cargo' ? `/api/merchants/shipments/${id}/status` : `/api/merchants/orders/${id}/status`;
            await axios.patch(`${API_URL}${endpoint}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success(`Status updated to ${newStatus}`);
            fetchData();
        } catch (error) {
            console.error("Update status error:", error);
            message.error("Failed to update status");
        }
    };

    const shopColumns = [
        {
            title: language === 'my' ? "ရက်စွဲ" : "Date",
            dataIndex: "created_at",
            key: "created_at",
            render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
            sorter: (a: any, b: any) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
        },
        {
            title: language === 'my' ? "ရင်းမြစ်" : "Source",
            dataIndex: "order_source",
            key: "order_source",
            render: (s: string) => <Tag color="blue">{s}</Tag>
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
            title: language === 'my' ? "ဒီဇိုင်း/ဆိုဒ်" : "Variant",
            dataIndex: "item_variant",
            key: "item_variant",
        },
        {
            title: language === 'my' ? "အရေအတွက်" : "Qty",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: language === 'my' ? "ပို့ဆောင်မှု" : "Delivery",
            dataIndex: "delivery",
            key: "delivery",
        },
        {
            title: language === 'my' ? "လိပ်စာ" : "Address",
            dataIndex: "address",
            key: "address",
            ellipsis: true,
        },
        {
            title: language === 'my' ? "ငွေပေးချေမှု" : "Payment",
            dataIndex: "payment_method",
            key: "payment_method",
            render: (method: string, record: any) => (
                <Tag color={method === "COD" ? "blue" : "green"}>{method || record.payment}</Tag>
            )
        },
        {
            title: language === 'my' ? "အခြေအနေ" : "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color = "processing";
                if (status === "approved" || status === "confirmed") color = "success";
                if (status === "completed") color = "gold";
                if (status === "cancelled") color = "error";
                return (
                    <Tag color={color}>
                        {status?.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: language === 'my' ? "လုပ်ဆောင်ချက်" : "Action",
            key: "action",
            render: (_: any, record: any) => (
                record.status === 'pending' && (
                    <Button type="primary" size="small" onClick={() => handleUpdateStatus(record.id, 'approved')}>
                        {language === 'my' ? "အတည်ပြုမည်" : "Confirm"}
                    </Button>
                )
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
            title: language === 'my' ? "ဖုန်း" : "Phone",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: language === 'my' ? "နိုင်ငံ" : "Country",
            dataIndex: "country",
            key: "country",
            render: (c: string) => <Tag color="blue">{c}</Tag>
        },
        {
            title: language === 'my' ? "အမျိုးအစား" : "Shipping",
            dataIndex: "shipping",
            key: "shipping",
        },
        {
            title: language === 'my' ? "ပစ္စည်းအမျိုးအစား" : "Type",
            dataIndex: "item_type",
            key: "item_type",
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
            title: language === 'my' ? "တန်ဖိုး" : "Value",
            dataIndex: "item_value",
            key: "item_value",
        },
        {
            title: language === 'my' ? "လိပ်စာ" : "Address",
            dataIndex: "address",
            key: "address",
            ellipsis: true,
        },
        {
            title: language === 'my' ? "အခြေအနေ" : "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color = "processing";
                if (status === "approved" || status === "confirmed") color = "success";
                if (status === "completed") color = "gold";
                if (status === "cancelled") color = "error";
                return (
                    <Tag color={color}>
                        {status?.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: language === 'my' ? "လုပ်ဆောင်ချက်" : "Action",
            key: "action",
            render: (_: any, record: any) => (
                record.status === 'pending' && (
                    <Button type="primary" size="small" onClick={() => handleUpdateStatus(record.id, 'approved')}>
                        {language === 'my' ? "အတည်ပြုမည်" : "Confirm"}
                    </Button>
                )
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
