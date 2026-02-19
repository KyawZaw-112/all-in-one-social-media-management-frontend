"use client";

import { useState, useEffect } from "react";
import { Table, Card, Typography, Tag, Space, Button, message, Modal, Descriptions, Tooltip } from "antd";
import { ShoppingCartOutlined, ReloadOutlined, SendOutlined, EyeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import axios from "axios";
import dayjs from "dayjs";
import { API_URL } from "@/lib/apiConfig";
import AuthGuard from "@/components/AuthGuard";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title, Text } = Typography;

export default function OrdersPage() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [businessType, setBusinessType] = useState<string | null>(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const { t, language } = useLanguage();
    const router = useRouter();

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

    const showDetail = (record: any) => {
        setSelectedRecord(record);
        setDetailVisible(true);
    };

    const handleDownloadPDF = () => {
        try {
            const doc = new jsPDF();
            const isCargo = businessType === 'cargo';
            const title = isCargo ? "Shipment Report (Last 7 Days)" : "Order Report (Last 7 Days)";
            const filename = isCargo ? `shipments_${dayjs().format("YYYYMMDD")}.pdf` : `orders_${dayjs().format("YYYYMMDD")}.pdf`;

            // Filter data for last 7 days
            const sevenDaysAgo = dayjs().subtract(7, 'day');
            const filteredData = data.filter((item: any) => dayjs(item.created_at).isAfter(sevenDaysAgo));

            if (filteredData.length === 0) {
                message.warning(language === 'my' ? "နောက်ဆုံး ၇ ရက်အတွင်း အချက်အလက်မရှိပါ။" : "No data found for the last 7 days.");
                return;
            }

            // PDF Styling
            doc.setFontSize(18);
            doc.text(title, 14, 22);
            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Generated on: ${dayjs().format("DD/MM/YYYY HH:mm")}`, 14, 30);

            // Table Columns & Rows
            let columns, rows;

            if (isCargo) {
                columns = ["ID", "Date", "Sender", "Item", "Weight", "Status"];
                rows = filteredData.map((item: any) => [
                    item.id.slice(-6).toUpperCase(),
                    dayjs(item.created_at).format("DD/MM/YYYY"),
                    item.full_name || "-",
                    item.item_name || "-",
                    item.weight || "-",
                    item.status?.toUpperCase()
                ]);
            } else {
                columns = ["ID", "Date", "Customer", "Item", "Qty", "Status"];
                rows = filteredData.map((item: any) => [
                    item.id.slice(-6).toUpperCase(),
                    dayjs(item.created_at).format("DD/MM/YYYY"),
                    item.full_name || "-",
                    item.item_name || "-",
                    item.quantity || "1",
                    item.status?.toUpperCase()
                ]);
            }

            autoTable(doc, {
                startY: 40,
                head: [columns],
                body: rows,
                theme: 'striped',
                headStyles: { fillColor: isCargo ? [245, 158, 11] : [99, 102, 241] },
                styles: { fontSize: 9 },
            });

            doc.save(filename);
            message.success(language === 'my' ? "PDF ဒေါင်းလုဒ်လုပ်ပြီးပါပြီ။" : "PDF downloaded successfully.");
        } catch (error) {
            console.error("PDF generation error:", error);
            message.error("Failed to generate PDF");
        }
    };

    const renderDetailContent = () => {
        if (!selectedRecord) return null;

        const isCargo = businessType === 'cargo';

        return (
            <Descriptions bordered column={1} size="small">
                <Descriptions.Item label={language === 'my' ? "အိုင်ဒီ" : "ID"}>{selectedRecord.id}</Descriptions.Item>
                <Descriptions.Item label={language === 'my' ? "အမည်" : "Name"}>{selectedRecord.full_name || "-"}</Descriptions.Item>
                <Descriptions.Item label={language === 'my' ? "ဖုန်း" : "Phone"}>{selectedRecord.phone || "-"}</Descriptions.Item>
                <Descriptions.Item label={language === 'my' ? "ရက်စွဲ" : "Date"}>{dayjs(selectedRecord.created_at).format("DD/MM/YYYY HH:mm")}</Descriptions.Item>

                {isCargo ? (
                    <>
                        <Descriptions.Item label={language === 'my' ? "နိုင်ငံ" : "Country"}>{selectedRecord.country}</Descriptions.Item>
                        <Descriptions.Item label={language === 'my' ? "ပို့ဆောင်မှု" : "Shipping"}>{selectedRecord.shipping}</Descriptions.Item>
                        <Descriptions.Item label={language === 'my' ? "ပစ္စည်းအမျိုးအစား" : "Type"}>{selectedRecord.item_type}</Descriptions.Item>
                        <Descriptions.Item label={language === 'my' ? "ပစ္စည်း" : "Item"}>{selectedRecord.item_name}</Descriptions.Item>
                        <Descriptions.Item label={language === 'my' ? "အလေးချိန်" : "Weight"}>{selectedRecord.weight}</Descriptions.Item>
                        <Descriptions.Item label={language === 'my' ? "တန်ဖိုး" : "Value"}>{selectedRecord.item_value}</Descriptions.Item>
                    </>
                ) : (
                    <>
                        <Descriptions.Item label={language === 'my' ? "ပစ္စည်း" : "Item"}>{selectedRecord.item_name}</Descriptions.Item>
                        <Descriptions.Item label={language === 'my' ? "ဒီဇိုင်း/ဆိုဒ်" : "Variant"}>{selectedRecord.item_variant}</Descriptions.Item>
                        <Descriptions.Item label={language === 'my' ? "အရေအတွက်" : "Qty"}>{selectedRecord.quantity}</Descriptions.Item>
                        <Descriptions.Item label={language === 'my' ? "ပို့ဆောင်မှု" : "Delivery"}>{selectedRecord.delivery}</Descriptions.Item>
                        <Descriptions.Item label={language === 'my' ? "ငွေပေးချေမှု" : "Payment"}>{selectedRecord.payment_method || selectedRecord.payment}</Descriptions.Item>
                    </>
                )}

                <Descriptions.Item label={language === 'my' ? "လိပ်စာ" : "Address"}>{selectedRecord.address}</Descriptions.Item>
                <Descriptions.Item label={language === 'my' ? "အခြေအနေ" : "Status"}>
                    <Tag color={selectedRecord.status === 'pending' ? 'processing' : 'success'}>
                        {selectedRecord.status?.toUpperCase()}
                    </Tag>
                </Descriptions.Item>
            </Descriptions>
        );
    };

    const shopColumns = [
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
            title: language === 'my' ? "ဝယ်သူအမည်" : "Customer",
            dataIndex: "full_name",
            key: "full_name",
            render: (text: string) => text || "-",
        },
        {
            title: language === 'my' ? "ပစ္စည်းအမည်" : "Item",
            dataIndex: "item_name",
            key: "item_name",
            ellipsis: true,
        },
        {
            title: language === 'my' ? "အရေအတွက်" : "Qty",
            dataIndex: "quantity",
            key: "quantity",
            width: 80,
        },
        {
            title: language === 'my' ? "အခြေအနေ" : "Status",
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status: string) => {
                let color = "processing";
                let label = status?.toUpperCase();

                if (status === "approved" || status === "confirmed") {
                    color = "success";
                    label = language === 'my' ? "အတည်ပြုပြီး" : "APPROVED";
                }
                if (status === "completed") color = "gold";
                if (status === "cancelled") color = "error";

                return (
                    <Tag color={color}>
                        {label}
                    </Tag>
                );
            }
        },
        {
            title: language === 'my' ? "လုပ်ဆောင်ချက်" : "Action",
            key: "action",
            fixed: 'right' as const,
            width: 180,
            render: (_: any, record: any) => (
                <Space>
                    <Button icon={<EyeOutlined />} size="small" onClick={() => showDetail(record)}>
                        {language === 'my' ? "အသေးစိတ်" : "Detail"}
                    </Button>
                    {record.status === 'pending' && (
                        <Button type="primary" size="small" onClick={() => handleUpdateStatus(record.id, 'approved')}>
                            {language === 'my' ? "အတည်ပြုမည်" : "Confirm"}
                        </Button>
                    )}
                </Space>
            )
        }
    ];

    const cargoColumns = [
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
        },
        {
            title: language === 'my' ? "ပို့ဆောင်သူ" : "Sender",
            dataIndex: "full_name",
            key: "full_name",
        },
        {
            title: language === 'my' ? "ပစ္စည်း" : "Item",
            dataIndex: "item_name",
            key: "item_name",
            ellipsis: true,
        },
        {
            title: language === 'my' ? "အလေးချိန်" : "Weight",
            dataIndex: "weight",
            key: "weight",
            width: 100,
        },
        {
            title: language === 'my' ? "အခြေအနေ" : "Status",
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status: string) => {
                let color = "processing";
                let label = status?.toUpperCase();

                if (status === "approved" || status === "confirmed") {
                    color = "success";
                    label = language === 'my' ? "အတည်ပြုပြီး" : "APPROVED";
                }
                if (status === "completed") color = "gold";
                if (status === "cancelled") color = "error";

                return (
                    <Tag color={color}>
                        {label}
                    </Tag>
                );
            }
        },
        {
            title: language === 'my' ? "လုပ်ဆောင်ချက်" : "Action",
            key: "action",
            fixed: 'right' as const,
            width: 180,
            render: (_: any, record: any) => (
                <Space>
                    <Button icon={<EyeOutlined />} size="small" onClick={() => showDetail(record)}>
                        {language === 'my' ? "အသေးစိတ်" : "Detail"}
                    </Button>
                    {record.status === 'pending' && (
                        <Button type="primary" size="small" onClick={() => handleUpdateStatus(record.id, 'approved')}>
                            {language === 'my' ? "အတည်ပြုမည်" : "Confirm"}
                        </Button>
                    )}
                </Space>
            )
        }
    ];

    const columns = businessType === 'cargo' ? cargoColumns : shopColumns;

    return (
        <AuthGuard>
            <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <Space size="middle">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.push("/dashboard")}
                            type="text"
                            style={{ fontSize: "18px" }}
                        />
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
                    <Space>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={fetchData}
                            loading={loading}
                        >
                            {language === 'my' ? "ပြန်ပွင့်ပါ" : "Refresh"}
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleDownloadPDF}
                            style={{
                                backgroundColor: businessType === 'cargo' ? '#f59e0b' : '#6366f1',
                                borderColor: businessType === 'cargo' ? '#f59e0b' : '#6366f1'
                            }}
                        >
                            {language === 'my' ? "PDF ဒေါင်းမည်" : "Download PDF"}
                        </Button>
                    </Space>
                </div>

                <Card bordered={false} style={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 12 }}
                        scroll={{ x: 800 }}
                    />
                </Card>

                <Modal
                    title={language === 'my' ? "အသေးစိတ် အချက်အလက်" : "Order Details"}
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
