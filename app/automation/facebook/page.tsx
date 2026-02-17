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
} from "antd";
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
                message.success("Updated! ✅");
            } else {
                await axios.post(`${apiUrl}/api/automation/flows`, values, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                message.success("Created! 🚀");
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
            okText: "ဖျက်မည်",
            okType: "danger",
            cancelText: "မဖျက်တော့ပါ",
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
            <div style={{ minHeight: "100vh", background: "#f0f2f5", paddingBottom: "80px" }}>
                {/* Mobile Header */}
                <div style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    padding: "20px",
                    color: "white",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    display: "flex",
                    alignItems: "center",
                    gap: "16px"
                }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        type="text"
                        style={{ color: "white" }}
                        onClick={() => router.push("/dashboard")}
                    />
                    <h2 style={{ margin: 0, color: "white", fontSize: "18px" }}>Auto-Reply Flows</h2>
                </div>

                <div style={{ padding: "16px" }}>
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {flows.length === 0 ? (
                                <Empty description="Flow များ မရှိသေးပါ။ တစ်ခုခု စဆောက်ကြည့်ပါ။" />
                            ) : (
                                flows.map((flow) => (
                                    <Card
                                        key={flow.id}
                                        onClick={() => openModal(flow)}
                                        style={{ borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                                        bodyStyle={{ padding: "16px" }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                                    {flow.business_type === "online_shop" ? <ShopOutlined style={{ color: "#1890ff" }} /> : <CarOutlined style={{ color: "#fa8c16" }} />}
                                                    <span style={{ fontWeight: "bold", fontSize: "16px" }}>{flow.name}</span>
                                                </div>
                                                <Space size={4} style={{ marginBottom: "8px" }}>
                                                    <Tag color="purple">Keyword: {flow.trigger_keyword}</Tag>
                                                    {flow.is_active ? <Badge status="success" text="Active" /> : <Badge status="default" text="Off" />}
                                                </Space>
                                                <div style={{ color: "#666", fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                                    {flow.description || "No description set"}
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
                                                <Switch
                                                    checked={flow.is_active}
                                                    size="small"
                                                    onClick={(checked, e) => toggleActive(flow, e)}
                                                />
                                                <Button
                                                    danger
                                                    type="text"
                                                    icon={<DeleteOutlined />}
                                                    onClick={(e) => handleDelete(flow.id, e)}
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Floating Action Button for Mobile */}
                <FloatButton
                    icon={<PlusOutlined />}
                    type="primary"
                    style={{ right: 24, bottom: 24, width: 56, height: 56 }}
                    onClick={() => openModal()}
                />

                {/* Create/Edit Modal */}
                <Modal
                    title={editingFlow ? "ပြင်ဆင်မည်" : "Flow အသစ်ဆောက်မည်"}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                    width="90%"
                    style={{ maxWidth: "500px" }}
                >
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item label="Flow Name" name="name" rules={[{ required: true }]}>
                            <Input placeholder="🛍️ ပစ္စည်းမှာယူခြင်း" />
                        </Form.Item>
                        <Form.Item label="Business Type" name="business_type" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value="online_shop">Online Shop (E-commerce)</Select.Option>
                                <Select.Option value="cargo">Cargo & Delivery</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Trigger Keyword" name="trigger_keyword" rules={[{ required: true }]}>
                            <Input placeholder="order သို့မဟုတ် ship" />
                        </Form.Item>
                        <Form.Item label="Description" name="description">
                            <TextArea rows={2} placeholder="ဒီ flow က ဘာအတွက်လဲ..." />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" style={{ marginTop: "16px" }}>
                            {editingFlow ? "ပြင်ဆင်ချက်သိမ်းမည်" : "စတင်အသုံးပြုမည်"}
                        </Button>
                    </Form>
                </Modal>
            </div>
        </AuthGuard>
    );
}
