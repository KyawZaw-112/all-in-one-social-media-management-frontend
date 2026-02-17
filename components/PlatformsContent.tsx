"use client";

import { Button, message, Tag, Spin, Popconfirm, Card, Typography, Space, Avatar } from "antd";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import {
    FacebookOutlined,
    CheckCircleFilled,
    DisconnectOutlined,
    ArrowLeftOutlined,
    SafetyCertificateOutlined,
    SyncOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

type PlatformConnection = {
    page_id: string;
    page_name: string;
    platform: "facebook" | "tik tok" | "viber";
}

export default function PlatformsContent() {
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [pages, setPages] = useState<PlatformConnection[]>([]);

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem("authToken");
            if (token) {
                checkConnection(token);
            } else {
                setChecking(false);
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (searchParams.get("connected") === "facebook") {
            message.success("Facebook connected successfully! 🚀");
            router.replace("/dashboard/platforms");
            // Re-fetch after short delay to let backend sync
            setTimeout(async () => {
                const token = localStorage.getItem("authToken");
                if (token) {
                    const freshPages = await checkConnection(token);
                    // 🚀 Auto-sync ALL newly connected pages for convenience
                    if (freshPages && freshPages.length > 0) {
                        message.loading({ content: "Synchronizing Webhooks...", key: "autosync" });
                        for (const p of freshPages) {
                            await syncPage(p.page_id, true);
                        }
                        message.success({ content: "All pages synchronized! 🚀", key: "autosync" });
                    }
                }
            }, 1000);
        }
    }, [searchParams]);

    const checkConnection = async (token: string) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/platforms`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Fetch failed");
            const data: PlatformConnection[] = await res.json();
            const facebookPages = data.filter((p) => p.platform === "facebook");
            setPages(facebookPages);
            return facebookPages; // Return for auto-sync logic
        } catch (err) {
            console.error(err);
            return [];
        } finally {
            setChecking(false);
        }
    };

    const connectFacebook = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");

            if (!token) {
                message.error("Please login again");
                return;
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/platforms/connect`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ platform: "facebook" }),
                }
            );

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                message.error("Could not get auth URL");
            }
        } catch {
            message.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const syncPage = async (pageId: string, silent = false) => {
        try {
            if (!silent) setLoading(true);
            const token = localStorage.getItem("authToken");
            if (!token) return;

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/platforms/${pageId}/sync`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.ok) {
                if (!silent) message.success("Page synchronized successfully ✨");
            } else {
                if (!silent) message.error("Sync failed. Please try again.");
            }
        } catch {
            if (!silent) message.error("Something went wrong during sync");
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const disconnectFacebook = async (pageId: string) => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/platforms/${pageId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.ok) {
                message.success("Disconnected successfully");
                setPages((prev) => prev.filter((p) => p.page_id !== pageId));
            }
        } catch {
            message.error("Failed to disconnect");
        }
    };

    if (checking) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
            {/* Minimalist Header */}
            <div style={{
                background: "#fff",
                padding: "20px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: "16px"
            }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    type="text"
                    onClick={() => router.push("/dashboard")}
                />
                <Title level={4} style={{ margin: 0 }}>Social Platforms</Title>
            </div>

            <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
                <Card
                    style={{ borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "none" }}
                    bodyStyle={{ padding: "32px" }}
                >
                    <div style={{ textAlign: "center", marginBottom: "32px" }}>
                        <Avatar
                            size={64}
                            icon={<FacebookOutlined />}
                            style={{ background: "#1877F2", marginBottom: "16px" }}
                        />
                        <Title level={3} style={{ margin: 0 }}>Facebook Integration</Title>
                        <Text type="secondary">သင့် Page မှ message များကို AI ဖြင့် အလိုအလျောက် ပြန်ကြားပေးရန် ချိတ်ဆက်ပါ</Text>
                    </div>

                    {pages.length > 0 ? (
                        <Space direction="vertical" style={{ width: "100%" }} size={16}>
                            {pages.map((page) => (
                                <div
                                    key={page.page_id}
                                    style={{
                                        background: "#f0fdf4",
                                        padding: "16px 24px",
                                        borderRadius: "16px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        border: "1px solid #dcfce7"
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                                            {page.page_name} <CheckCircleFilled style={{ color: "#22c55e" }} />
                                        </div>
                                        <Text type="secondary" style={{ fontSize: "12px" }}>ID: {page.page_id}</Text>
                                    </div>

                                    <Space>
                                        <Button
                                            type="text"
                                            icon={<SyncOutlined spin={loading} />}
                                            onClick={() => syncPage(page.page_id)}
                                            disabled={loading}
                                        >
                                            Sync
                                        </Button>

                                        <Popconfirm
                                            title="Disconnect this page?"
                                            description="Are you sure you want to stop auto-replies for this page?"
                                            onConfirm={() => disconnectFacebook(page.page_id)}
                                            okText="Yes, Disconnect"
                                            cancelText="No"
                                            okButtonProps={{ danger: true }}
                                        >
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DisconnectOutlined />}
                                            >
                                                Disconnect
                                            </Button>
                                        </Popconfirm>
                                    </Space>
                                </div>
                            ))}

                            <Button
                                block
                                type="dashed"
                                onClick={connectFacebook}
                                loading={loading}
                                style={{ borderRadius: "12px", height: "45px" }}
                            >
                                + Connect Another Page
                            </Button>
                        </Space>
                    ) : (
                        <div style={{ textAlign: "center" }}>
                            <div style={{
                                background: "#f8fafc",
                                padding: "40px",
                                borderRadius: "20px",
                                marginBottom: "24px",
                                border: "1px dashed #e2e8f0"
                            }}>
                                <Space direction="vertical" align="center">
                                    <SafetyCertificateOutlined style={{ fontSize: "40px", color: "#64748b" }} />
                                    <Text strong>No pages connected yet</Text>
                                    <Text type="secondary" style={{ fontSize: "12px" }}>Facebook Page ကို ချိတ်ဆက်ပြီး Auto-Reply စတင်အသုံးပြုနိုင်ပါပြီ</Text>
                                </Space>
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                block
                                loading={loading}
                                onClick={connectFacebook}
                                icon={<FacebookOutlined />}
                                style={{
                                    height: "56px",
                                    borderRadius: "16px",
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    background: "#1877F2",
                                    boxShadow: "0 10px 15px -3px rgba(24, 119, 242, 0.3)"
                                }}
                            >
                                Connect Facebook Page
                            </Button>
                        </div>
                    )}
                </Card>

                <div style={{ textAlign: "center", marginTop: "32px", color: "#94a3b8", fontSize: "13px" }}>
                    Your data is secure and encrypted. We only access the permissions necessary for auto-reply.
                </div>
            </div>
        </div>
    );
}
