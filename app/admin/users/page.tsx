"use client";

import { useState, useEffect } from "react";
import {
    Table,
    Card,
    Typography,
    Tag,
    Space,
    Button,
    Avatar,
    Input,
    Modal,
    Form,
    Select,
    DatePicker,
    message,
    Tooltip
} from "antd";
import {
    SearchOutlined,
    EditOutlined,
    ShopOutlined,
    CarOutlined,
    CheckCircleOutlined,
    StopOutlined,
    UserOutlined,
    MailOutlined,
    CalendarOutlined,
    UserAddOutlined
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function MerchantManagement() {
    const [merchants, setMerchants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [editingMerchant, setEditingMerchant] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [createForm] = Form.useForm();

    const fetchMerchants = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const res = await axios.get(`${apiUrl}/api/admin/merchants`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMerchants(res.data.data);
        } catch (err) {
            message.error("Failed to load merchants");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMerchants();
    }, []);

    const handleUpdateSubscription = async (values: any) => {
        try {
            const token = localStorage.getItem("authToken");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

            await axios.put(`${apiUrl}/api/admin/merchants/${editingMerchant.id}/subscription`, {
                status: values.subscription_status,
                plan: values.subscription_plan,
                trial_ends_at: values.trial_ends_at.toISOString()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            message.success("Merchant system updated! ✅");
            setModalVisible(false);
            fetchMerchants();
        } catch (err) {
            message.error("Update failed");
        }
    };

    const handleCreateUser = async (values: any) => {
        try {
            const token = localStorage.getItem("authToken");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

            await axios.post(`${apiUrl}/api/admin/merchants`, {
                name: values.name,
                email: values.email,
                password: values.password,
                plan: values.plan,
                role: "user" // default
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            message.success("New user created successfully! 🚀");
            setCreateModalVisible(false);
            createForm.resetFields();
            fetchMerchants();
        } catch (err: any) {
            message.error(err.response?.data?.error || "Creation failed");
        }
    };

    const columns = [
        {
            title: "Merchant / Email",
            key: "merchant",
            render: (record: any) => (
                <Space>
                    <Avatar style={{ backgroundColor: '#722ed1' }}>{record.business_name?.[0]}</Avatar>
                    <div>
                        <div style={{ fontWeight: "bold" }}>{record.business_name}</div>
                        <div style={{ fontSize: "12px", color: "#999" }}><MailOutlined /> {record.user?.email}</div>
                    </div>
                </Space>
            )
        },
        {
            title: "Plan",
            dataIndex: "subscription_plan",
            key: "plan",
            render: (plan: string) => (
                <Tag color={plan === 'cargo' ? 'orange' : 'blue'} icon={plan === 'cargo' ? <CarOutlined /> : <ShopOutlined />}>
                    {plan?.toUpperCase()}
                </Tag>
            )
        },
        {
            title: "Status",
            dataIndex: "subscription_status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === 'active' ? 'success' : 'error'} icon={status === 'active' ? <CheckCircleOutlined /> : <StopOutlined />}>
                    {status?.toUpperCase()}
                </Tag>
            )
        },
        {
            title: "Trial Ends",
            dataIndex: "trial_ends_at",
            key: "trial",
            render: (date: string) => (
                <Space>
                    <CalendarOutlined style={{ color: '#999' }} />
                    <Text>{dayjs(date).format('DD MMM YYYY')}</Text>
                    {dayjs().isAfter(dayjs(date)) && <Tag color="red">Expired</Tag>}
                </Space>
            )
        },
        {
            title: "Actions",
            key: "actions",
            render: (record: any) => (
                <Button
                    icon={<EditOutlined />}
                    type="primary"
                    ghost
                    onClick={() => {
                        setEditingMerchant(record);
                        form.setFieldsValue({
                            subscription_status: record.subscription_status,
                            subscription_plan: record.subscription_plan,
                            trial_ends_at: dayjs(record.trial_ends_at)
                        });
                        setModalVisible(true);
                    }}
                >
                    Edit
                </Button>
            )
        }
    ];

    const filteredData = merchants.filter((m: any) =>
        m.business_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        m.user?.email?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div>
            <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>👥 Merchant Management</Title>
                    <Text type="secondary">Manage your SaaS users and their subscription status</Text>
                </div>
                <Input
                    placeholder="Search by name or email..."
                    prefix={<SearchOutlined />}
                    style={{ width: 300, borderRadius: "8px" }}
                    onChange={e => setSearchText(e.target.value)}
                />
                <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={() => setCreateModalVisible(true)}
                    style={{ marginLeft: 16, backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                >
                    Create User
                </Button>
            </div>

            <Card bordered={false} style={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <Table
                    dataSource={filteredData}
                    columns={columns}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={`Edit Subscription: ${editingMerchant?.business_name}`}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
                okText="Save Changes"
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleUpdateSubscription} style={{ marginTop: 24 }}>
                    <Form.Item label="Subscription Status" name="subscription_status" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="active">Active (Paid or Trial)</Select.Option>
                            <Select.Option value="expired">Expired (Inactive)</Select.Option>
                            <Select.Option value="cancelled">Cancelled</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Plan Type" name="subscription_plan" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="shop">Online Shop (15,000 Ks)</Select.Option>
                            <Select.Option value="cargo">Cargo & Delivery (20,000 Ks)</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Trial/Expiry Date" name="trial_ends_at" rules={[{ required: true }]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Create New User"
                open={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                onOk={() => createForm.submit()}
                okText="Create User"
                confirmLoading={loading}
                destroyOnClose
            >
                <Form form={createForm} layout="vertical" onFinish={handleCreateUser} style={{ marginTop: 24 }}>
                    <Form.Item label="Full Name" name="name" rules={[{ required: true, message: 'Please enter name' }]}>
                        <Input prefix={<UserOutlined />} placeholder="e.g. Mg Mg" />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}>
                        <Input prefix={<MailOutlined />} placeholder="user@example.com" />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true, min: 6, message: 'Password must be at least 6 chars' }]}>
                        <Input.Password placeholder="Set a temporary password" />
                    </Form.Item>
                    <Form.Item label="Initial Plan" name="plan" initialValue="shop">
                        <Select>
                            <Select.Option value="shop">Online Shop (15,000 Ks)</Select.Option>
                            <Select.Option value="cargo">Cargo & Delivery (20,000 Ks)</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
