"use client";

import React from "react";
import { Card, Button, Typography, Space, Tag } from "antd";
import {
    LockOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { useSubscription } from "@/hooks/useSubscription";

const { Text } = Typography;

export default function SubscriptionGuard({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    const { loading, active, subscription } = useSubscription();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <Card size="small" style={{ width: 360 }}>
                    <Text type="secondary">Checking subscription…</Text>
                </Card>
            </div>
        );
    }

    if (active) {
        return <>{children}</>;
    }

    const isPending = subscription?.status === "pending";

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-10 w-full bg-red-500">
            <Card
                size="small"
                variant={"outlined"}
                style={{ width: 380 }}
            >
                <Space orientation="vertical" size={12} style={{ width: "100%" }}>
                    {/* Header */}
                    <Space>
                        {isPending ? (
                            <ClockCircleOutlined style={{ color: "#faad14" }} />
                        ) : (
                            <LockOutlined style={{ color: "#ff4d4f" }} />
                        )}

                        <Text strong>
                            {isPending
                                ? "Payment under review"
                                : "Subscription required"}
                        </Text>
                    </Space>

                    {/* Status */}
                    <Tag color={isPending ? "gold" : "red"}>
                        {isPending ? "Pending approval" : "Inactive"}
                    </Tag>

                    {/* Message */}
                    <Text type="secondary">
                        {isPending
                            ? "Your payment is being reviewed by an admin. Access will be enabled once approved."
                            : "An active subscription is required to access this feature."}
                    </Text>

                    {/* CTA */}
                    {!isPending && (
                        <Button
                            type="primary"
                            block
                            href="/subscribe"
                        >
                            View pricing
                        </Button>
                    )}
                </Space>
            </Card>
        </div>
    );
}
