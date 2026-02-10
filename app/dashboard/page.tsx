"use client";

import { useEffect, useState } from "react";
import { Card, Row, Col, Button, Statistic, Table } from "antd";
import { RocketOutlined, FacebookOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { supabase } from "@/lib/supabase";
import { fetchWithAuth } from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";
import SubscriptionGuard from "@/components/SubscriptionGuard";

export default function DashboardPage() {
    const [stats, setStats] = useState<any>({});
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await supabase.auth.getSession();
                const token = data?.session?.access_token!;

                try {
                    const statsData = await fetchWithAuth("/api/posts/stats", token);
                    setStats(statsData || {});
                } catch (error) {
                    console.error("Failed to load stats:", error);
                    setStats({ posts: 0, replies: 0, platforms: 0 });
                }

                try {
                    const postsData = await fetchWithAuth("/api/posts/recent", token);
                    setPosts(postsData || []);
                } catch (error) {
                    console.error("Failed to load posts:", error);
                    setPosts([]);
                }
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            }
        };
        load();
    }, []);

    return (
        <SubscriptionGuard>
        <AuthGuard>
            <div style={{ padding: 24 }}>
                {/* KPI */}
                <Row gutter={16}>
                    <Col xs={24} md={8}>
                        <Card>
                            <Statistic title="Posts published" value={stats.posts || 0} prefix={<RocketOutlined />} />
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card>
                            <Statistic title="Auto replies sent" value={stats.replies || 0} prefix={<FacebookOutlined />} />
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card>
                            <Statistic title="Platforms connected" value={stats.platforms || 0} prefix={<ThunderboltOutlined />} />
                        </Card>
                    </Col>
                </Row>

                {/* Quick Action */}
                <Card style={{ marginTop: 24 }}>
                    <Button type="primary" href="/post-now">
                        Create Post
                    </Button>
                </Card>

                {/* Recent Activity */}
                <Card title="Recent posts" style={{ marginTop: 24 }}>
                    <Table
                        dataSource={posts}
                        rowKey="id"
                        pagination={false}
                        columns={[
                            { title: "Content", dataIndex: "content" },
                            { title: "Platform", dataIndex: "platform" },
                            { title: "Status", dataIndex: "status" },
                        ]}
                    />
                </Card>
            </div>
        </AuthGuard>
        </SubscriptionGuard>
    );
}
