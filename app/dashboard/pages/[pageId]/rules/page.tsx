"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Button,
    Table,
    Input,
    Select,
    Switch,
    message,
    Space,
    Form,
    Modal,
    InputNumber,
} from "antd";
import type { ColumnsType } from "antd/es/table";

const { Option } = Select;

interface Rule {
    id: string;
    keyword: string | null;
    reply_text: string;
    match_type: "contains" | "exact" | "fallback";
    enabled: boolean;
    priority: number;
}

export default function PageRules() {
    const params = useParams();
    const pageId = params.pageId as string;

    const [rules, setRules] = useState<Rule[]>([]);
    const [loading, setLoading] = useState(false);

    const [editingRule, setEditingRule] = useState<Rule | null>(null);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    const [keyword, setKeyword] = useState("");
    const [replyText, setReplyText] = useState("");
    const [matchType, setMatchType] =
        useState<"contains" | "exact" | "fallback">("contains");
    const [priority, setPriority] = useState(1);

    const backendUrl = process.env.NEXT_PUBLIC_API_URL;

    // Fetch Rules
    const fetchRules = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${backendUrl}/api/rules/${pageId}`);
            const data = await res.json();
            setRules(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (pageId) fetchRules();
    }, [pageId]);

    // Add Rule
    const addRule = async () => {
        if (!replyText) {
            message.warning("Reply text required");
            return;
        }

        if (matchType !== "fallback" && !keyword) {
            message.warning("Keyword required");
            return;
        }

        if (matchType === "fallback") {
            const fallbackExists = rules.some(
                (r) => r.match_type === "fallback"
            );
            if (fallbackExists) {
                message.error("Only one fallback rule allowed per page");
                return;
            }
        }

        await fetch(`${backendUrl}/api/rules`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                page_id: pageId,
                keyword: matchType === "fallback" ? null : keyword,
                reply_text: replyText,
                match_type: matchType,
                priority: matchType === "fallback" ? 9999 : priority,
            }),
        });

        message.success("Rule added");

        setKeyword("");
        setReplyText("");
        setPriority(1);
        setMatchType("contains");

        fetchRules();
    };

    // Delete Rule
    const deleteRule = async (id: string) => {
        await fetch(`${backendUrl}/api/rules/${id}`, {
            method: "DELETE",
        });

        fetchRules();
    };

    // Toggle Enable
    const toggleRule = async (rule: Rule) => {
        await fetch(`${backendUrl}/api/rules/${rule.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ enabled: !rule.enabled }),
        });

        fetchRules();
    };

    // Edit
    const openEdit = (rule: Rule) => {
        setEditingRule(rule);
        form.setFieldsValue(rule);
        setOpen(true);
    };

    const updateRule = async () => {
        const values = await form.validateFields();

        await fetch(`${backendUrl}/api/rules/${editingRule?.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });

        setOpen(false);
        fetchRules();
    };

    const columns: ColumnsType<Rule> = [
        {
            title: "Keyword",
            render: (_, record) =>
                record.match_type === "fallback"
                    ? "-"
                    : record.keyword,
        },
        {
            title: "Reply",
            dataIndex: "reply_text",
        },
        {
            title: "Match Type",
            dataIndex: "match_type",
        },
        {
            title: "Priority",
            dataIndex: "priority",
        },
        {
            title: "Enabled",
            render: (_, record) => (
                <Switch
                    checked={record.enabled}
                    onChange={() => toggleRule(record)}
                />
            ),
        },
        {
            title: "Action",
            render: (_, record) => (
                <Space>
                    <Button onClick={() => openEdit(record)}>Edit</Button>
                    <Button
                        danger
                        onClick={() => deleteRule(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 40 }}>
            <h2>Manage Auto Reply Rules</h2>

            <Space style={{ marginBottom: 20 }} wrap>
                {matchType !== "fallback" && (
                    <Input
                        placeholder="Keyword"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        style={{ width: 200 }}
                    />
                )}

                <Input
                    placeholder="Reply Text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    style={{ width: 250 }}
                />

                <Select
                    value={matchType}
                    onChange={(value) => {
                        setMatchType(value);
                        if (value === "fallback") {
                            setKeyword("");
                        }
                    }}
                    style={{ width: 140 }}
                >
                    <Option value="contains">Contains</Option>
                    <Option value="exact">Exact</Option>
                    <Option value="fallback">Fallback</Option>
                </Select>

                <InputNumber
                    min={1}
                    value={priority}
                    onChange={(value) => setPriority(value || 1)}
                    placeholder="Priority"
                />

                <Button type="primary" onClick={addRule}>
                    Add Rule
                </Button>
            </Space>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={rules}
                loading={loading}
            />

            <Modal
                title="Edit Rule"
                open={open}
                onOk={updateRule}
                onCancel={() => setOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="keyword" label="Keyword">
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="reply_text"
                        label="Reply"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item name="match_type" label="Match Type">
                        <Select>
                            <Option value="contains">Contains</Option>
                            <Option value="exact">Exact</Option>
                            <Option value="fallback">Fallback</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="priority" label="Priority">
                        <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        name="enabled"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
