"use client";

import { Button, message, Tag, Spin, Popconfirm, Card, Typography, Space, Avatar, Alert } from "antd";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    FacebookOutlined,
    CheckCircleFilled,
    DisconnectOutlined,
    ArrowLeftOutlined,
    SafetyCertificateOutlined,
    SyncOutlined,
    WarningOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const { Title, Text } = Typography;

type PlatformConnection = {
    page_id: string;
    page_name: string;
    platform: "facebook" | "tik tok" | "viber";
}

export default function PlatformsContent() {
    const { t } = useLanguage();
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
            message.success(t.common.success + " 🚀");
            router.replace("/dashboard/platforms");

            // Retry checking connection 3 times to allow backend to sync
            let attempts = 0;
            const checkLoop = setInterval(async () => {
                attempts++;
                const token = localStorage.getItem("authToken");
                if (token) {
                    const freshPages = await checkConnection(token);
                    if (freshPages && freshPages.length > 0) {
                        clearInterval(checkLoop); // Stop if found
                        message.loading({ content: "Synchronizing Webhooks...", key: "autosync" });
                        for (const p of freshPages) {
                            await syncPage(p.page_id, true);
                        }
                        message.success({ content: "All pages synchronized! 🚀", key: "autosync" });
                    }
                }
                if (attempts >= 5) clearInterval(checkLoop); // Stop after 5 attempts
            }, 2000); // Check every 2 seconds
        }
    }, [searchParams]);

    const checkConnection = async (token: string) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/platforms`,
                {
                    cache: "no-store",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Fetch failed");
            const data: PlatformConnection[] = await res.json();
            const facebookPages = data.filter((p) => p.platform === "facebook");
            setPages(facebookPages);
            return facebookPages;
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
                message.error(t.common.error);
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

            if (!res.ok) {
                // Handle 1-page limit error
                if (data.code === "PAGE_LIMIT_REACHED") {
                    message.warning(data.error);
                } else {
                    message.error(data.error || t.common.error);
                }
                return;
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                message.error("Could not get auth URL");
            }
        } catch {
            message.error(t.common.error);
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
                if (!silent) message.success(t.common.success + " ✨");
            } else {
                if (!silent) message.error(t.common.error);
            }
        } catch {
            if (!silent) message.error(t.common.error);
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
                message.success(t.common.success + " ✅");
                setPages((prev) => prev.filter((p) => p.page_id !== pageId));
            }
        } catch {
            message.error(t.common.error);
        }
    };

    if (checking) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    const hasPage = pages.length > 0;

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
                <Title level={4} style={{ margin: 0 }}>{t.platforms.title}</Title>
            </div>

            <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
                {/* 1-Page Limit Notice */}
                <Alert
                    message={t.platforms.limitNotice}
                    description={t.platforms.limitDesc}
                    type="info"
                    showIcon
                    icon={<InfoCircleOutlined />}
                    style={{ borderRadius: 16, marginBottom: 24, border: "1px solid #91d5ff" }}
                />

                <Card
                    style={{ borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "none" }}
                    styles={{ body: { padding: "32px" } }}
                >
                    <div style={{ textAlign: "center", marginBottom: "32px" }}>
                        <Avatar
                            size={64}
                            icon={<FacebookOutlined />}
                            style={{ background: "#1877F2", marginBottom: "16px" }}
                        />
                        <Title level={3} style={{ margin: 0 }}>{t.platforms.facebookIntegration}</Title>
                        <Text type="secondary">{t.platforms.facebookDesc}</Text>
                    </div>

                    {hasPage ? (
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
                                            {t.platforms.syncButton}
                                        </Button>

                                        <Popconfirm
                                            title={t.platforms.disconnectTitle}
                                            description={
                                                <div>
                                                    <p>{t.platforms.disconnectWarning}</p>
                                                    <ul style={{ paddingLeft: 16, margin: "8px 0" }}>
                                                        <li>{t.platforms.disconnectFlows}</li>
                                                        <li>{t.platforms.disconnectTemplates}</li>
                                                        <li>{t.platforms.disconnectRules}</li>
                                                    </ul>
                                                    <p><strong>{t.platforms.disconnectConfirm}</strong></p>
                                                </div>
                                            }
                                            onConfirm={() => disconnectFacebook(page.page_id)}
                                            okText={t.platforms.disconnectYes}
                                            cancelText={t.platforms.disconnectNo}
                                            okButtonProps={{ danger: true }}
                                        >
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DisconnectOutlined />}
                                            >
                                                {t.platforms.disconnectButton}
                                            </Button>
                                        </Popconfirm>
                                    </Space>
                                </div>
                            ))}

                            {/* Show disabled button when page limit reached */}
                            <Alert
                                message={t.platforms.limitReached}
                                description={t.platforms.limitReachedDesc}
                                type="warning"
                                showIcon
                                icon={<WarningOutlined />}
                                style={{ borderRadius: 12 }}
                            />
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
                                    <Text strong>{t.platforms.noPagesTitle}</Text>
                                    <Text type="secondary" style={{ fontSize: "12px" }}>{t.platforms.noPagesDesc}</Text>
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
                                {t.platforms.connectFacebook}
                            </Button>
                        </div>
                    )}
                </Card>

                <div style={{ textAlign: "center", marginTop: "32px", color: "#94a3b8", fontSize: "13px" }}>
                    {t.platforms.securityNote}
                </div>
            </div>
        </div>
    );
}
