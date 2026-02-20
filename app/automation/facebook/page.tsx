"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    Button,
    Modal,
    Form,
    Input,
    Switch,
    Tag,
    Space,
    message,
    Empty,
    Tooltip,
    Badge,
    Divider,
    FloatButton,
    Spin,
    Typography
} from "antd";

const { Title, Text, Paragraph } = Typography;
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ShopOutlined,
    CarOutlined,
    ThunderboltOutlined,
    RobotOutlined,
    MessageOutlined,
    ArrowLeftOutlined,
    SettingOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import AuthGuard from "@/components/AuthGuard";
import axios from "axios";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { API_URL } from "@/lib/apiConfig";

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
    metadata?: {
        welcome_message?: string;
        completion_message?: string;
        steps?: Record<string, { question: string, enabled: boolean }>;
    };
}

const FLOW_STEPS_DEFINITION = {
    online_shop: [
        { field: "order_source", label: "Order Source (e.g. Live, Message)" },
        { field: "item_name", label: "Product Name" },
        { field: "item_variant", label: "Color/Size" },
        { field: "quantity", label: "Quantity" },
        { field: "delivery", label: "Delivery Type (Pickup/Delivery)" },
        { field: "address", label: "Delivery Address" },
        { field: "full_name", label: "Customer Name" },
        { field: "phone", label: "Phone Number" },
        { field: "notes", label: "Notes/KPay Ref" }
    ],
    cargo: [
        { field: "country", label: "Shipping Country" },
        { field: "shipping", label: "Shipping Method (Air/Sea)" },
        { field: "item_type", label: "Item Category" },
        { field: "item_name", label: "Item Description" },
        { field: "weight", label: "Approx. Weight" },
        { field: "item_value", label: "Item Value" },
        { field: "full_name", label: "Sender/Receiver Name" },
        { field: "phone", label: "Contact Phone" },
        { field: "address", label: "Delivery Address" }
    ]
};

export default function FacebookAutoReply() {
    const router = useRouter();
    const { t } = useLanguage();
    const [flows, setFlows] = useState<AutomationFlow[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [customModalVisible, setCustomModalVisible] = useState(false);
    const [editingFlow, setEditingFlow] = useState<AutomationFlow | null>(null);
    const [form] = Form.useForm();
    const [customForm] = Form.useForm();

    const fetchFlows = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get(`${API_URL}/api/merchants/flows`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFlows(response.data.data || []);
        } catch (error: any) {
            console.error("Fetch Flows Error:", error);
            if (!error.response) {
                message.error("Network Error: Unable to reach server.");
                return;
            }
            if (error.response.status === 402) {
                message.error(error.response.data.message || "Subscription expired");
                return;
            }
            const msg = error.response?.data?.error || error.response?.data?.message || t.common.error;
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlows();
    }, []);

    const handleSubmit = async (values: any) => {
        try {
            const token = localStorage.getItem("authToken");
            // Redirect to Backend OAuth URL
            if (editingFlow) {
                await axios.put(`${API_URL}/api/merchants/flows/${editingFlow.id}`, values, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                message.success(t.automation.updated);
            } else {
                await axios.post(`${API_URL}/api/merchants/flows`, values, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                message.success(t.automation.created);
            }
            setModalVisible(false);
            setEditingFlow(null);
            fetchFlows();
        } catch (error: any) {
            message.error(t.common.error);
        }
    };

    const handleDelete = async (id: string, e: any) => {
        e.stopPropagation();
        Modal.confirm({
            title: t.automation.deleteTitle,
            content: t.automation.deleteDesc,
            okText: t.automation.deleteConfirm,
            okType: "danger",
            cancelText: t.automation.deleteCancel,
            okButtonProps: { style: { borderRadius: "8px" } },
            cancelButtonProps: { style: { borderRadius: "8px" } },
            onOk: async () => {
                try {
                    const token = localStorage.getItem("authToken");
                    await axios.delete(`${API_URL}/api/merchants/flows/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    message.success(t.automation.deleted);
                    fetchFlows();
                } catch (error: any) {
                    message.error(t.common.error);
                }
            },
        });
    };

    const toggleActive = async (flow: AutomationFlow, e: any) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem("authToken");
            await axios.patch(`${API_URL}/api/merchants/flows/${flow.id}/toggle`,
                { is_active: !flow.is_active },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchFlows();
        } catch (error: any) {
            message.error(t.automation.toggleFailed);
        }
    };

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

    const openCustomModal = (flow: AutomationFlow, e: any) => {
        e.stopPropagation();
        setEditingFlow(flow);

        // Prepare initial values from metadata or defaults
        const metadata = flow.metadata || {};
        const stepsData: any = {};

        const businessType = flow.business_type === 'cargo' ? 'cargo' : 'online_shop';
        const defaultSteps = FLOW_STEPS_DEFINITION[businessType];

        defaultSteps.forEach(s => {
            stepsData[s.field] = {
                question: metadata.steps?.[s.field]?.question || "",
                enabled: metadata.steps?.[s.field]?.enabled ?? true
            };
        });

        customForm.setFieldsValue({
            welcome_message: metadata.welcome_message || "",
            completion_message: metadata.completion_message || "",
            steps: stepsData
        });

        setCustomModalVisible(true);
    };

    const handleCustomSubmit = async (values: any) => {
        if (!editingFlow) return;

        try {
            const token = localStorage.getItem("authToken");
            await axios.put(`${API_URL}/api/merchants/flows/${editingFlow.id}`, {
                metadata: values
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success(t.automation.customizationSaved);
            setCustomModalVisible(false);
            fetchFlows();
        } catch (error: any) {
            message.error(t.common.error);
        }
    };

    return (
        <AuthGuard>
            <div style={{ minHeight: "100vh", background: "#f8fafc", paddingBottom: "100px" }}>
                {/* Minimalist Header */}
                <div style={{
                    background: "#fff",
                    padding: "20px 24px",
                    borderBottom: "1px solid #e2e8f0",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            type="text"
                            shape="circle"
                            style={{ background: "#f1f5f9" }}
                            onClick={() => router.push("/dashboard")}
                        />
                        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>{t.automation.title}</h2>
                    </div>
                </div>

                <div style={{ padding: "24px" }}>
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "100px 0" }}>
                            <Spin size="large" />
                            <div style={{ marginTop: "16px", color: "#64748b" }}>{t.automation.loading}</div>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "800px", margin: "0 auto" }}>
                            {flows.length === 0 ? (
                                <Card style={{ borderRadius: "24px", textAlign: "center", padding: "60px 20px", border: "1px dashed #cbd5e1", background: "transparent" }}>
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description={
                                            <Space direction="vertical">
                                                <span style={{ fontSize: "16px", fontWeight: 600, color: "#475569" }}>{t.automation.emptyTitle}</span>
                                                <span style={{ color: "#94a3b8" }}>{t.automation.emptyDesc}</span>
                                            </Space>
                                        }
                                    >
                                        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => openModal()} style={{ borderRadius: "12px", marginTop: "20px" }}>
                                            {t.automation.createFirst}
                                        </Button>
                                    </Empty>
                                </Card>
                            ) : (
                                flows.map((flow) => (
                                    <Card
                                        key={flow.id}
                                        onClick={() => openModal(flow)}
                                        hoverable
                                        style={{
                                            borderRadius: "20px",
                                            border: "none",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                                            transition: "all 0.3s ease"
                                        }}
                                        styles={{ body: { padding: "20px" } }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                                    <div style={{
                                                        background: flow.business_type === "online_shop" ? "#eff6ff" : "#fff7ed",
                                                        padding: "8px",
                                                        borderRadius: "10px",
                                                        display: "flex"
                                                    }}>
                                                        {flow.business_type === "online_shop" ?
                                                            <ShopOutlined style={{ color: "#3b82f6", fontSize: "18px" }} /> :
                                                            <CarOutlined style={{ color: "#f97316", fontSize: "18px" }} />
                                                        }
                                                    </div>
                                                    <span style={{ fontWeight: 700, fontSize: "17px", color: "#1e293b" }}>{flow.name}</span>
                                                    {flow.is_active ?
                                                        <Tag bordered={false} color="success" style={{ borderRadius: "6px", margin: 0 }}>{t.automation.active}</Tag> :
                                                        <Tag bordered={false} color="default" style={{ borderRadius: "6px", margin: 0 }}>{t.automation.paused}</Tag>
                                                    }
                                                </div>
                                                <Space size={8} style={{ marginBottom: "12px" }}>
                                                    <Tag bordered={false} style={{ background: "#f1f5f9", color: "#64748b", fontWeight: 600, borderRadius: "6px" }}>
                                                        <MessageOutlined /> {flow.trigger_keyword}
                                                    </Tag>
                                                </Space>
                                                <div style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.5" }}>
                                                    {flow.description || t.automation.noDescription}
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <Tooltip title={t.automation.customize}>
                                                    <Button
                                                        type="text"
                                                        shape="circle"
                                                        icon={<SettingOutlined />}
                                                        onClick={(e) => openCustomModal(flow, e)}
                                                        style={{ background: "#f1f5f9" }}
                                                    />
                                                </Tooltip>
                                                <Tooltip title={flow.is_active ? "Turn Off" : "Turn On"}>
                                                    <Switch
                                                        checked={flow.is_active}
                                                        onChange={(checked, e) => toggleActive(flow, e)}
                                                        style={{ background: flow.is_active ? "#22c55e" : undefined }}
                                                    />
                                                </Tooltip>
                                                <Button
                                                    danger
                                                    type="text"
                                                    shape="circle"
                                                    icon={<DeleteOutlined />}
                                                    onClick={(e) => handleDelete(flow.id, e)}
                                                    style={{ background: "#fef2f2" }}
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* FAB */}
                {!loading && flows.length > 0 && (
                    <FloatButton
                        icon={<PlusOutlined />}
                        type="primary"
                        style={{ right: 32, bottom: 32, width: 60, height: 60, boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)" }}
                        onClick={() => openModal()}
                    />
                )}

                {/* Premium Modal */}
                <Modal
                    title={<div style={{ padding: "10px 0", fontSize: "20px", fontWeight: 700 }}>{editingFlow ? t.automation.editFlow : t.automation.createFlow}</div>}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                    centered
                    width={450}
                    styles={{ body: { padding: "10px 24px 24px 24px" } }}
                    style={{ borderRadius: "24px", overflow: "hidden" }}
                >
                    <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
                        <Form.Item label={<Text strong>{t.automation.flowName}</Text>} name="name" rules={[{ required: true, message: t.automation.nameRequired }]}>
                            <Input placeholder={t.automation.placeholderName} style={{ height: "45px", borderRadius: "10px" }} />
                        </Form.Item>
                        {/* business_type is auto-filled from merchant profile */}
                        <Form.Item label={<Text strong>{t.automation.triggerKeyword}</Text>} name="trigger_keyword" rules={[{ required: true, message: t.automation.keywordRequired }]}>
                            <Input placeholder={t.automation.placeholderKeyword} style={{ height: "45px", borderRadius: "10px" }} />
                        </Form.Item>
                        <Form.Item label={<Text strong>{t.automation.description}</Text>} name="description">
                            <TextArea rows={3} placeholder={t.automation.placeholderDesc} style={{ borderRadius: "10px" }} />
                        </Form.Item>
                        <div style={{ marginTop: "24px" }}>
                            <Button type="primary" htmlType="submit" block size="large" style={{ height: "50px", borderRadius: "12px", fontWeight: 700, background: "#0f172a", border: "none" }}>
                                {editingFlow ? t.automation.saveChanges : t.automation.createFlow}
                            </Button>
                        </div>
                    </Form>
                </Modal>

                {/* Customization Modal */}
                <Modal
                    title={
                        <Space direction="vertical" style={{ gap: 0 }}>
                            <div style={{ fontSize: "20px", fontWeight: 700 }}>{t.automation.customize}</div>
                            <Text type="secondary" style={{ fontSize: "12px" }}>{t.automation.customizeDesc}</Text>
                        </Space>
                    }
                    open={customModalVisible}
                    onCancel={() => setCustomModalVisible(false)}
                    footer={null}
                    centered
                    width={600}
                    styles={{ body: { padding: "10px 24px 24px 24px", maxHeight: "80vh", overflowY: "auto" } }}
                    style={{ borderRadius: "24px" }}
                >
                    <Form form={customForm} layout="vertical" onFinish={handleCustomSubmit} requiredMark={false}>
                        <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "16px", marginBottom: "20px" }}>
                            <Space size={4} style={{ marginBottom: "8px", display: "flex", alignItems: "center" }}>
                                <InfoCircleOutlined style={{ color: "#3b82f6" }} />
                                <Text strong style={{ fontSize: "14px", color: "#334155" }}>Tips</Text>
                            </Space>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>
                                {t.automation.placeholders}
                            </div>
                        </div>

                        <Form.Item label={<Text strong>{t.automation.welcomeMsg}</Text>} name="welcome_message">
                            <TextArea placeholder={t.automation.welcomePlaceholder} rows={3} style={{ borderRadius: "10px" }} />
                        </Form.Item>

                        <Form.Item label={<Text strong>{t.automation.completionMsg}</Text>} name="completion_message">
                            <TextArea placeholder={t.automation.completionPlaceholder} rows={4} style={{ borderRadius: "10px" }} />
                        </Form.Item>

                        <Divider style={{ margin: "24px 0" }}>
                            <Text strong style={{ fontSize: "16px" }}>{t.automation.stepsTitle}</Text>
                        </Divider>

                        {editingFlow && (FLOW_STEPS_DEFINITION[editingFlow.business_type === 'cargo' ? 'cargo' : 'online_shop']).map((step) => (
                            <Card key={step.field} size="small" style={{ marginBottom: "12px", borderRadius: "12px", border: "1px solid #f1f5f9" }} styles={{ body: { padding: "12px 16px" } }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                    <Text strong>{step.label}</Text>
                                    <Form.Item name={["steps", step.field, "enabled"]} valuePropName="checked" noStyle initialValue={true}>
                                        <Switch size="small" />
                                    </Form.Item>
                                </div>
                                <Form.Item name={["steps", step.field, "question"]} noStyle>
                                    <Input placeholder={t.automation.stepQuestion} style={{ borderRadius: "8px" }} />
                                </Form.Item>
                            </Card>
                        ))}

                        <div style={{ marginTop: "32px", position: "sticky", bottom: 0, background: "#fff", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
                            <Button type="primary" htmlType="submit" block size="large" style={{ height: "50px", borderRadius: "12px", fontWeight: 700, background: "#0f172a", border: "none" }}>
                                {t.automation.saveCustomization}
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </AuthGuard>
    );
}
