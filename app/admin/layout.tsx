"use client";

import { useState, useEffect } from "react";
import { Layout, Menu, Button, Avatar, Space, Typography, ConfigProvider, theme } from "antd";
import {
    DashboardOutlined,
    UserOutlined,
    CreditCardOutlined,
    SettingOutlined,
    LogoutOutlined,
    RocketOutlined,
    LineChartOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    NotificationOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        { key: "/admin/dashboard", icon: <DashboardOutlined />, label: "Stats Overview" },
        { key: "/admin/users", icon: <UserOutlined />, label: "Merchant Management" },
        { key: "/admin/subscriptions", icon: <CreditCardOutlined />, label: "Active Subscriptions" },
        { key: "/admin/analytics", icon: <LineChartOutlined />, label: "System Health" },
        { key: "/admin/settings", icon: <SettingOutlined />, label: "Global Settings" },
    ];

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#722ed1", // Premium Purple theme for Admin
                    borderRadius: 12,
                },
                algorithm: theme.defaultAlgorithm,
            }}
        >
            <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    breakpoint="lg"
                    onBreakpoint={(broken) => setCollapsed(broken)}
                    style={{
                        background: "#001529",
                        boxShadow: "4px 0 10px rgba(0,0,0,0.1)",
                        zIndex: 101,
                        position: "sticky",
                        left: 0,
                        top: 0,
                        height: "100vh"
                    }}
                >
                    <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                        <RocketOutlined style={{ fontSize: 28, color: "#9254de" }} />
                        {!collapsed && <Title level={4} style={{ color: "white", margin: "0 0 0 12px", fontSize: 18, fontWeight: 700, letterSpacing: "1px" }}>SAAS ADMIN</Title>}
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[pathname]}
                        items={menuItems}
                        onClick={({ key }) => router.push(key)}
                        style={{ background: "transparent", marginTop: 16 }}
                    />
                    <div style={{ position: "absolute", bottom: 20, width: "100%", padding: "0 16px" }}>
                        <Button
                            danger
                            type="text"
                            icon={<LogoutOutlined />}
                            block
                            onClick={() => router.push("/login")}
                            style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start" }}
                        >
                            {!collapsed && "Logout"}
                        </Button>
                    </div>
                </Sider>
                <Layout>
                    <Header style={{
                        padding: "0 24px",
                        background: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(10px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        position: "sticky",
                        top: 0,
                        zIndex: 100,
                        width: "100%"
                    }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ fontSize: "18px" }}
                        />
                        <Space size={20}>
                            <Button type="text" icon={<NotificationOutlined style={{ fontSize: 20 }} />} />
                            <Divider type="vertical" />
                            <Space size={12} style={{ cursor: "pointer" }}>
                                <div style={{ textAlign: "right", lineHeight: "1.2" }}>
                                    <Text strong style={{ color: "#333", display: "block" }}>Zayar Lwin</Text>
                                    <Text type="secondary" style={{ fontSize: "11px", display: "block" }}>Owner Account</Text>
                                </div>
                                <Avatar size={40} style={{ backgroundColor: "#722ed1", color: "white", fontSize: 18 }}>Z</Avatar>
                            </Space>
                        </Space>
                    </Header>
                    <Content style={{ padding: "32px", minHeight: "calc(100vh - 64px)" }}>
                        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                            {children}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
}

function Divider({ type }: { type: string }) {
    return <div style={{ width: type === "vertical" ? "1px" : "100%", height: type === "vertical" ? "20px" : "1px", background: "#e8e8e8", margin: "0 12px" }} />
}
