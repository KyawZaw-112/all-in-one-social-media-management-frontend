"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    HomeOutlined,
    AppstoreOutlined,
    BarChartOutlined,
    UserOutlined,
    ShopOutlined,
    CarOutlined,
    ThunderboltOutlined,
    MessageOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import { Card, Badge } from "antd";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("home");
    const [stats, setStats] = useState({
        totalFlows: 0,
        activeFlows: 0,
        totalConversations: 0,
        completedOrders: 0,
    });

    const tabs = [
        { key: "home", icon: <HomeOutlined />, label: "Home" },
        { key: "automation", icon: <AppstoreOutlined />, label: "Auto-Reply" },
        { key: "stats", icon: <BarChartOutlined />, label: "Stats" },
        { key: "profile", icon: <UserOutlined />, label: "Profile" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "home":
                return <HomeContent stats={stats} />;
            case "automation":
                router.push("/automation/facebook");
                return null;
            case "stats":
                return <StatsContent />;
            case "profile":
                return <ProfileContent />;
            default:
                return <HomeContent stats={stats} />;
        }
    };

    return (
        <AuthGuard>
            <div
                style={{
                    minHeight: "100vh",
                    paddingBottom: 70,
                    background: "#f0f2f5",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        padding: "20px",
                        color: "white",
                        position: "sticky",
                        top: 0,
                        zIndex: 100,
                    }}
                >
                    <h2 style={{ margin: 0, color: "white" }}>🤖 Dashboard</h2>
                    <p style={{ margin: "4px 0 0", opacity: 0.9, fontSize: 14 }}>
                        Welcome back!
                    </p>
                </div>

                {/* Content */}
                <div style={{ padding: 20 }}>{renderContent()}</div>

                {/* Bottom Navigation */}
                <div
                    style={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "white",
                        borderTop: "1px solid #e8e8e8",
                        display: "flex",
                        justifyContent: "space-around",
                        padding: "8px 0",
                        boxShadow: "0 -2px 8px rgba(0,0,0,0.08)",
                        zIndex: 1000,
                    }}
                >
                    {tabs.map((tab) => (
                        <div
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                flex: 1,
                                textAlign: "center",
                                cursor: "pointer",
                                color: activeTab === tab.key ? "#1890ff" : "#666",
                                transition: "all 0.3s",
                            }}
                        >
                            <div style={{ fontSize: 24, marginBottom: 4 }}>
                                {tab.icon}
                            </div>
                            <div style={{ fontSize: 12 }}>{tab.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthGuard>
    );
}

function HomeContent({ stats }: any) {
    return (
        <div>
            {/* Quick Stats */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 12,
                    marginBottom: 20,
                }}
            >
                <Card style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 32, color: "#1890ff", marginBottom: 8 }}>
                        <ThunderboltOutlined />
                    </div>
                    <div style={{ fontSize: 24, fontWeight: "bold" }}>
                        {stats.activeFlows}
                    </div>
                    <div style={{ fontSize: 12, color: "#666" }}>Active Flows</div>
                </Card>

                <Card style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 32, color: "#52c41a", marginBottom: 8 }}>
                        <MessageOutlined />
                    </div>
                    <div style={{ fontSize: 24, fontWeight: "bold" }}>
                        {stats.totalConversations}
                    </div>
                    <div style={{ fontSize: 12, color: "#666" }}>Conversations</div>
                </Card>

                <Card style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 32, color: "#722ed1", marginBottom: 8 }}>
                        <CheckCircleOutlined />
                    </div>
                    <div style={{ fontSize: 24, fontWeight: "bold" }}>
                        {stats.completedOrders}
                    </div>
                    <div style={{ fontSize: 12, color: "#666" }}>Completed</div>
                </Card>

                <Card style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 32, color: "#fa8c16", marginBottom: 8 }}>
                        <AppstoreOutlined />
                    </div>
                    <div style={{ fontSize: 24, fontWeight: "bold" }}>
                        {stats.totalFlows}
                    </div>
                    <div style={{ fontSize: 12, color: "#666" }}>Total Flows</div>
                </Card>
            </div>

            {/* Quick Actions */}
            <h3 style={{ marginTop: 30, marginBottom: 16 }}>⚡ Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Card
                    hoverable
                    onClick={() => (window.location.href = "/automation/facebook")}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: "50%",
                                background: "#e6f7ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 24,
                            }}
                        >
                            <ThunderboltOutlined style={{ color: "#1890ff" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0 }}>Create New Flow</h4>
                            <p style={{ margin: "4px 0 0", color: "#666", fontSize: 12 }}>
                                Setup auto-reply automation
                            </p>
                        </div>
                    </div>
                </Card>

                <Card hoverable>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: "50%",
                                background: "#f6ffed",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 24,
                            }}
                        >
                            <MessageOutlined style={{ color: "#52c41a" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0 }}>View Conversations</h4>
                            <p style={{ margin: "4px 0 0", color: "#666", fontSize: 12 }}>
                                Check customer messages
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Business Type */}
            <h3 style={{ marginTop: 30, marginBottom: 16 }}>🏪 Your Business</h3>
            <Card>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <ShopOutlined style={{ fontSize: 40, color: "#1890ff" }} />
                    <div>
                        <h3 style={{ margin: 0 }}>Online Shop Plan</h3>
                        <p style={{ margin: "4px 0", color: "#666" }}>15,000 Ks/month</p>
                        <Badge status="success" text="Active" />
                    </div>
                </div>
            </Card>
        </div>
    );
}

function StatsContent() {
    return (
        <div>
            <h3>📊 Statistics</h3>
            <p style={{ color: "#666" }}>Detailed analytics coming soon...</p>
        </div>
    );
}

function ProfileContent() {
    return (
        <div>
            <h3>👤 Profile</h3>
            <Card>
                <p><strong>Email:</strong> user@example.com</p>
                <p><strong>Plan:</strong> Online Shop</p>
                <p><strong>Status:</strong> <Badge status="success" text="Active" /></p>
            </Card>
        </div>
    );
}
