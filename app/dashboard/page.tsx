"use client";

import { useEffect, useState } from "react";
import { Card, Row, Col, Button, Statistic, Table } from "antd";
import { RocketOutlined, FacebookOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { supabase } from "@/lib/supabase";
import { fetchWithAuth } from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardPage() {
    const [stats, setStats] = useState<any>({});
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            const { data } = await supabase.auth.getSession();
            const token = data?.session?.access_token!;
            setStats(await fetchWithAuth("/posts/stats", token));
            setPosts(await fetchWithAuth("/posts/recent", token));
        };
        load();
    }, []);

    return (
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
    );
}
