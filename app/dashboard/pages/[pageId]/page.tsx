"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Card,
    Input,
    Button,
    Select,
    Typography,
    Switch,
    Space,
    Empty,
} from "antd";
import supabase from "@/lib/supabase";
import { fetchWithAuth } from "@/lib/api";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function PageRules() {
    const { pageId } = useParams();
    const [rules, setRules] = useState<any[]>([]);
    const [keyword, setKeyword] = useState("");
    const [replyText, setReplyText] = useState("");
    const [matchType, setMatchType] = useState("contains");

    async function getToken() {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        return session?.access_token;
    }

    async function loadRules() {
        const token = await getToken();
        if (!token) return;

        const data = await fetchWithAuth(`rules/${pageId}`, token);
        setRules(data || []);
    }

    async function createRule() {
        const token = await getToken();
        if (!token) return;

        const newRule = await fetchWithAuth("rules", token, {
            method: "POST",
            body: JSON.stringify({
                page_id: pageId,
                keyword,
                reply_text: replyText,
                match_type: matchType,
            }),
        });

        setRules((prev) => [...prev, newRule]);
        setKeyword("");
        setReplyText("");
    }

    useEffect(() => {
        if (pageId) loadRules();
    }, [pageId]);

    return (
        <div style={{ padding: 16, maxWidth: 480, margin: "0 auto" }}>
            <Title level={3} style={{ marginBottom: 24 }}>
                Auto Reply Rules
            </Title>

            {/* Create Rule */}
            <Card
                style={{ marginBottom: 24, borderRadius: 16 }}
                bodyStyle={{ padding: 20 }}
            >
                <Space direction="vertical" style={{ width: "100%" }} size="middle">
                    <Input
                        placeholder="Keyword"
                        size="large"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />

                    <Select
                        size="large"
                        value={matchType}
                        onChange={setMatchType}
                        options={[
                            { value: "contains", label: "Contains" },
                            { value: "exact", label: "Exact Match" },
                            { value: "starts_with", label: "Starts With" },
                            { value: "fallback", label: "Fallback" },
                        ]}
                    />

                    <TextArea
                        rows={4}
                        placeholder="Reply message"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />

                    <Button
                        type="primary"
                        size="large"
                        block
                        style={{ borderRadius: 12 }}
                        onClick={createRule}
                    >
                        Add Rule
                    </Button>
                </Space>
            </Card>

            {/* Rules List */}
            {rules.length === 0 ? (
                <Empty description="No rules yet" />
            ) : (
                rules.map((rule) => (
                    <Card
                        key={rule.id}
                        style={{ marginBottom: 16, borderRadius: 16 }}
                        bodyStyle={{ padding: 18 }}
                    >
                        <Text strong>{rule.keyword}</Text>
                        <div style={{ marginTop: 4 }}>
                            <Text type="secondary">{rule.match_type}</Text>
                        </div>

                        <div style={{ marginTop: 12 }}>{rule.reply_text}</div>

                        <div style={{ marginTop: 16 }}>
                            <Switch checked={rule.enabled} />
                        </div>
                    </Card>
                ))
            )}
        </div>
    );
}
