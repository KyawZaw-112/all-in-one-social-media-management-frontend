"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, Typography, Divider, Spin, Badge, Space, Button, Result } from "antd";
import { CheckCircleFilled, ShopOutlined, PrinterOutlined, GlobalOutlined } from "@ant-design/icons";
import supabase from "@/lib/supabase";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

export default function ReceiptPage() {
    const params = useParams();
    const orderNo = params.orderNo as string;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [pageName, setPageName] = useState<string>("");
    const [type, setType] = useState<"order" | "shipment" | null>(null);
    const [lang, setLang] = useState<"my" | "en">("my");

    useEffect(() => {
        if (orderNo) {
            fetchReceiptData();
        }
    }, [orderNo]);

    const fetchReceiptData = async () => {
        setLoading(true);
        try {
            // Check Orders first
            let { data: order, error: orderErr } = await supabase
                .from("orders")
                .select("*")
                .eq("order_no", orderNo)
                .maybeSingle();

            if (order) {
                setData(order);
                setType("order");
                await fetchPageName(order.page_id);
            } else {
                // Check Shipments
                let { data: shipment, error: shipErr } = await supabase
                    .from("shipments")
                    .select("*")
                    .eq("order_no", orderNo)
                    .maybeSingle();

                if (shipment) {
                    setData(shipment);
                    setType("shipment");
                    await fetchPageName(shipment.page_id);
                }
            }
        } catch (err) {
            console.error("Error fetching receipt:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPageName = async (pageId: string) => {
        if (!pageId) return;
        const { data: conn } = await supabase
            .from("platform_connections")
            .select("page_name")
            .eq("page_id", pageId)
            .maybeSingle();
        if (conn) setPageName(conn.page_name);
    };

    const translations = {
        my: {
            title: "အရောင်းပြေစာ",
            orderNo: "မှာယူမှုအမှတ်",
            date: "ရက်စွဲ",
            customer: "ဝယ်ယူသူ",
            phone: "ဖုန်း",
            address: "လိပ်စာ",
            item: "ပစ္စည်းအမည်",
            qty: "အရေအတွက်",
            price: "ဈေးနှုန်း",
            total: "စုစုပေါင်း",
            status: "အခြေအနေ",
            payment: "ငွေပေးချေမှု",
            thanks: "ဝယ်ယူအားပေးမှုကို ကျေးဇူးတင်ပါသည်!",
            notFound: "ပြေစာ ရှာမတွေ့ပါ",
            weight: "အလေးချိန်",
            route: "လမ်းကြောင်း",
        },
        en: {
            title: "Receipt",
            orderNo: "Order No",
            date: "Date",
            customer: "Customer",
            phone: "Phone",
            address: "Address",
            item: "Item",
            qty: "Qty",
            price: "Price",
            total: "Total",
            status: "Status",
            payment: "Payment",
            thanks: "Thank you for your business!",
            notFound: "Receipt Not Found",
            weight: "Weight",
            route: "Route",
        }
    };

    const t = translations[lang];

    if (loading) {
        return (
            <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Spin size="large" tip="Loading Receipt..." />
            </div>
        );
    }

    if (!data) {
        return (
            <Result
                status="404"
                title="404"
                subTitle={t.notFound}
                extra={<Button type="primary" onClick={() => window.location.reload()}>Retry</Button>}
            />
        );
    }

    const isOrder = type === "order";

    return (
        <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh", padding: "40px 10px" }}>
            <Card
                style={{
                    maxWidth: "500px",
                    margin: "0 auto",
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    border: "none"
                }}
            >
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                    <Button
                        size="small"
                        icon={<GlobalOutlined />}
                        onClick={() => setLang(lang === "my" ? "en" : "my")}
                    >
                        {lang === "my" ? "English" : "ဗမာ"}
                    </Button>
                </div>

                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    {pageName ? (
                        <Title level={3} style={{ margin: 0, color: "#1a1a1a" }}>{pageName}</Title>
                    ) : (
                        <ShopOutlined style={{ fontSize: "40px", color: "#6366f1" }} />
                    )}
                    <Title level={4} style={{ marginTop: "10px", marginBottom: 0, fontWeight: 300, color: "#666" }}>
                        {t.title}
                    </Title>
                    <Badge status="success" text={<Text type="secondary">{dayjs(data.created_at).format("DD MMM YYYY, HH:mm")}</Text>} />
                </div>

                <Divider style={{ margin: "10px 0" }} />

                <Space direction="vertical" style={{ width: "100%" }} size="middle">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Text type="secondary">{t.orderNo}</Text>
                        <Text strong>{data.order_no}</Text>
                    </div>

                    <div style={{ backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "12px" }}>
                        <Paragraph style={{ marginBottom: "5px" }}>
                            <Text type="secondary" style={{ fontSize: "12px" }}>{t.customer}</Text><br />
                            <Text strong style={{ fontSize: "16px" }}>{data.full_name}</Text>
                        </Paragraph>
                        <Paragraph style={{ marginBottom: "5px" }}>
                            <Text type="secondary" style={{ fontSize: "12px" }}>{t.phone}</Text><br />
                            <Text>{data.phone}</Text>
                        </Paragraph>
                        <Paragraph style={{ marginBottom: 0 }}>
                            <Text type="secondary" style={{ fontSize: "12px" }}>{t.address}</Text><br />
                            <Text style={{ whiteSpace: "pre-wrap" }}>{data.address}</Text>
                        </Paragraph>
                    </div>

                    <div style={{ padding: "0 5px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <Text strong>{isOrder ? t.item : t.item}</Text>
                            <Text strong>{isOrder ? t.total : t.weight}</Text>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Space direction="vertical" size={0}>
                                <Text>{data.item_name || data.product_name}</Text>
                                {isOrder && data.item_variant && (
                                    <Text type="secondary" style={{ fontSize: "12px" }}>{data.item_variant}</Text>
                                )}
                                {isOrder && <Text type="secondary" style={{ fontSize: "12px" }}>Qty: {data.quantity}</Text>}
                                {!isOrder && <Text type="secondary" style={{ fontSize: "12px" }}>{data.item_type} | {data.shipping}</Text>}
                            </Space>
                            <Text strong>{isOrder ? `${data.total_amount || '-'} K` : `${data.weight || '-'} kg`}</Text>
                        </div>
                    </div>

                    {!isOrder && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Text type="secondary">{t.route}</Text>
                            <Text>{data.country}</Text>
                        </div>
                    )}

                    <Divider style={{ margin: "10px 0" }} />

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Text type="secondary">{t.status}</Text>
                        <Badge status={data.status === "completed" ? "success" : "processing"} text={data.status?.toUpperCase()} />
                    </div>

                    {isOrder && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Text type="secondary">{t.payment}</Text>
                            <Text>{data.payment_method || data.payment}</Text>
                        </div>
                    )}
                </Space>

                <div style={{ textAlign: "center", marginTop: "40px", padding: "20px 0" }}>
                    <CheckCircleFilled style={{ fontSize: "32px", color: "#52c41a", marginBottom: "10px" }} />
                    <Paragraph style={{ margin: 0 }}>
                        <Text strong style={{ color: "#52c41a" }}>{t.thanks}</Text>
                    </Paragraph>
                    <Text type="secondary" style={{ fontSize: "10px" }}>Powered by Vibe AI</Text>
                </div>

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <Button type="link" icon={<PrinterOutlined />} onClick={() => window.print()}>
                        Print Receipt
                    </Button>
                </div>
            </Card>
        </div>
    );
}
