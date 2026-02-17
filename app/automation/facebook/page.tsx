"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
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
} from "@ant-design/icons";
import AuthGuard from "@/components/AuthGuard";
import axios from "axios";

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
    const router = useRouter();
    const [flows, setFlows] = useState<AutomationFlow[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingFlow, setEditingFlow] = useState<AutomationFlow | null>(null);
    const [form] = Form.useForm();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    const fetchFlows = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get(`${apiUrl}/api/automation/flows`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFlows(response.data.data || []);
        } catch (error: any) {
            message.error("Failed to fetch flows");
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
            if (editingFlow) {
                await axios.put(`${apiUrl}/api/automation/flows/${editingFlow.id}`, values, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                message.success("Updated Successfully! ✅");
            } else {
                await axios.post(`${apiUrl}/api/automation/flows`, values, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                message.success("Flow Created! 🚀");
            }
            setModalVisible(false);
            setEditingFlow(null);
            fetchFlows();
        } catch (error: any) {
            message.error("Failed to save flow");
        }
    };

    const handleDelete = async (id: string, e: any) => {
        e.stopPropagation();
        Modal.confirm({
            title: "ဖျက်မှာ သေချာပါသလား?",
            content: "ဤ Flow ကို ဖျက်လိုက်ပါက Auto-reply အလုပ်လုပ်တော့မည် မဟုတ်ပါ။",
            okText: "ဖျက်မည်",
            okType: "danger",
            cancelText: "မဖျက်တော့ပါ",
            okButtonProps: { style: { borderRadius: "8px" } },
            cancelButtonProps: { style: { borderRadius: "8px" } },
            onOk: async () => {
                try {
                    const token = localStorage.getItem("authToken");
                    await axios.delete(`${apiUrl}/api/automation/flows/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    message.success("Deleted");
                    fetchFlows();
                } catch (error: any) {
                    message.error("Delete failed");
                }
            },
        });
    };

    const toggleActive = async (flow: AutomationFlow, e: any) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem("authToken");
            await axios.put(`${apiUrl}/api/automation/flows/${flow.id}`,
                { is_active: !flow.is_active },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchFlows();
        } catch (error: any) {
            message.error("Toggle failed");
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
                        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>Auto-Reply Flows</h2>
                    </div>
                </div>

                <div style={{ padding: "24px" }}>
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "100px 0" }}>
                            <Spin size="large" />
                            <div style={{ marginTop: "16px", color: "#64748b" }}>Loading flows...</div>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "800px", margin: "0 auto" }}>
                            {flows.length === 0 ? (
                                <Card style={{ borderRadius: "24px", textAlign: "center", padding: "60px 20px", border: "1px dashed #cbd5e1", background: "transparent" }}>
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description={
                                            <Space direction="vertical">
                                                <span style={{ fontSize: "16px", fontWeight: 600, color: "#475569" }}>No Flows Created Yet</span>
                                                <span style={{ color: "#94a3b8" }}>တစ်ခုခု စတင်ဆောက်လုပ်ပြီး Auto-reply စတင်လိုက်ပါ။</span>
                                            </Space>
                                        }
                                    >
                                        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => openModal()} style={{ borderRadius: "12px", marginTop: "20px" }}>
                                            Create First Flow
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
                                                        <Tag bordered={false} color="success" style={{ borderRadius: "6px", margin: 0 }}>Active</Tag> :
                                                        <Tag bordered={false} color="default" style={{ borderRadius: "6px", margin: 0 }}>Paused</Tag>
                                                    }
                                                </div>
                                                <Space size={8} style={{ marginBottom: "12px" }}>
                                                    <Tag bordered={false} style={{ background: "#f1f5f9", color: "#64748b", fontWeight: 600, borderRadius: "6px" }}>
                                                        <MessageOutlined /> {flow.trigger_keyword}
                                                    </Tag>
                                                </Space>
                                                <div style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.5" }}>
                                                    {flow.description || "No description provided."}
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
                    title={<div style={{ padding: "10px 0", fontSize: "20px", fontWeight: 700 }}>{editingFlow ? "Edit Flow" : "Create New Flow"}</div>}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                    centered
                    width={450}
                    styles={{ body: { padding: "10px 24px 24px 24px" } }}
                    style={{ borderRadius: "24px", overflow: "hidden" }}
                >
                    <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
                        <Form.Item label={<Text strong>Flow Name</Text>} name="name" rules={[{ required: true, message: 'Please enter a name' }]}>
                            <Input placeholder="🛍️ ပစ္စည်းမှာယူခြင်း" style={{ height: "45px", borderRadius: "10px" }} />
                        </Form.Item>
                        <Form.Item label={<Text strong>Business Type</Text>} name="business_type" rules={[{ required: true }]}>
                            <Select style={{ height: "45px" }} dropdownStyle={{ borderRadius: "12px" }}>
                                <Select.Option value="online_shop">Online Shop (E-commerce)</Select.Option>
                                <Select.Option value="cargo">Cargo & Delivery</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label={<Text strong>Trigger Keyword</Text>} name="trigger_keyword" rules={[{ required: true }]}>
                            <Input placeholder="ဥပမာ- order သို့မဟုတ် ship" style={{ height: "45px", borderRadius: "10px" }} />
                        </Form.Item>
                        <Form.Item label={<Text strong>Description</Text>} name="description">
                            <TextArea rows={3} placeholder="ဒီ flow က ဘာအတွက်လဲ..." style={{ borderRadius: "10px" }} />
                        </Form.Item>
                        <div style={{ marginTop: "24px" }}>
                            <Button type="primary" htmlType="submit" block size="large" style={{ height: "50px", borderRadius: "12px", fontWeight: 700, background: "#0f172a", border: "none" }}>
                                {editingFlow ? "Save Changes" : "Create Flow"}
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </AuthGuard>
    );
}
