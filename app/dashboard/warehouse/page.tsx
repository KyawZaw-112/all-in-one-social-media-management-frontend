"use client";

import { useState, useEffect } from "react";
import {
    Table, Card, Typography, Tag, Space, Button, message,
    Modal, InputNumber, Row, Col, Statistic, Badge
} from "antd";
import {
    InboxOutlined, ArrowLeftOutlined, WarningOutlined,
    PlusOutlined, MinusOutlined, DollarOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/lib/apiConfig";
import AuthGuard from "@/components/AuthGuard";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const { Title, Text } = Typography;

export default function WarehousePage() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [adjustModal, setAdjustModal] = useState(false);
    const [adjusting, setAdjusting] = useState<any>(null);
    const [adjustValue, setAdjustValue] = useState(0);
    const [saving, setSaving] = useState(false);
    const { language } = useLanguage();
    const router = useRouter();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.get(`${API_URL}/api/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData((res.data.data || []).filter((p: any) => p.is_active));
        } catch {
            message.error("Failed to fetch inventory");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleAdjust = async (direction: "add" | "subtract") => {
        if (!adjusting || adjustValue <= 0) return;
        setSaving(true);
        try {
            const token = localStorage.getItem("authToken");
            const adj = direction === "add" ? adjustValue : -adjustValue;
            await axios.patch(`${API_URL}/api/products/${adjusting.id}/stock`, { adjustment: adj }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success(language === "my"
                ? `${adjusting.name}: ${direction === "add" ? "+" : "-"}${adjustValue} ပြင်ဆင်ပြီး`
                : `${adjusting.name}: Stock ${direction === "add" ? "+" : "-"}${adjustValue}`
            );
            setAdjustModal(false);
            setAdjusting(null);
            setAdjustValue(0);
            fetchProducts();
        } catch {
            message.error("Failed to adjust stock");
        } finally {
            setSaving(false);
        }
    };

    const totalProducts = data.length;
    const lowStockItems = data.filter(p => p.stock <= p.low_stock_threshold);
    const outOfStock = data.filter(p => p.stock <= 0);
    const totalValue = data.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0);

    const columns = [
        {
            title: language === "my" ? "ပစ္စည်းအမည်" : "Product",
            dataIndex: "name",
            key: "name",
            render: (name: string, record: any) => (
                <div>
                    <Text strong>{name}</Text>
                    {record.variants && <><br /><Text type="secondary" style={{ fontSize: 12 }}>{record.variants}</Text></>}
                </div>
            )
        },
        {
            title: language === "my" ? "လက်ကျန်" : "Stock",
            dataIndex: "stock",
            key: "stock",
            width: 120,
            sorter: (a: any, b: any) => a.stock - b.stock,
            render: (stock: number, record: any) => {
                const threshold = record.low_stock_threshold || 5;
                if (stock <= 0) return <Tag color="error" icon={<WarningOutlined />}>{language === "my" ? "ကုန်သွားပြီ" : "OUT OF STOCK"}</Tag>;
                if (stock <= threshold) return <Tag color="warning" icon={<WarningOutlined />}>{stock} {language === "my" ? "ခု" : "units"}</Tag>;
                return <Tag color="success">{stock} {language === "my" ? "ခု" : "units"}</Tag>;
            }
        },
        {
            title: language === "my" ? "ဈေးနှုန်း" : "Unit Price",
            dataIndex: "price",
            key: "price",
            width: 120,
            render: (price: number, record: any) => `${Number(price).toLocaleString()} ${record.currency || "MMK"}`
        },
        {
            title: language === "my" ? "စုစုပေါင်းတန်ဖိုး" : "Total Value",
            key: "total",
            width: 140,
            render: (_: any, record: any) => {
                const val = (record.price || 0) * (record.stock || 0);
                return <Text strong>{val.toLocaleString()} {record.currency || "MMK"}</Text>;
            }
        },
        {
            title: language === "my" ? "ပြင်ဆင်ရန်" : "Adjust",
            key: "action",
            width: 120,
            render: (_: any, record: any) => (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => { setAdjusting(record); setAdjustValue(1); setAdjustModal(true); }}
                    style={{ background: "#6366f1", borderColor: "#6366f1" }}
                >
                    {language === "my" ? "ပြင်မည်" : "Adjust"}
                </Button>
            )
        }
    ];

    return (
        <AuthGuard>
            <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <Space size="middle">
                        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/dashboard")} type="text" style={{ fontSize: 18 }} />
                        <InboxOutlined style={{ fontSize: 24, color: "#6366f1" }} />
                        <Title level={2} style={{ margin: 0, fontWeight: 300 }}>
                            {language === "my" ? "ကုန်ပစ္စည်းသိုလှောင်ရုံ" : "Warehouse"}
                        </Title>
                    </Space>
                    <Button onClick={() => router.push("/dashboard/products")} icon={<PlusOutlined />}>
                        {language === "my" ? "ပစ္စည်းစာရင်း" : "Manage Products"}
                    </Button>
                </div>

                {/* Stats */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={12} sm={6}>
                        <Card bordered={false} style={{ background: "#f0fdf4", borderRadius: 12 }}>
                            <Statistic title={language === "my" ? "စုစုပေါင်း" : "Total Products"} value={totalProducts}
                                prefix={<InboxOutlined />} valueStyle={{ color: "#16a34a" }} />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card bordered={false} style={{ background: lowStockItems.length > 0 ? "#fffbeb" : "#f8fafc", borderRadius: 12 }}>
                            <Statistic title={language === "my" ? "နည်းနေသော" : "Low Stock"} value={lowStockItems.length}
                                prefix={<WarningOutlined />} valueStyle={{ color: lowStockItems.length > 0 ? "#f59e0b" : "#64748b" }} />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card bordered={false} style={{ background: outOfStock.length > 0 ? "#fef2f2" : "#f8fafc", borderRadius: 12 }}>
                            <Statistic title={language === "my" ? "ကုန်သွားပြီ" : "Out of Stock"} value={outOfStock.length}
                                valueStyle={{ color: outOfStock.length > 0 ? "#dc2626" : "#64748b" }} />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card bordered={false} style={{ background: "#eef2ff", borderRadius: 12 }}>
                            <Statistic title={language === "my" ? "စုစုပေါင်းတန်ဖိုး" : "Total Value"} value={totalValue.toLocaleString()}
                                prefix={<DollarOutlined />} suffix="MMK" valueStyle={{ color: "#6366f1" }} />
                        </Card>
                    </Col>
                </Row>

                {/* Low Stock Alerts */}
                {lowStockItems.length > 0 && (
                    <Card bordered={false} style={{ background: "#fffbeb", border: "1px solid #fef3c7", borderRadius: 12, marginBottom: 24 }}>
                        <Space>
                            <WarningOutlined style={{ color: "#f59e0b", fontSize: 18 }} />
                            <Text strong style={{ color: "#92400e" }}>
                                {language === "my"
                                    ? `⚠️ ပစ္စည်း ${lowStockItems.length} ခု လက်ကျန်နည်းနေပါတယ်: `
                                    : `⚠️ ${lowStockItems.length} product(s) running low: `}
                                {lowStockItems.map(p => p.name).join(", ")}
                            </Text>
                        </Space>
                    </Card>
                )}

                <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                    <Table columns={columns} dataSource={data} rowKey="id" loading={loading}
                        pagination={{ pageSize: 15 }} scroll={{ x: 600 }} />
                </Card>

                {/* Stock Adjustment Modal */}
                <Modal
                    title={`${language === "my" ? "လက်ကျန်ပြင်ဆင်ရန်" : "Adjust Stock"}: ${adjusting?.name || ""}`}
                    open={adjustModal}
                    onCancel={() => setAdjustModal(false)}
                    footer={null}
                >
                    <div style={{ textAlign: "center", padding: "24px 0" }}>
                        <Text type="secondary">{language === "my" ? "လက်ရှိလက်ကျန်" : "Current Stock"}: <Text strong>{adjusting?.stock || 0}</Text></Text>
                        <div style={{ margin: "24px 0" }}>
                            <InputNumber
                                min={1}
                                value={adjustValue}
                                onChange={v => setAdjustValue(v || 0)}
                                size="large"
                                style={{ width: 120 }}
                            />
                        </div>
                        <Space size="large">
                            <Button
                                type="primary"
                                danger
                                icon={<MinusOutlined />}
                                size="large"
                                loading={saving}
                                onClick={() => handleAdjust("subtract")}
                            >
                                {language === "my" ? "ထုတ်မည်" : "Remove"}
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="large"
                                loading={saving}
                                onClick={() => handleAdjust("add")}
                                style={{ background: "#16a34a", borderColor: "#16a34a" }}
                            >
                                {language === "my" ? "ထည့်မည်" : "Add"}
                            </Button>
                        </Space>
                    </div>
                </Modal>
            </div>
        </AuthGuard>
    );
}
