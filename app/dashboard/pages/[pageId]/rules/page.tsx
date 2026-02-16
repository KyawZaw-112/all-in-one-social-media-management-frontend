"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {Button, Table, Input, Select, Switch, message, Space, Form, Modal} from "antd";
import type { ColumnsType } from "antd/es/table";
const { Option } = Select;

interface Rule {
    id: string;
    keyword: string;
    reply_text: string;
    match_type: string | "contains" | "exact";
    enabled: boolean;
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
    const [matchType, setMatchType] = useState("contains");

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Fetch rules
    const fetchRules = async (page = 1) => {
        try {
            setLoading(true);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/rules/${pageId}?page=${page}&limit=${pagination.pageSize}`
            );

            const data = await res.json();

            setRules(data.items);

            setPagination(prev => ({
                ...prev,
                current: page,
                total: data.total,
            }));
        } finally {
            setLoading(false);
        }
    };

    const openEdit = (rule: Rule) => {
        setEditingRule(rule);
        form.setFieldsValue(rule);
        setOpen(true);
    };


    const updateRule = async () => {
        const values = await form.validateFields();

        await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/rules/${editingRule?.id}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }
        );

        setOpen(false);
        fetchRules(pagination.current);
    };




    useEffect(() => {
        if(pageId) fetchRules();
    }, [pageId]);

    // Add rule
    const addRule = async () => {
        if (!keyword || !replyText) {
            message.warning("Please fill all fields");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await fetch(`${backendUrl}/rules`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    page_id: pageId,
                    keyword,
                    reply_text: replyText,
                    match_type: matchType,
                    trigger_type: "messenger",
                }),
            });

            message.success("Rule added");
            setKeyword("");
            setReplyText("");
            fetchRules();
        } catch {
            message.error("Failed to add rule");
        }
    };

    // Delete rule
    const deleteRule = async (id: string) => {
        const oldRules = rules;

        setRules(prev => prev.filter(r => r.id !== id));

        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/rules/${id}`,
                { method: "DELETE" }
            );
        } catch {
            setRules(oldRules);
        }
    };



    // Toggle enable
    const toggleRule = async (rule: Rule) => {
        const updated = { ...rule, enabled: !rule.enabled };

        setRules(prev =>
            prev.map(r => (r.id === rule.id ? updated : r))
        );

        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/rules/${rule.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ enabled: updated.enabled }),
                }
            );
        } catch {
            // rollback
            setRules(prev =>
                prev.map(r => (r.id === rule.id ? rule : r))
            );
        }
    };


    const columns: ColumnsType<Rule> = [
        {
            title: "Keyword",
            dataIndex: "keyword",
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
                    <Button danger onClick={() => deleteRule(record.id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 40 }}>
            <h2>Manage Auto Reply Rules</h2>

            <Space style={{ marginBottom: 20 }}>
                <Input
                    placeholder="Keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />

                <Input
                    placeholder="Reply Text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                />

                <Select
                    value={matchType}
                    onChange={setMatchType}
                    style={{ width: 120 }}
                >
                    <Option value="contains">Contains</Option>
                    <Option value="exact">Exact</Option>
                </Select>

                <Button type="primary" onClick={addRule}>
                    Add Rule
                </Button>
            </Space>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={rules}
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: (page) => fetchRules(page),
                }}
            />

            <Modal
                title="Edit Rule"
                open={open}
                onOk={updateRule}
                onCancel={() => setOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="keyword" label="Keyword" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="reply_text" label="Reply" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item name="match_type" label="Match Type">
                        <Select>
                            <Select.Option value="contains">Contains</Select.Option>
                            <Select.Option value="exact">Exact</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="enabled" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    );
}
