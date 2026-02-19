"use client";

import React from "react";
import { Card, Button, Typography, Space, Tag } from "antd";
import { LockOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useSubscription } from "@/hooks/useSubscription";

const { Text } = Typography;

export default function SubscriptionGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const { loading, status } = useSubscription();

    if (loading) {
        return null;
    }

    if (status === "active") {
        return <>{children}</>;
    }

    const isExpired = status === "expired";

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-6">
            <Card size="small" style={{ width: 380 }}>
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                    <Space>
                        {isExpired ? (
                            <ClockCircleOutlined style={{ color: "#faad14" }} />
                        ) : (
                            <LockOutlined style={{ color: "#ff4d4f" }} />
                        )}

                        <Text strong>
                            {isExpired
                                ? "Subscription expired"
                                : "Subscription required"}
                        </Text>
                    </Space>

                    <Tag color={isExpired ? "gold" : "red"}>
                        {isExpired ? "Expired" : "Inactive"}
                    </Tag>

                    <Text type="secondary">
                        {isExpired
                            ? "Your subscription has expired. Please renew to continue."
                            : "An active subscription is required to access this feature."}
                    </Text>

                    <Button type="primary" block href="/subscribe/manual">
                        Subscribe / Renew (Manual)
                    </Button>

                    <Button block href="/subscribe">
                        View Plan Details
                    </Button>

                    <Button block href="/">
                        Home
                    </Button>
                </Space>
            </Card>
        </div>
    );
}
