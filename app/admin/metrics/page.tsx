"use client";

import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import  supabase  from "@/lib/supabase";
import { getAdminUsers } from "@/lib/api";
import { Card, Row, Col, Typography } from "antd";
const { Title, Text } = Typography;

type UserMetrics = {
    totalUsers?: number;
    activeUsers?: number;
    subscribedUsers?: number;
    churnedUsers?: number;
    users?: number;
    revenue?: number;
};



const metricsToShow: Array<{ key: keyof UserMetrics; label: string }> = [
    { key: "totalUsers", label: "Total Users" },
    { key: "activeUsers", label: "Active Users" },
    { key: "subscribedUsers", label: "Subscribed Users" },
    { key: "churnedUsers", label: "Churned Users" },
    { key: "users", label: "Users" },
    { key: "revenue", label: "Revenue" },
];

export default function AdminMetricsPage() {
    const [metrics, setMetrics] = useState<UserMetrics | null>(null);
    const [loading, setLoading] = useState(false);

    const getSessionToken = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        return session?.access_token;
    };

    const loadMetrics = useCallback(async () => {
        try {
            setLoading(true);
            const token = await getSessionToken();
            if (!token) {
                message.error("Not authenticated");
                return;
            }

            const data = await getAdminUsers(token);
            setMetrics(data ?? {});
        } catch {
            message.error("Failed to load user metrics");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMetrics();
    }, [loadMetrics]);

    return (
        <div style={{ padding: 40, background: "#fafafa", minHeight: "100vh" }}>
            <Title level={2} style={{ marginBottom: 40 }}>
                User Metrics
            </Title>

            <Row gutter={[24, 24]}>
                {metricsToShow.map((item) => (
                    <Col xs={24} sm={12} md={6} key={item.label}>
                        <Card
                            variant="outlined"
                            style={{
                                background: "#ffffff",
                                padding: 24,
                            }}
                        >
                            <Text type="secondary">{item.label}</Text>
                            <Title level={2} style={{ marginTop: 8 }}>
                                {metrics ? metrics[item.key] ?? 0 : 0}
                            </Title>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
