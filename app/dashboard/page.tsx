"use client";

import { useEffect, useState } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Statistic,
    Table,
    Tag,
    Space,
    Typography,
    Spin,
    Empty,
} from "antd";
import {
    RocketOutlined,
    FacebookOutlined,
    ThunderboltOutlined,
    PlusOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import supabase from "@/lib/supabase";
import { fetchWithAuth } from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";
import SubscriptionGuard from "@/components/SubscriptionGuard";

const { Title } = Typography;

interface Stats {
    posts: number;
    replies: number;
    platforms: number;
}

interface Post {
    id: string;
    content: string;
    platform: string;
    status: "published" | "scheduled" | "failed";
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats>({
        posts: 0,
        replies: 0,
        platforms: 0,
    });
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await supabase.auth.getSession();
                const token = data?.session?.access_token;
                if (!token) return;

                const [statsData, postsData] = await Promise.all([
                    fetchWithAuth("/api/posts/stats", token).catch(() => null),
                    fetchWithAuth("/api/posts/recent", token).catch(() => []),
                ]);

                setStats(statsData || { posts: 0, replies: 0, platforms: 0 });
                setPosts(postsData || []);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const statusTag = (status: string) => {
        switch (status) {
            case "published":
                return <Tag color="green">Published</Tag>;
            case "scheduled":
                return <Tag color="blue">Scheduled</Tag>;
            case "failed":
                return <Tag color="red">Failed</Tag>;
            default:
                return <Tag>Unknown</Tag>;
        }
    };

    return (
        <SubscriptionGuard>
            <AuthGuard>
                <div style={{ padding: 32 }}>
                    <Title level={3} style={{ marginBottom: 24 }}>
                        Dashboard Overview
                    </Title>

                    {loading ? (
                        <Spin />
                    ) : (
                        <>
                            {/* KPI Section */}
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={8}>
                                    <Card hoverable>
                                        <Statistic
                                            title="Posts Published"
                                            value={stats.posts}
                                            prefix={<RocketOutlined />}
                                        />
                                    </Card>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Card hoverable>
                                        <Statistic
                                            title="Auto Replies Sent"
                                            value={stats.replies}
                                            prefix={<FacebookOutlined />}
                                        />
                                    </Card>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Card hoverable>
                                        <Statistic
                                            title="Platforms Connected"
                                            value={stats.platforms}
                                            prefix={<ThunderboltOutlined />}
                                        />
                                    </Card>
                                </Col>
                            </Row>

                            {/* Quick Actions */}
                            <Card style={{ marginTop: 24 }}>
                                <Space wrap>
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        href="/post-now"
                                    >
                                        Create Post
                                    </Button>

                                    <Button
                                        icon={<SettingOutlined />}
                                        href="/dashboard/platforms"
                                    >
                                        Manage Platforms
                                    </Button>
                                </Space>
                            </Card>

                            {/* Recent Posts */}
                            <Card
                                title="Recent Posts"
                                style={{ marginTop: 24 }}
                            >
                                {posts.length === 0 ? (
                                    <Empty description="No posts yet" />
                                ) : (
                                    <Table
                                        dataSource={posts}
                                        rowKey="id"
                                        pagination={false}
                                        columns={[
                                            {
                                                title: "Content",
                                                dataIndex: "content",
                                                ellipsis: true,
                                            },
                                            {
                                                title: "Platform",
                                                dataIndex: "platform",
                                            },
                                            {
                                                title: "Status",
                                                render: (_, record) =>
                                                    statusTag(record.status),
                                            },
                                        ]}
                                    />
                                )}
                            </Card>
                        </>
                    )}
                </div>
            </AuthGuard>
        </SubscriptionGuard>
    );
}
