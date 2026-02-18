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
    Tooltip,
    Row,
    Col,
    Statistic
} from "antd";
import {
    SearchOutlined,
    EditOutlined,
    ShopOutlined,
    CarOutlined,
    CheckCircleOutlined,
    StopOutlined,
    ClockCircleOutlined,
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
        } catch (err: any) {
            console.error("Failed to load merchants:", err);
            if (!err.response) {
                message.error("Network Error (Check API URL)");
            } else {
                message.error("Failed to load: " + (err.response?.data?.error || err.message));
            }
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
            console.error("Create user failed:", err);
            const errorMsg = err.response?.data?.error || err.message || "Creation failed";
            const details = err.response?.data?.details || "";
            message.error(errorMsg + (details ? `: ${details}` : ""));
        }
    };

    const handleApprove = async (merchant: any) => {
        try {
            const token = localStorage.getItem("authToken");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

            // Set trial to 30 days from now
            const oneMonthLater = dayjs().add(30, 'day').toISOString();

            await axios.put(`${apiUrl}/api/admin/merchants/${merchant.id}/subscription`, {
                status: 'active',
                plan: merchant.subscription_plan || 'shop',
                trial_ends_at: oneMonthLater
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            message.success(`Approved ${merchant.business_name || 'user'}! 30-day trial started. ✅`);
            fetchMerchants();
        } catch (err) {
            message.error("Approval failed");
        }
    };

    const columns = [
        {
            title: "Merchant / Email",
            key: "merchant",
            render: (record: any) => (
                <Space>
                    <Avatar style={{ backgroundColor: '#722ed1' }}>{record.business_name?.[0] || 'U'}</Avatar>
                    <div>
                        <div style={{ fontWeight: "bold" }}>{record.business_name || 'No Name'}</div>
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
                    {(plan || 'SHOP').toUpperCase()}
                </Tag>
            )
        },
        {
            title: "Status",
            dataIndex: "subscription_status",
            key: "status",
            render: (status: string, record: any) => {
                if (!record.trial_ends_at) {
                    return <Tag color="warning" icon={<ClockCircleOutlined />}>PENDING APPROVAL</Tag>;
                }
                return (
                    <Tag color={status === 'active' ? 'success' : 'error'} icon={status === 'active' ? <CheckCircleOutlined /> : <StopOutlined />}>
                        {status?.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: "Trial / Expiry",
            dataIndex: "trial_ends_at",
            key: "trial",
            render: (date: string) => {
                if (!date) return <Text type="secondary">Not Started</Text>;
                return (
                    <Space>
                        <CalendarOutlined style={{ color: '#999' }} />
                        <Text>{dayjs(date).format('DD MMM YYYY')}</Text>
                        {dayjs().isAfter(dayjs(date)) && <Tag color="red">Expired</Tag>}
                    </Space>
                );
            }
        },
        {
            title: "Actions",
            key: "actions",
            render: (record: any) => (
                <Space>
                    {!record.trial_ends_at && (
                        <Button
                            type="primary"
                            size="small"
                            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                            onClick={() => handleApprove(record)}
                        >
                            Approve (1m)
                        </Button>
                    )}
                    <Button
                        icon={<EditOutlined />}
                        type="primary"
                        ghost
                        size="small"
                        onClick={() => {
                            setEditingMerchant(record);
                            form.setFieldsValue({
                                subscription_status: record.subscription_status,
                                subscription_plan: record.subscription_plan,
                                trial_ends_at: record.trial_ends_at ? dayjs(record.trial_ends_at) : dayjs().add(30, 'day')
                            });
                            setModalVisible(true);
                        }}
                    >
                        Edit
                    </Button>
                </Space>
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

            {/* Stats Summary */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card bordered={false} style={{ background: "#e6f7ff", borderRadius: 12 }}>
                        <Statistic
                            title="Total Merchants"
                            value={merchants.length}
                            prefix={<ShopOutlined style={{ color: "#1890ff" }} />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} style={{ background: "#f6ffed", borderRadius: 12 }}>
                        <Statistic
                            title="Active Subscriptions"
                            value={merchants.filter((m: any) => m.subscription_status === 'active').length}
                            prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} style={{ background: "#fff1f0", borderRadius: 12 }}>
                        <Statistic
                            title="Expired / Inactive"
                            value={merchants.filter((m: any) => m.subscription_status !== 'active').length}
                            prefix={<StopOutlined style={{ color: "#f5222d" }} />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card bordered={false} style={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <Table
                    dataSource={filteredData}
                    columns={columns}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    rowClassName="merchant-row"
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
