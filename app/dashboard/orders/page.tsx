"use client";

import { useState, useEffect } from "react";
import { Table, Card, Typography, Tag, Space, Button, message, Modal, Input, Select, Form } from "antd";
import { ShoppingCartOutlined, ReloadOutlined, SendOutlined, EyeOutlined, ArrowLeftOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
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
    const [pageName, setPageName] = useState<string>("");
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const { t, language } = useLanguage();
    const router = useRouter();

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");

            // 1. Fetch merchant profile to know business type & page name
            const profileRes = await axios.get(`${API_URL}/api/merchants/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const bType = profileRes.data.data.business_type;
            setBusinessType(bType);
            setPageName(profileRes.data.data.page_name || profileRes.data.data.business_name || "");

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

    // ─── Edit & Save Handler ─────────────────────────────────────────
    const handleSaveDetail = async () => {
        if (!selectedRecord) return;
        setSaving(true);
        try {
            const token = localStorage.getItem("authToken");
            const isCargo = businessType === 'cargo';
            const endpoint = isCargo
                ? `/api/merchants/shipments/${selectedRecord.id}`
                : `/api/merchants/orders/${selectedRecord.id}`;

            await axios.patch(`${API_URL}${endpoint}`, editData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            message.success(language === 'my' ? "သိမ်းဆည်းပြီးပါပြီ" : "Saved successfully");
            setEditMode(false);
            setDetailVisible(false);
            fetchData();
        } catch (error) {
            console.error("Save error:", error);
            message.error("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const showDetail = (record: any) => {
        setSelectedRecord(record);
        setEditData({ ...record });
        setEditMode(false);
        setDetailVisible(true);
    };

    // ─── PDF Download ────────────────────────────────────────────────
    const handleDownloadPDF = () => {
        try {
            const isCargo = businessType === 'cargo';
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const sevenDaysAgo = dayjs().subtract(7, 'day');
            const filteredData = data.filter((item: any) => dayjs(item.created_at).isAfter(sevenDaysAgo));

            if (filteredData.length === 0) {
                message.warning(language === 'my' ? "နောက်ဆုံး ၇ ရက်အတွင်း အချက်အလက်မရှိပါ။" : "No data found for the last 7 days.");
                return;
            }

            // ─── Pretty Header ───────────────────────────────────
            const headerColor = isCargo ? [245, 158, 11] : [99, 102, 241];
            doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
            doc.rect(0, 0, pageWidth, 30, 'F');

            // Page name
            doc.setFontSize(20);
            doc.setTextColor(255, 255, 255);
            doc.text(pageName || "My Business", 14, 14);

            // Business type badge
            doc.setFontSize(10);
            const badge = isCargo ? "CARGO SERVICE" : "ONLINE SHOP";
            doc.text(badge, 14, 22);

            // Date on right side
            doc.setFontSize(10);
            const dateText = `Report: ${dayjs().subtract(7, 'day').format("DD/MM")} - ${dayjs().format("DD/MM/YYYY")}`;
            const dateW = doc.getTextWidth(dateText);
            doc.text(dateText, pageWidth - dateW - 14, 14);

            const countText = `Total Records: ${filteredData.length}`;
            const countW = doc.getTextWidth(countText);
            doc.text(countText, pageWidth - countW - 14, 22);

            // Reset text color
            doc.setTextColor(0, 0, 0);

            // ─── Table ───────────────────────────────────────────
            const filename = isCargo
                ? `shipments_${dayjs().format("YYYYMMDD")}.pdf`
                : `orders_${dayjs().format("YYYYMMDD")}.pdf`;

            let columns, rows;

            if (isCargo) {
                columns = ["ID", "Date", "Sender", "Phone", "Item", "Weight", "Country", "Shipping", "Address", "Status"];
                rows = filteredData.map((item: any) => [
                    item.id,
                    dayjs(item.created_at).format("DD/MM/YYYY"),
                    item.full_name || "-",
                    item.phone || "-",
                    item.item_name || "-",
                    item.weight || "-",
                    item.country || "-",
                    item.shipping || "-",
                    item.address || "-",
                    item.status?.toUpperCase()
                ]);
            } else {
                columns = ["ID", "Date", "Customer", "Phone", "Item", "Qty", "Delivery", "Address", "Note/KPay", "Status"];
                rows = filteredData.map((item: any) => [
                    item.id,
                    dayjs(item.created_at).format("DD/MM/YYYY"),
                    item.full_name || "-",
                    item.phone || "-",
                    item.item_name || "-",
                    item.quantity || "1",
                    item.delivery || "-",
                    item.address || "-",
                    item.notes || "-",
                    item.status?.toUpperCase()
                ]);
            }

            autoTable(doc, {
                startY: 38,
                head: [columns],
                body: rows,
                theme: 'striped',
                headStyles: { fillColor: headerColor as any, fontSize: 7, fontStyle: 'bold' },
                styles: { fontSize: 7, cellPadding: 2 },
                columnStyles: {
                    0: { cellWidth: 30 },
                },
            });

            doc.save(filename);
            message.success(language === 'my' ? "PDF ဒေါင်းလုဒ်လုပ်ပြီးပါပြီ။" : "PDF downloaded successfully.");
        } catch (error) {
            console.error("PDF generation error:", error);
            message.error("Failed to generate PDF");
        }
    };

    // ─── Editable Detail Content ─────────────────────────────────────
    const renderDetailContent = () => {
        if (!selectedRecord) return null;
        const isCargo = businessType === 'cargo';
        const d = editMode ? editData : selectedRecord;
        const onChange = (field: string, value: any) => setEditData((prev: any) => ({ ...prev, [field]: value }));

        const Field = ({ label, field, value }: { label: string; field: string; value: any }) => (
            <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0", padding: "8px 0" }}>
                <div style={{ width: "140px", fontWeight: 600, color: "#555" }}>{label}</div>
                <div style={{ flex: 1 }}>
                    {editMode ? (
                        <Input
                            size="small"
                            value={editData[field] ?? ""}
                            onChange={e => onChange(field, e.target.value)}
                        />
                    ) : (
                        <span>{value || "-"}</span>
                    )}
                </div>
            </div>
        );

        return (
            <div>
                <Field label={language === 'my' ? "အိုင်ဒီ" : "ID"} field="id" value={d.id} />
                <Field label={language === 'my' ? "အမည်" : "Name"} field="full_name" value={d.full_name} />
                <Field label={language === 'my' ? "ဖုန်း" : "Phone"} field="phone" value={d.phone} />
                <Field label={language === 'my' ? "ရက်စွဲ" : "Date"} field="" value={dayjs(d.created_at).format("DD/MM/YYYY HH:mm")} />

                {isCargo ? (
                    <>
                        <Field label={language === 'my' ? "နိုင်ငံ" : "Country"} field="country" value={d.country} />
                        <Field label={language === 'my' ? "ပို့ဆောင်မှု" : "Shipping"} field="shipping" value={d.shipping} />
                        <Field label={language === 'my' ? "ပစ္စည်းအမျိုးအစား" : "Type"} field="item_type" value={d.item_type} />
                        <Field label={language === 'my' ? "ပစ္စည်း" : "Item"} field="item_name" value={d.item_name} />
                        <Field label={language === 'my' ? "အလေးချိန်" : "Weight"} field="weight" value={d.weight} />
                        <Field label={language === 'my' ? "တန်ဖိုး" : "Value"} field="item_value" value={d.item_value} />
                    </>
                ) : (
                    <>
                        <Field label={language === 'my' ? "ပစ္စည်း" : "Item"} field="item_name" value={d.item_name} />
                        <Field label={language === 'my' ? "ဒီဇိုင်း/ဆိုဒ်" : "Variant"} field="item_variant" value={d.item_variant} />
                        <Field label={language === 'my' ? "အရေအတွက်" : "Qty"} field="quantity" value={d.quantity} />
                        <Field label={language === 'my' ? "ပို့ဆောင်မှု" : "Delivery"} field="delivery" value={d.delivery} />
                        <Field label={language === 'my' ? "ငွေပေးချေမှု" : "Payment"} field="payment_method" value={d.payment_method || d.payment} />
                    </>
                )}

                <Field label={language === 'my' ? "လိပ်စာ" : "Address"} field="address" value={d.address} />
                <Field label={language === 'my' ? "မှတ်ချက်/KPay" : "Note/KPay"} field="notes" value={d.notes} />

                <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0", padding: "8px 0" }}>
                    <div style={{ width: "140px", fontWeight: 600, color: "#555" }}>{language === 'my' ? "အခြေအနေ" : "Status"}</div>
                    <div style={{ flex: 1 }}>
                        {editMode ? (
                            <Select
                                size="small"
                                value={editData.status}
                                onChange={v => onChange("status", v)}
                                style={{ width: 160 }}
                            >
                                <Select.Option value="pending">PENDING</Select.Option>
                                <Select.Option value="approved">APPROVED</Select.Option>
                                <Select.Option value="completed">COMPLETED</Select.Option>
                                <Select.Option value="cancelled">CANCELLED</Select.Option>
                            </Select>
                        ) : (
                            <Tag color={d.status === 'pending' ? 'processing' : d.status === 'approved' ? 'success' : d.status === 'completed' ? 'gold' : 'error'}>
                                {d.status === 'approved' && language === 'my' ? 'အတည်ပြုပြီး' : d.status?.toUpperCase()}
                            </Tag>
                        )}
                    </div>
                </div>
            </div>
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
                    title={
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span>{language === 'my' ? "အသေးစိတ် အချက်အလက်" : "Order Details"}</span>
                            {!editMode && (
                                <Button
                                    type="link"
                                    icon={<EditOutlined />}
                                    onClick={() => setEditMode(true)}
                                    style={{ padding: 0 }}
                                >
                                    {language === 'my' ? "ပြင်ဆင်ရန်" : "Edit"}
                                </Button>
                            )}
                        </div>
                    }
                    open={detailVisible}
                    onCancel={() => { setDetailVisible(false); setEditMode(false); }}
                    footer={
                        editMode ? [
                            <Button key="cancel" onClick={() => setEditMode(false)}>
                                {language === 'my' ? "ပယ်ဖျက်" : "Cancel"}
                            </Button>,
                            <Button
                                key="save"
                                type="primary"
                                icon={<SaveOutlined />}
                                loading={saving}
                                onClick={handleSaveDetail}
                                style={{
                                    backgroundColor: businessType === 'cargo' ? '#f59e0b' : '#6366f1',
                                    borderColor: businessType === 'cargo' ? '#f59e0b' : '#6366f1'
                                }}
                            >
                                {language === 'my' ? "သိမ်းဆည်းမည်" : "Save"}
                            </Button>
                        ] : [
                            <Button key="close" onClick={() => setDetailVisible(false)}>
                                {language === 'my' ? "ပိတ်မည်" : "Close"}
                            </Button>
                        ]
                    }
                    width={600}
                >
                    {renderDetailContent()}
                </Modal>
            </div>
        </AuthGuard>
    );
}
