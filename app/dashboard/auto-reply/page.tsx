'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { Button, Modal, Form, Input, Tabs, Table, Space, message, Empty, Spin, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface Template {
    id: string;
    name: string;
    reply_text: string;
    trigger_keywords: string[];
    is_active: boolean;
}

interface Rule {
    id: string;
    name: string;
    template_id: string;
    condition: string;
    enabled: boolean;
    priority: number;
    template: Template;
}

interface Stats {
    plan: {
        name: string;
        status: string;
    };
    limits: {
        message_limit: string;
        template_limit: string;
        channels: string[];
    };
    usage: {
        messages_total: number;
        templates_total: number;
    };
    breakdown: {
        by_status: Record<string, number>;
        by_channel: Record<string, number>;
    };
}

interface TemplateFormValues {
    name: string;
    reply_text: string;
    trigger_keywords?: string;
}

interface RuleFormValues {
    name: string;
    template_id: string;
    priority: number;
    enabled: boolean;
}

export default function AutoReplyPage() {
    const { token } = useAuth();

    const [templates, setTemplates] = useState<Template[]>([]);
    const [rules, setRules] = useState<Rule[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(false);
    const [templateModalVisible, setTemplateModalVisible] = useState(false);
    const [ruleModalVisible, setRuleModalVisible] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [editingRule, setEditingRule] = useState<Rule | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const accessToken = localStorage.getItem('accessToken') || token;

            const [templatesRes, rulesRes, statsRes] = await Promise.all([
                axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/auto-reply/templates`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }),
                axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/auto-reply/rules`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }),
                axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/auto-reply/stats`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }),
            ]);

            setTemplates(templatesRes.data.data || []);
            setRules(rulesRes.data.data || []);
            setStats(statsRes.data.data);
        } catch (error: unknown) {
            message.error('Failed to fetch data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTemplate = async (values: TemplateFormValues) => {
        try {
            const accessToken = localStorage.getItem('accessToken') || token;
            const keywords = values.trigger_keywords
                ? values.trigger_keywords.split(',').map((k: string) => k.trim())
                : [];

            if (editingTemplate) {
                await axios.put(
                    `/api/auto-reply/templates/${editingTemplate.id}`,
                    {
                        ...values,
                        trigger_keywords: keywords,
                    },
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                message.success('Template updated');
            } else {
                await axios.post(
                    '/api/auto-reply/templates',
                    {
                        ...values,
                        trigger_keywords: keywords,
                    },
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                message.success('Template created');
            }

            setTemplateModalVisible(false);
            setEditingTemplate(null);
            form.resetFields();
            fetchData();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                message.error(error.response?.data?.error || 'Failed to save template');
            } else {
                message.error('Failed to save template');
            }
        }
    };

    const handleDeleteTemplate = async (id: string) => {
        Modal.confirm({
            title: 'Delete Template',
            content: 'Are you sure you want to delete this template?',
            okText: 'Yes',
            cancelText: 'No',
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    const accessToken = localStorage.getItem('accessToken') || token;
                    await axios.delete(`/api/auto-reply/templates/${id}`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                    message.success('Template deleted');
                    fetchData();
                } catch (error: unknown) {
                    message.error('Failed to delete template');
                }
            },
        });
    };

    const handleCreateRule = async (values: RuleFormValues) => {
        try {
            const accessToken = localStorage.getItem('accessToken') || token;

            if (editingRule) {
                await axios.put(
                    `/api/auto-reply/rules/${editingRule.id}`,
                    values,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                message.success('Rule updated');
            } else {
                await axios.post('/api/auto-reply/rules', values, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                message.success('Rule created');
            }

            setRuleModalVisible(false);
            setEditingRule(null);
            form.resetFields();
            fetchData();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                message.error(error.response?.data?.error || 'Failed to save rule');
            } else {
                message.error('Failed to save rule');
            }
        }
    };

    if (!token) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    const templateColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
        },
        {
            title: 'Reply Text',
            dataIndex: 'reply_text',
            key: 'reply_text',
            render: (text: string) => text.substring(0, 50) + (text.length > 50 ? '...' : ''),
        },
        {
            title: 'Keywords',
            dataIndex: 'trigger_keywords',
            key: 'trigger_keywords',
            render: (keywords: string[]) =>
                keywords?.map((k) => (
                    <Tag key={k} color="blue">
                        {k}
                    </Tag>
                )),
        },
        {
            title: 'Active',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (active: boolean) => (
                <Tag color={active ? 'green' : 'default'}>
                    {active ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: Template) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingTemplate(record);
                            form.setFieldsValue({
                                name: record.name,
                                reply_text: record.reply_text,
                                trigger_keywords: record.trigger_keywords?.join(', '),
                            });
                            setTemplateModalVisible(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteTemplate(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const ruleColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Template',
            dataIndex: ['template', 'name'],
            key: 'template',
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            width: '100px',
        },
        {
            title: 'Enabled',
            dataIndex: 'enabled',
            key: 'enabled',
            render: (enabled: boolean) => (
                <Tag color={enabled ? 'green' : 'default'}>
                    {enabled ? 'Enabled' : 'Disabled'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: Rule) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingRule(record);
                            form.setFieldsValue({
                                name: record.name,
                                template_id: record.template_id,
                                priority: record.priority,
                                enabled: record.enabled,
                            });
                            setRuleModalVisible(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={async () => {
                            try {
                                const accessToken = localStorage.getItem('accessToken') || token;
                                await axios.delete(`/api/auto-reply/rules/${record.id}`, {
                                    headers: { Authorization: `Bearer ${accessToken}` },
                                });
                                message.success('Rule deleted');
                                fetchData();
                            } catch (error: unknown) {
                                message.error('Failed to delete rule');
                            }
                        }}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Auto-Reply Management</h1>
                <Button onClick={fetchData} loading={loading}>
                    Refresh
                </Button>
            </div>

            {/* Plan Info */}
            {stats && (
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f6ffed', borderRadius: '8px', border: '1px solid #b7eb8f' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <strong style={{ fontSize: '16px' }}>{stats.plan.name}</strong>
                            <p style={{ margin: '5px 0', color: '#666' }}>
                                Templates: {stats.usage.templates_total} | Messages: {stats.usage.messages_total} | All Channels Available
                            </p>
                        </div>
                        <Tag color="green">UNLIMITED</Tag>
                    </div>
                </div>
            )}

            <Spin spinning={loading}>
                <Tabs
                    items={[
                        {
                            key: '1',
                            label: `Templates (${templates.length})`,
                            children: (
                                <div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={() => {
                                                setEditingTemplate(null);
                                                form.resetFields();
                                                setTemplateModalVisible(true);
                                            }}
                                        >
                                            New Template
                                        </Button>
                                    </div>

                                    <Table
                                        columns={templateColumns}
                                        dataSource={templates}
                                        rowKey="id"
                                        locale={{ emptyText: <Empty description="No templates yet. Create one to get started!" /> }}
                                    />
                                </div>
                            ),
                        },
                        {
                            key: '2',
                            label: `Rules (${rules.length})`,
                            children: (
                                <div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={() => {
                                                setEditingRule(null);
                                                form.resetFields();
                                                setRuleModalVisible(true);
                                            }}
                                        >
                                            New Rule
                                        </Button>
                                    </div>

                                    <Table
                                        columns={ruleColumns}
                                        dataSource={rules}
                                        rowKey="id"
                                        locale={{ emptyText: <Empty description="No rules configured yet." /> }}
                                    />
                                </div>
                            ),
                        },
                        {
                            key: '3',
                            label: 'Statistics',
                            children: (
                                <div>
                                    {stats && (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                                            <div style={{ padding: '15px', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <strong>By Status</strong>
                                                </div>
                                                {Object.entries(stats.breakdown.by_status).map(([statusKey, count]) => (
                                                    <div key={statusKey} style={{ fontSize: '14px', marginBottom: '5px' }}>
                                                        {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}: <strong>{count}</strong>
                                                    </div>
                                                ))}
                                            </div>

                                            <div style={{ padding: '15px', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <strong>By Channel</strong>
                                                </div>
                                                {Object.entries(stats.breakdown.by_channel).map(([channel, count]) => (
                                                    <div key={channel} style={{ fontSize: '14px', marginBottom: '5px' }}>
                                                        {channel.toUpperCase()}: <strong>{count}</strong>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                />
            </Spin>

            {/* Template Modal */}
            <Modal
                title={editingTemplate ? 'Edit Template' : 'Create Template'}
                open={templateModalVisible}
                onCancel={() => {
                    setTemplateModalVisible(false);
                    setEditingTemplate(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateTemplate}>
                    <Form.Item
                        name="name"
                        label="Template Name"
                        rules={[{ required: true, message: 'Please enter template name' }]}
                    >
                        <Input placeholder="e.g., Out of Office" />
                    </Form.Item>

                    <Form.Item
                        name="reply_text"
                        label="Reply Text"
                        rules={[{ required: true, message: 'Please enter reply text' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Enter the automatic reply message..." />
                    </Form.Item>

                    <Form.Item name="trigger_keywords" label="Trigger Keywords (comma-separated)">
                        <Input placeholder="e.g., urgent, ASAP, help" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Rule Modal */}
            <Modal
                title={editingRule ? 'Edit Rule' : 'Create Rule'}
                open={ruleModalVisible}
                onCancel={() => {
                    setRuleModalVisible(false);
                    setEditingRule(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateRule}>
                    <Form.Item
                        name="name"
                        label="Rule Name"
                        rules={[{ required: true, message: 'Please enter rule name' }]}
                    >
                        <Input placeholder="e.g., Urgent Messages" />
                    </Form.Item>

                    <Form.Item
                        name="template_id"
                        label="Template"
                        rules={[{ required: true, message: 'Please select a template' }]}
                    >
                        <select style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d9d9d9' }}>
                            <option value="">Select a template</option>
                            {templates.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </Form.Item>

                    <Form.Item name="priority" label="Priority" initialValue={0}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item name="enabled" label="Enabled" valuePropName="checked" initialValue={true}>
                        <input type="checkbox" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}