"use client";

import { useState, useEffect } from "react";
import { Table, Card, Typography, Tag, Space, Button, message, Modal, Descriptions } from "antd";
import { ReconciliationOutlined, ReloadOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { API_URL } from "@/lib/apiConfig";
import AuthGuard from "@/components/AuthGuard";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const { Title, Text } = Typography;

export default function ShipmentsPage() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
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

    const showDetail = (record: any) => {
        setSelectedRecord(record);
        setDetailVisible(true);
    };

    const renderDetailContent = () => {
        if (!selectedRecord) return null;
        const d = selectedRecord;

        return (
            <Descriptions bordered column={1} size="small">
                <Descriptions.Item label={language === 'my' ? "အိုင်ဒီ" : "ID"}>{d.id}</Descriptions.Item>
                <Descriptions.Item label={language === 'my' ? "ရက်စွဲ" : "Date"}>{dayjs(d.created_at).format("DD/MM/YYYY HH:mm:ss")}</Descriptions.Item>
                <Descriptions.Item label={language === 'my' ? "ပေးပို့သူ" : "Sender"}>{d.full_name || "-"}</Descriptions.Item>
                <Descriptions.Item label={language === 'my' ? "ဖုန်း" : "Phone"}>{d.phone || "-"}</Descriptions.Item>
                <Descriptions.Item label={language === 'my' ? "နိုင်ငံ" : "Country"}>{d.country || "-"}</Descriptions.Item>
                <Descriptions.Item label={language === 'my' ? "ပို့ဆောင်မှု" : "Shipping"}>{d.shipping || "-"}</Descriptions.Item>
                <Descriptions.Item label={language === 'my' ? "ပစ္စည်းအမျိုးအစား" : "Type"}>{d.item_type || "-"}</Descriptions.Item>
                <Descriptions.Item label={language === 'my' ? "ပစ္စည်း" : "Item"}>{d.item_name || "-"}</Descriptions.Item>
                <Descriptions.Item label={language === 'my' ? "အလေးချိန်" : "Weight"}>{d.weight || "-"}</Descriptions.Item>
                <Descriptions.Item label={language === 'my' ? "တန်ဖိုး" : "Item Value"}>{d.item_value || "-"}</Descriptions.Item>
                <Descriptions.Item label={language === 'my' ? "လိပ်စာ" : "Address"}>{d.address || "-"}</Descriptions.Item>
                <Descriptions.Item label={language === 'my' ? "အခြေအနေ" : "Status"}>
                    <Tag color={d.status === "completed" ? "success" : "processing"}>
                        {d.status?.toUpperCase()}
                    </Tag>
                </Descriptions.Item>
            </Descriptions>
        );
    };

    const columns = [
        {
            title: language === 'my' ? "အိုင်ဒီ" : "ID",
            dataIndex: "id",
            key: "id",
            width: 90,
            responsive: ['md'] as any,
            render: (id: string) => <Text copyable={{ text: id }}>{`#...${id.slice(-6).toUpperCase()}`}</Text>
        },
        {
            title: language === 'my' ? "ရက်စွဲ" : "Date",
            dataIndex: "created_at",
            key: "created_at",
            width: 120,
            responsive: ['sm'] as any,
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
        },
        {
            title: language === 'my' ? "လုပ်ဆောင်ချက်" : "Action",
            key: "action",
            fixed: 'right' as const,
            width: 120,
            render: (_: any, record: any) => (
                <Button icon={<EyeOutlined />} size="small" onClick={() => showDetail(record)}>
                    {language === 'my' ? "အသေးစိတ်" : "Detail"}
                </Button>
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
                        pagination={{ pageSize: 12 }}
                        scroll={{ x: 900 }}
                    />
                </Card>

                <Modal
                    title={language === 'my' ? "အသေးစိတ် အချက်အလက်" : "Shipment Details"}
                    open={detailVisible}
                    onCancel={() => setDetailVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setDetailVisible(false)}>
                            {language === 'my' ? "ပိတ်မည်" : "Close"}
                        </Button>
                    ]}
                    width={600}
                >
                    {renderDetailContent()}
                </Modal>
            </div>
        </AuthGuard>
    );
}
