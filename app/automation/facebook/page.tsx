"use client";

import { useState, useEffect } from "react";
import {
    Card,
    Tabs,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Switch,
    Tag,
    Space,
    message,
    Empty,
    Tooltip,
    Badge,
    Divider,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ShopOutlined,
    CarOutlined,
    ThunderboltOutlined,
    CheckCircleOutlined,
    StopOutlined,
    RobotOutlined,
    MessageOutlined,
} from "@ant-design/icons";
import AuthGuard from "@/components/AuthGuard";
import axios from "axios";

const { TabPane } = Tabs;
const { TextArea } = Input;

interface AutomationFlow {
    id: string;
    name: string;
    trigger_keyword: string;
    business_type: "online_shop" | "cargo" | "default";
    description?: string;
    ai_prompt?: string;
    is_active: boolean;
    created_at: string;
}

export default function FacebookAutoReply() {
    const [flows, setFlows] = useState<AutomationFlow[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingFlow, setEditingFlow] = useState<AutomationFlow | null>(null);
    const [activeTab, setActiveTab] = useState<string>("all");
    const [form] = Form.useForm();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    // Fetch flows
    const fetchFlows = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get(`${apiUrl}/api/automation/flows`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFlows(response.data.data || []);
        } catch (error: any) {
            message.error(error.response?.data?.error || "Failed to fetch flows");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlows();
    }, []);

    // Create or update flow
    const handleSubmit = async (values: any) => {
        try {
            const token = localStorage.getItem("authToken");
            if (editingFlow) {
                await axios.put(
                    `${apiUrl}/api/automation/flows/${editingFlow.id}`,
                    values,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                message.success("Flow updated successfully! 🎉");
            } else {
                await axios.post(`${apiUrl}/api/automation/flows`, values, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                message.success("Flow created successfully! 🚀");
            }
            setModalVisible(false);
            form.resetFields();
            setEditingFlow(null);
            fetchFlows();
        } catch (error: any) {
            message.error(error.response?.data?.error || "Failed to save flow");
        }
    };

    // Delete flow
    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: "Delete Flow?",
            content: "This action cannot be undone.",
            okText: "Delete",
            okType: "danger",
            onOk: async () => {
                try {
                    const token = localStorage.getItem("authToken");
                    await axios.delete(`${apiUrl}/api/automation/flows/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    message.success("Flow deleted successfully");
                    fetchFlows();
                } catch (error: any) {
                    message.error("Failed to delete flow");
                }
            },
        });
    };

    // Toggle active status
    const toggleActive = async (flow: AutomationFlow) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.put(
                `${apiUrl}/api/automation/flows/${flow.id}`,
                { is_active: !flow.is_active },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success(
                flow.is_active ? "Flow disabled" : "Flow enabled! ✅"
            );
            fetchFlows();
        } catch (error: any) {
            message.error("Failed to toggle flow status");
        }
    };

    // Open modal for create/edit
    const openModal = (flow?: AutomationFlow) => {
        if (flow) {
            setEditingFlow(flow);
            form.setFieldsValue(flow);
        } else {
            setEditingFlow(null);
            form.resetFields();
        }
        setModalVisible(true);
    };

    // Filter flows by tab
    const filteredFlows = flows.filter((flow) => {
        if (activeTab === "all") return true;
        if (activeTab === "active") return flow.is_active;
        if (activeTab === "inactive") return !flow.is_active;
        return flow.business_type === activeTab;
    });

    // Get business type icon and color
    const getBusinessTypeTag = (type: string) => {
        const configs = {
            online_shop: {
                icon: <ShopOutlined />,
                color: "blue",
                label: "Online Shop",
            },
            cargo: { icon: <CarOutlined />, color: "orange", label: "Cargo" },
            default: {
                icon: <ThunderboltOutlined />,
                color: "default",
                label: "Default",
            },
        };
        const config = configs[type as keyof typeof configs] || configs.default;
        return (
            <Tag icon={config.icon} color={config.color}>
                {config.label}
            </Tag>
        );
    };

    // Table columns
    const columns = [
        {
            title: "Flow Name",
            dataIndex: "name",
            key: "name",
            render: (text: string, record: AutomationFlow) => (
                <Space>
                    <RobotOutlined style={{ color: "#1890ff" }} />
                    <strong>{text}</strong>
                    {record.is_active && (
                        <Badge status="success" text="Active" />
                    )}
                </Space>
            ),
        },
        {
            title: "Trigger",
            dataIndex: "trigger_keyword",
            key: "trigger_keyword",
            render: (text: string) => (
                <Tag icon={<MessageOutlined />} color="purple">
                    {text}
                </Tag>
            ),
        },
        {
            title: "Business Type",
            dataIndex: "business_type",
            key: "business_type",
            render: (type: string) => getBusinessTypeTag(type),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
        },
        {
            title: "Status",
            dataIndex: "is_active",
            key: "is_active",
            render: (isActive: boolean, record: AutomationFlow) => (
                <Switch
                    checked={isActive}
                    onChange={() => toggleActive(record)}
                    checkedChildren={<CheckCircleOutlined />}
                    unCheckedChildren={<StopOutlined />}
                />
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: AutomationFlow) => (
                <Space>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => openModal(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <AuthGuard>
            <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
                {/* Header */}
                <Card
                    style={{
                        marginBottom: 24,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                    }}
                >
                    <div style={{ color: "white" }}>
                        <h1 style={{ color: "white", margin: 0, fontSize: 28 }}>
                            🤖 Facebook Auto-Reply Automation
                        </h1>
                        <p style={{ color: "rgba(255,255,255,0.9)", margin: "8px 0 0 0" }}>
                            AI-powered conversations for Online Shop & Cargo businesses
                        </p>
                    </div>
                </Card>

                {/* Main Content */}
                <Card
                    title={
                        <Space>
                            <ThunderboltOutlined />
                            Automation Flows
                        </Space>
                    }
                    extra={
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => openModal()}
                            size="large"
                        >
                            Create Flow
                        </Button>
                    }
                >
                    <Tabs activeKey={activeTab} onChange={setActiveTab}>
                        <TabPane tab="All Flows" key="all" />
                        <TabPane
                            tab={
                                <span>
                                    <CheckCircleOutlined /> Active
                                </span>
                            }
                            key="active"
                        />
                        <TabPane
                            tab={
                                <span>
                                    <StopOutlined /> Inactive
                                </span>
                            }
                            key="inactive"
                        />
                        <TabPane
                            tab={
                                <span>
                                    <ShopOutlined /> Online Shop
                                </span>
                            }
                            key="online_shop"
                        />
                        <TabPane
                            tab={
                                <span>
                                    <CarOutlined /> Cargo
                                </span>
                            }
                            key="cargo"
                        />
                    </Tabs>

                    <Table
                        columns={columns}
                        dataSource={filteredFlows}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                        locale={{
                            emptyText: (
                                <Empty
                                    description="No automation flows yet. Create your first flow!"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            ),
                        }}
                    />
                </Card>

                {/* Create/Edit Modal */}
                <Modal
                    title={
                        <Space>
                            <RobotOutlined />
                            {editingFlow ? "Edit Flow" : "Create New Flow"}
                        </Space>
                    }
                    open={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        form.resetFields();
                        setEditingFlow(null);
                    }}
                    footer={null}
                    width={700}
                >
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Flow Name"
                            name="name"
                            rules={[
                                { required: true, message: "Please enter flow name" },
                            ]}
                        >
                            <Input
                                placeholder="e.g., Product Order Flow"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Business Type"
                            name="business_type"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select business type",
                                },
                            ]}
                            tooltip="Choose the type of business this flow is for"
                        >
                            <Select size="large" placeholder="Select business type">
                                <Select.Option value="online_shop">
                                    <ShopOutlined /> Online Shop (Product Orders)
                                </Select.Option>
                                <Select.Option value="cargo">
                                    <CarOutlined /> Cargo/Shipping
                                </Select.Option>
                                <Select.Option value="default">
                                    <ThunderboltOutlined /> Default
                                </Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Trigger Keyword"
                            name="trigger_keyword"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter trigger keyword",
                                },
                            ]}
                            tooltip="Customers type this keyword to start the flow"
                        >
                            <Input
                                placeholder="e.g., order, ship, track"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item label="Description" name="description">
                            <Input
                                placeholder="Brief description of this flow"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Custom AI Prompt (Optional)"
                            name="ai_prompt"
                            tooltip="Leave empty to use default AI prompts for the selected business type"
                        >
                            <TextArea
                                rows={6}
                                placeholder="Custom instructions for AI (optional). Default prompts are optimized for each business type."
                            />
                        </Form.Item>

                        <Form.Item name="is_active" valuePropName="checked">
                            <Space>
                                <Switch />
                                <span>Activate this flow immediately</span>
                            </Space>
                        </Form.Item>

                        <Divider />

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                                <Button
                                    onClick={() => {
                                        setModalVisible(false);
                                        form.resetFields();
                                        setEditingFlow(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit" size="large">
                                    {editingFlow ? "Update Flow" : "Create Flow"}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Info Cards */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: 16,
                        marginTop: 24,
                    }}
                >
                    <Card size="small">
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <ShopOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                            <h4 style={{ margin: 0 }}>Online Shop Flows</h4>
                            <p style={{ margin: 0, color: "#666", fontSize: 12 }}>
                                AI extracts: product, quantity, address, phone, payment
                            </p>
                        </Space>
                    </Card>
                    <Card size="small">
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <CarOutlined style={{ fontSize: 24, color: "#ff7a45" }} />
                            <h4 style={{ margin: 0 }}>Cargo Flows</h4>
                            <p style={{ margin: 0, color: "#666", fontSize: 12 }}>
                                AI extracts: package type, weight, addresses, urgency
                            </p>
                        </Space>
                    </Card>
                    <Card size="small">
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <RobotOutlined style={{ fontSize: 24, color: "#52c41a" }} />
                            <h4 style={{ margin: 0 }}>AI-Powered</h4>
                            <p style={{ margin: 0, color: "#666", fontSize: 12 }}>
                                Natural conversations with intelligent data extraction
                            </p>
                        </Space>
                    </Card>
                </div>
            </div>
        </AuthGuard>
    );
}
