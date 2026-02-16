"use client";

import { useEffect, useState } from "react";
import {
    Card,
    Row,
    Col,
    Typography,
    Spin,
    Empty,
    Tag,
} from "antd";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";
import supabase from "@/lib/supabase";

const { Title, Text } = Typography;

interface PageItem {
    id: string;
    name: string;
    ruleCount: number;
}

export default function PagesListPage() {
    const router = useRouter();
    const [pages, setPages] = useState<PageItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPages = async () => {
            try {
                const { data } = await supabase.auth.getSession();
                const token = data?.session?.access_token;
                if (!token) return;

                const result = await fetchWithAuth(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/platforms`,
                    token
                );

                setPages(result || []);
            } catch (err) {
                console.error("Failed to load pages:", err);
            } finally {
                setLoading(false);
            }
        };

        loadPages();
    }, []);

    console.log(pages)

    return (
        <div style={{ padding: 32 }}>
            <Title level={3}>Connected Pages</Title>
            <Text type="secondary">
                Select a page to manage its automation rules.
            </Text>

            {loading ? (
                <div style={{ marginTop: 40 }}>
                    <Spin />
                </div>
            ) : pages.length === 0 ? (
                <div style={{ marginTop: 40 }}>
                    <Empty description="No connected pages yet" />
                </div>
            ) : (
                <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                    {pages.map((page) => (
                        <Col xs={24} md={12} lg={8} key={page.id}>
                            <Card
                                hoverable
                                onClick={() =>
                                    router.push(`/dashboard/pages/${page.id}/rules`)
                                }
                            >
                                <Title level={5}>{page.name}</Title>
                                <Tag color="blue">
                                    {page.ruleCount || 0} Rules
                                </Tag>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}
