"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { createCheckoutSession } from "@/lib/api";

import {
    Card,
    Button,
    Typography,
    Badge,
    Segmented,
    List,
    Space, Table,
} from "antd";
import {
    CheckCircleOutlined,
    StarFilled,
} from "@ant-design/icons";
import LandingNavbar from "@/components/LandingNavbar";

const { Title, Text } = Typography;

export default function SubscribePage() {
    const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");
    const [loading, setLoading] = useState(false);

    const subscribe = async () => {
        setLoading(true);

        const {
            data: { session },
        } = await supabase.auth.getSession();

        const token = session?.access_token || "";

        try {
            const { url } = await createCheckoutSession(token, plan);
            window.location.href = url;
        } catch {
            alert("Failed to start checkout");
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Feature",
            dataIndex: "feature",
            key: "feature",
            render: (text: string) => (
                <Space>
                    <CheckCircleOutlined style={{ color: "#52c41a" }} />
                    <Text>{text}</Text>
                </Space>
            ),
        },
    ];

    const data = [
        { id: "1", feature: "Post to all platforms in one click" },
        { id: "2", feature: "Facebook auto-reply automation" },
        { id: "3", feature: "Content scheduling" },
        { id: "4", feature: "Analytics dashboard" },
        { id: "5", feature: "Priority support" },
    ];

    return (
        <>
            <LandingNavbar />
        <div
            style={{
                minHeight: "100vh",
                background: "#fafafa",
                padding: "64px 16px",
            }}
        >
            <div style={{ maxWidth: 960, margin: "0 auto" }}>
                {/* Header */}
                <Space orientation="vertical" size={12} style={{ width: "100%", textAlign: "center" }}>
                    <Title level={2}>Simple, transparent pricing</Title>
                    <Text type="secondary">
                        One plan. All premium features. Cancel anytime.
                    </Text>

                    {/* Toggle */}
                    <Segmented
                        value={plan}
                        onChange={(value) => setPlan(value as "monthly" | "yearly")}
                        options={[
                            { label: "Monthly", value: "monthly" },
                            {
                                label: (
                                    <span>
                    Yearly <Badge count="Save 20%" />
                  </span>
                                ),
                                value: "yearly",
                            },
                        ]}
                        style={{ marginTop: 16 }}
                    />
                </Space>

                {/* Pricing Card */}
                <div style={{ maxWidth: 420, margin: "48px auto 0" }}>
                    <Badge.Ribbon
                        text={
                        <>
                        <StarFilled/>
                        </>
                        }
                        color="gold"
                    >
                        <Card variant={"outlined"}>
                            <Space orientation="vertical" size={24} style={{ width: "100%" }}>
                                {/* Plan */}
                                <div>
                                    <Title level={4} style={{ marginBottom: 8 }}>
                                        PostNow Pro
                                    </Title>

                                    <Space align="baseline">
                                        <Title level={2} style={{ margin: 0 }}>
                                            {plan === "monthly" ? "$29" : "$290"}
                                        </Title>
                                        <Text type="secondary">
                                            / {plan === "monthly" ? "month" : "year"}
                                        </Text>
                                    </Space>
                                </div>

                                {/* Features */}
                                <Table
                                    dataSource={data}
                                    columns={columns}
                                    rowKey="id"
                                    pagination={false}
                                    showHeader={false}
                                />
                                {/* CTA */}
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    loading={loading}
                                    onClick={subscribe}
                                >
                                    {loading ? "Redirecting…" : "Subscribe now"}
                                </Button>

                                <Text type="secondary" style={{ textAlign: "center", fontSize: 12 }}>
                                    Secure payment · Instant access after checkout
                                </Text>
                            </Space>
                        </Card>
                    </Badge.Ribbon>
                </div>
            </div>
        </div>
        </>
    );
}
