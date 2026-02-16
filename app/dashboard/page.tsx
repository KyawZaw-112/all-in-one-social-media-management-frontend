"use client";

import { useEffect, useState } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Statistic,
    Space,
    Typography,
    Spin,
} from "antd";
import {
    ThunderboltOutlined,
    MessageOutlined,
    SettingOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import supabase from "@/lib/supabase";
import { fetchWithAuth } from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { useRouter } from "next/navigation";

const { Title, Paragraph } = Typography;

interface Stats {
    replies: number;
    platforms: number;
    rules: number;
}

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<Stats>({
        replies: 0,
        platforms: 0,
        rules: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await supabase.auth.getSession();
                const token = data?.session?.access_token;
                if (!token) return;

                const statsData = await fetchWithAuth(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/stats`,
                    token
                ).catch(() => null);

                setStats(
                    statsData || { replies: 0, platforms: 0, rules: 0 }
                );
            } catch (err) {
                console.error("Dashboard error:", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <SubscriptionGuard>
            <AuthGuard>
                <div style={{ padding: 32 }}>
                    <Title level={3}>Automation Dashboard</Title>
                    <Paragraph>
                        Manage your auto replies and connected platforms.
                    </Paragraph>

                    {loading ? (
                        <Spin />
                    ) : (
                        <>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={8}>
                                    <Card hoverable>
                                        <Statistic
                                            title="Auto Replies Sent"
                                            value={stats.replies}
                                            prefix={<MessageOutlined />}
                                        />
                                    </Card>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Card
                                        hoverable
                                        onClick={() =>
                                            router.push("/dashboard/pages")
                                        }
                                    >
                                        <Statistic
                                            title="Rules Created"
                                            value={stats.rules}
                                            prefix={<ThunderboltOutlined />}
                                        />
                                    </Card>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Card
                                        hoverable
                                        onClick={() =>
                                            router.push("/dashboard/platforms")
                                        }
                                    >
                                        <Statistic
                                            title="Platforms Connected"
                                            value={stats.platforms}
                                            prefix={<SettingOutlined />}
                                        />
                                    </Card>
                                </Col>
                            </Row>

                            <Card style={{ marginTop: 24 }}>
                                <Space wrap>
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() =>
                                            router.push("/dashboard/pages")
                                        }
                                    >
                                        Create Rule
                                    </Button>

                                    <Button
                                        icon={<SettingOutlined />}
                                        onClick={() =>
                                            router.push(
                                                "/dashboard/platforms"
                                            )
                                        }
                                    >
                                        Manage Platforms
                                    </Button>
                                </Space>
                            </Card>
                        </>
                    )}
                </div>
            </AuthGuard>
        </SubscriptionGuard>
    );
}
