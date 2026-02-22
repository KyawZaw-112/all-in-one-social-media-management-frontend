"use client";

import { useState, useEffect } from "react";
import {
    Table, Card, Typography, Tag, Space, Button, message,
    Modal, Input, InputNumber, Form, Switch, Popconfirm, Row, Col, Statistic
} from "antd";
import {
    ShoppingOutlined, PlusOutlined, ArrowLeftOutlined,
    EditOutlined, DeleteOutlined, InboxOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/lib/apiConfig";
import AuthGuard from "@/components/AuthGuard";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const { Title, Text } = Typography;

export default function ProductsPage() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [form] = Form.useForm();
    const { language } = useLanguage();
    const router = useRouter();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.get(`${API_URL}/api/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data.data || []);
        } catch {
            message.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleSave = async (values: any) => {
        setSaving(true);
        try {
            const token = localStorage.getItem("authToken");
            if (editing) {
                await axios.patch(`${API_URL}/api/products/${editing.id}`, values, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                message.success(language === "my" ? "ပြင်ဆင်ပြီးပါပြီ" : "Updated");
            } else {
                await axios.post(`${API_URL}/api/products`, values, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                message.success(language === "my" ? "ထည့်သွင်းပြီးပါပြီ" : "Created");
            }
            setModalVisible(false);
            setEditing(null);
            form.resetFields();
            fetchProducts();
        } catch {
            message.error("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`${API_URL}/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success(language === "my" ? "ဖျက်ပြီးပါပြီ" : "Deleted");
            fetchProducts();
        } catch {
            message.error("Failed to delete");
        }
    };

    const openEdit = (record: any) => {
        setEditing(record);
        form.setFieldsValue(record);
        setModalVisible(true);
    };

    const openAdd = () => {
        setEditing(null);
        form.resetFields();
        form.setFieldsValue({ price: 0, stock: 0, low_stock_threshold: 5, currency: "MMK", is_active: true });
        setModalVisible(true);
    };

    const totalValue = data.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0);
    const lowStockCount = data.filter(p => p.is_active && p.stock <= p.low_stock_threshold).length;

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
            title: language === "my" ? "ဈေးနှုန်း" : "Price",
            dataIndex: "price",
            key: "price",
            width: 120,
            render: (price: number, record: any) => (
                <Text>{Number(price).toLocaleString()} {record.currency || "MMK"}</Text>
            )
        },
        {
            title: language === "my" ? "လက်ကျန်" : "Stock",
            dataIndex: "stock",
            key: "stock",
            width: 100,
            render: (stock: number, record: any) => {
                const threshold = record.low_stock_threshold || 5;
                const color = stock <= 0 ? "error" : stock <= threshold ? "warning" : "success";
                const label = stock <= 0
                    ? (language === "my" ? "ကုန်သွားပြီ" : "Out")
                    : stock <= threshold
                        ? (language === "my" ? "နည်းနေပြီ" : "Low")
                        : `${stock}`;
                return <Tag color={color}>{label} {stock > 0 ? `(${stock})` : ""}</Tag>;
            }
        },
        {
            title: language === "my" ? "အခြေအနေ" : "Status",
            dataIndex: "is_active",
            key: "is_active",
            width: 90,
            render: (active: boolean) => (
                <Tag color={active ? "green" : "default"}>{active ? "Active" : "Inactive"}</Tag>
            )
        },
        {
            title: language === "my" ? "လုပ်ဆောင်ချက်" : "Action",
            key: "action",
            width: 140,
            render: (_: any, record: any) => (
                <Space>
                    <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
                    <Popconfirm
                        title={language === "my" ? "ဖျက်မှာ သေချာလား?" : "Delete this product?"}
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <AuthGuard>
            <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <Space size="middle">
                        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/dashboard")} type="text" style={{ fontSize: "18px" }} />
                        <ShoppingOutlined style={{ fontSize: "24px", color: "#6366f1" }} />
                        <Title level={2} style={{ margin: 0, fontWeight: 300 }}>
                            {language === "my" ? "ပစ္စည်းစာရင်း" : "Product Catalog"}
                        </Title>
                    </Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}
                        style={{ background: "#6366f1", borderColor: "#6366f1" }}>
                        {language === "my" ? "ပစ္စည်းထည့်မည်" : "Add Product"}
                    </Button>
                </div>

                {/* Stats */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={8}>
                        <Card bordered={false} style={{ background: "#f0fdf4", borderRadius: 12 }}>
                            <Statistic title={language === "my" ? "စုစုပေါင်း ပစ္စည်း" : "Total Products"} value={data.length}
                                prefix={<InboxOutlined />} valueStyle={{ color: "#16a34a" }} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card bordered={false} style={{ background: lowStockCount > 0 ? "#fef2f2" : "#f8fafc", borderRadius: 12 }}>
                            <Statistic title={language === "my" ? "လက်ကျန်နည်းနေသော" : "Low Stock"} value={lowStockCount}
                                valueStyle={{ color: lowStockCount > 0 ? "#dc2626" : "#64748b" }} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card bordered={false} style={{ background: "#eef2ff", borderRadius: 12 }}>
                            <Statistic title={language === "my" ? "စုစုပေါင်းတန်ဖိုး" : "Total Value"} value={totalValue.toLocaleString()}
                                suffix="MMK" valueStyle={{ color: "#6366f1" }} />
                        </Card>
                    </Col>
                </Row>

                <Card bordered={false} style={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 12 }}
                        scroll={{ x: 600 }}
                    />
                </Card>

                {/* Add/Edit Modal */}
                <Modal
                    title={editing
                        ? (language === "my" ? "ပစ္စည်းပြင်ဆင်ရန်" : "Edit Product")
                        : (language === "my" ? "ပစ္စည်းအသစ်ထည့်ရန်" : "Add Product")
                    }
                    open={modalVisible}
                    onCancel={() => { setModalVisible(false); setEditing(null); }}
                    footer={null}
                    destroyOnClose
                >
                    <Form form={form} layout="vertical" onFinish={handleSave}>
                        <Form.Item name="name" label={language === "my" ? "ပစ္စည်းအမည်" : "Product Name"}
                            rules={[{ required: true, message: "Required" }]}>
                            <Input placeholder="e.g. Premium Lipstick" />
                        </Form.Item>
                        <Form.Item name="description" label={language === "my" ? "ရှင်းလင်းချက်" : "Description"}>
                            <Input.TextArea rows={2} placeholder="Optional description" />
                        </Form.Item>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="price" label={language === "my" ? "ဈေးနှုန်း" : "Price"}>
                                    <InputNumber style={{ width: "100%" }} min={0} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="currency" label={language === "my" ? "ငွေကြေး" : "Currency"}>
                                    <Input placeholder="MMK" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="variants" label={language === "my" ? "အရောင်/ဆိုဒ်" : "Variants"}>
                            <Input placeholder="e.g. Red / L, Blue / M" />
                        </Form.Item>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="stock" label={language === "my" ? "လက်ကျန်" : "Stock"}>
                                    <InputNumber style={{ width: "100%" }} min={0} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="low_stock_threshold" label={language === "my" ? "Low Stock Limit" : "Low Stock Threshold"}>
                                    <InputNumber style={{ width: "100%" }} min={0} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="image_url" label={language === "my" ? "ပုံ URL" : "Image URL"}>
                            <Input placeholder="https://..." />
                        </Form.Item>
                        <Form.Item name="is_active" label={language === "my" ? "အသုံးပြုနိုင်မှု" : "Active"} valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={saving} block
                                style={{ background: "#6366f1", borderColor: "#6366f1" }}>
                                {editing
                                    ? (language === "my" ? "သိမ်းဆည်းမည်" : "Save Changes")
                                    : (language === "my" ? "ထည့်သွင်းမည်" : "Add Product")
                                }
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AuthGuard>
    );
}
