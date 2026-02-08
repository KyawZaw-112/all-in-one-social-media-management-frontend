"use client";

import Link from "next/link";
import { Layout, Button, Space, Typography } from "antd";

const { Header } = Layout;
const { Text } = Typography;

export default function LandingNavbar() {
    return (
        <Header
            style={{
                background: "#fff",
                borderBottom: "1px solid #f0f0f0",
                padding: "0 24px",
                height: 56,
                lineHeight: "56px",
            }}
        >
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {/* Logo */}
                <Text strong style={{ fontSize: 18 }}>
                    🚀 PostNow
                </Text>

                {/* Right actions */}
                <Space>
                    <Link href="/login">
                        <Button type="text">Login</Button>
                    </Link>

                    <Link href="/subscribe">
                        <Button type="primary">Get Started</Button>
                    </Link>
                </Space>
            </div>
        </Header>
    );
}
