"use client";

import { useState, useEffect } from "react";
import {
    Card, Table, Tag, Button, Input, Select, Space, Typography,
    message, Modal, Drawer, Descriptions, Badge, Tooltip, Row, Col,
    Statistic, Spin, Empty
} from "antd";
import {
    UserOutlined, TagOutlined, SearchOutlined, PlusOutlined,
    ArrowLeftOutlined, StarOutlined, StopOutlined,
    PhoneOutlined, EnvironmentOutlined, ShoppingCartOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import axios from "axios";
import { API_URL } from "@/lib/apiConfig";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function CustomersPage() {
    const router = useRouter();
    const [customers, setCustomers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [tagFilter, setTagFilter] = useState<string | undefined>(undefined);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [tagModalOpen, setTagModalOpen] = useState(false);
    const [newTag, setNewTag] = useState("");
    const [tagCustomerId, setTagCustomerId] = useState<string | null>(null);

    const getToken = () => localStorage.getItem("authToken");

    const fetchCustomers = async () => {
        try {
            const params: any = {};
            if (search) params.search = search;
            if (statusFilter) params.status = statusFilter;
            if (tagFilter) params.tag = tagFilter;
            const res = await axios.get(`${API_URL}/api/customers`, {
                headers: { Authorization: `Bearer ${getToken()}` },
                params
            });
            setCustomers(res.data.data || []);
        } catch (err: any) {
            console.error("Failed to fetch customers", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/customers/stats`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setStats(res.data.data);
        } catch (err) { }
    };

    useEffect(() => { fetchCustomers(); fetchStats(); }, [search, statusFilter, tagFilter]);

    const openDetail = async (record: any) => {
        setDetailLoading(true);
        setDrawerOpen(true);
        try {
            const res = await axios.get(`${API_URL}/api/customers/${record.id}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setSelectedCustomer(res.data.data);
        } catch (err) {
            message.error("Failed to load customer details");
        } finally {
            setDetailLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await axios.patch(`${API_URL}/api/customers/${id}`, { status }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            message.success(`Status updated to ${status}`);
            fetchCustomers();
            fetchStats();
        } catch (err) {
            message.error("Failed to update status");
        }
    };

    const addTag = async () => {
        if (!newTag || !tagCustomerId) return;
        try {
            await axios.post(`${API_URL}/api/customers/${tagCustomerId}/tags`, { tag: newTag }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            message.success(`Tag "${newTag}" added`);
            setNewTag("");
            setTagModalOpen(false);
            fetchCustomers();
        } catch (err) {
            message.error("Failed to add tag");
        }
    };

    const removeTag = async (customerId: string, tag: string) => {
        try {
            await axios.delete(`${API_URL}/api/customers/${customerId}/tags/${tag}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            message.success(`Tag "${tag}" removed`);
            fetchCustomers();
        } catch (err) {
            message.error("Failed to remove tag");
        }
    };

    const statusColors: Record<string, string> = {
        active: "green", vip: "gold", blocked: "red", inactive: "default"
    };

    const columns = [
        {
            title: "Customer", dataIndex: "name", key: "name",
            render: (name: string, record: any) => (
                <a onClick={() => openDetail(record)} style={{ fontWeight: 500 }}>
                    <UserOutlined style={{ marginRight: 8 }} />
                    {name || "Unknown"}
                </a>
            )
        },
        { title: "Phone", dataIndex: "phone", key: "phone", render: (v: string) => v || "—" },
        {
            title: "Status", dataIndex: "status", key: "status",
            render: (status: string, record: any) => (
                <Select
                    value={status}
                    size="small"
                    style={{ width: 100 }}
                    onChange={(val) => updateStatus(record.id, val)}
                    options={[
                        { value: "active", label: "Active" },
                        { value: "vip", label: "⭐ VIP" },
                        { value: "blocked", label: "🚫 Blocked" },
                        { value: "inactive", label: "Inactive" }
                    ]}
                />
            )
        },
        {
            title: "Orders", dataIndex: "total_orders", key: "total_orders",
            sorter: (a: any, b: any) => a.total_orders - b.total_orders,
            render: (v: number) => <Badge count={v || 0} style={{ backgroundColor: "#6366f1" }} />
        },
        {
            title: "Tags", dataIndex: "tags", key: "tags",
            render: (tags: string[], record: any) => (
                <Space wrap size={[4, 4]}>
                    {(tags || []).map(tag => (
                        <Tag
                            key={tag}
                            closable
                            onClose={() => removeTag(record.id, tag)}
                            color="blue"
                        >{tag}</Tag>
                    ))}
                    <Tag
                        style={{ cursor: "pointer", borderStyle: "dashed" }}
                        onClick={() => { setTagCustomerId(record.id); setTagModalOpen(true); }}
                    ><PlusOutlined /> Add</Tag>
                </Space>
            )
        },
        {
            title: "Last Seen", dataIndex: "last_seen_at", key: "last_seen_at",
            render: (v: string) => v ? dayjs(v).format("MMM D, YYYY") : "—",
            sorter: (a: any, b: any) => new Date(a.last_seen_at).getTime() - new Date(b.last_seen_at).getTime()
        }
    ];

    // Collect all unique tags for filter dropdown
    const allTags = [...new Set(customers.flatMap(c => c.tags || []))];

    return (
        <AuthGuard>
            <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px 24px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    {/* Header */}
                    <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => router.push("/dashboard")} style={{ marginBottom: 8 }}>Dashboard</Button>
                            <Title level={2} style={{ margin: 0, fontWeight: 300 }}>👥 Customer CRM</Title>
                            <Text type="secondary">Manage, segment, and tag your customers</Text>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
                        <Col xs={12} sm={6}>
                            <Card bordered={false} style={{ borderRadius: 16, background: "#eef2ff" }}>
                                <Statistic title="Total" value={stats?.total || 0} valueStyle={{ color: "#6366f1" }} prefix={<UserOutlined />} />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card bordered={false} style={{ borderRadius: 16, background: "#fefce8" }}>
                                <Statistic title="VIP" value={stats?.vip || 0} valueStyle={{ color: "#eab308" }} prefix={<StarOutlined />} />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card bordered={false} style={{ borderRadius: 16, background: "#ecfdf5" }}>
                                <Statistic title="New This Month" value={stats?.new_this_month || 0} valueStyle={{ color: "#10b981" }} prefix={<PlusOutlined />} />
                            </Card>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Card bordered={false} style={{ borderRadius: 16, background: "#fef2f2" }}>
                                <Statistic title="Blocked" value={stats?.blocked || 0} valueStyle={{ color: "#ef4444" }} prefix={<StopOutlined />} />
                            </Card>
                        </Col>
                    </Row>

                    {/* Filters */}
                    <Card bordered={false} style={{ borderRadius: 16, marginBottom: 24 }}>
                        <Space wrap size="middle">
                            <Input
                                placeholder="Search name or phone..."
                                prefix={<SearchOutlined />}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ width: 250 }}
                                allowClear
                            />
                            <Select
                                placeholder="Status"
                                value={statusFilter}
                                onChange={setStatusFilter}
                                allowClear
                                style={{ width: 140 }}
                                options={[
                                    { value: "active", label: "Active" },
                                    { value: "vip", label: "⭐ VIP" },
                                    { value: "blocked", label: "🚫 Blocked" },
                                    { value: "inactive", label: "Inactive" }
                                ]}
                            />
                            {allTags.length > 0 && (
                                <Select
                                    placeholder="Filter by Tag"
                                    value={tagFilter}
                                    onChange={setTagFilter}
                                    allowClear
                                    style={{ width: 160 }}
                                    options={allTags.map(t => ({ value: t, label: t }))}
                                />
                            )}
                        </Space>
                    </Card>

                    {/* Table */}
                    <Card bordered={false} style={{ borderRadius: 16 }}>
                        <Table
                            columns={columns}
                            dataSource={customers}
                            rowKey="id"
                            loading={loading}
                            pagination={{ pageSize: 20, showSizeChanger: true }}
                            locale={{
                                emptyText: <Empty description="No customers yet. They'll appear here after completing orders via Messenger." />
                            }}
                        />
                    </Card>
                </div>

                {/* Add Tag Modal */}
                <Modal
                    title="Add Tag"
                    open={tagModalOpen}
                    onOk={addTag}
                    onCancel={() => { setTagModalOpen(false); setNewTag(""); }}
                    okText="Add"
                >
                    <Input
                        placeholder="Enter tag name (e.g. repeat-buyer, wholesale)"
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        onPressEnter={addTag}
                        prefix={<TagOutlined />}
                    />
                </Modal>

                {/* Customer Detail Drawer */}
                <Drawer
                    title="Customer Details"
                    open={drawerOpen}
                    onClose={() => { setDrawerOpen(false); setSelectedCustomer(null); }}
                    width={520}
                >
                    {detailLoading ? <Spin /> : selectedCustomer && (
                        <div>
                            <Descriptions column={1} bordered size="small">
                                <Descriptions.Item label="Name">{selectedCustomer.name || "—"}</Descriptions.Item>
                                <Descriptions.Item label="Phone">{selectedCustomer.phone || "—"}</Descriptions.Item>
                                <Descriptions.Item label="Address">{selectedCustomer.address || "—"}</Descriptions.Item>
                                <Descriptions.Item label="Status">
                                    <Tag color={statusColors[selectedCustomer.status]}>{selectedCustomer.status?.toUpperCase()}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Total Orders">{selectedCustomer.total_orders || 0}</Descriptions.Item>
                                <Descriptions.Item label="Total Spent">{selectedCustomer.total_spent || 0} Ks</Descriptions.Item>
                                <Descriptions.Item label="First Seen">{selectedCustomer.first_seen_at ? dayjs(selectedCustomer.first_seen_at).format("MMM D, YYYY") : "—"}</Descriptions.Item>
                                <Descriptions.Item label="Last Seen">{selectedCustomer.last_seen_at ? dayjs(selectedCustomer.last_seen_at).format("MMM D, YYYY HH:mm") : "—"}</Descriptions.Item>
                                <Descriptions.Item label="Source">{selectedCustomer.source || "—"}</Descriptions.Item>
                            </Descriptions>

                            <Title level={5} style={{ marginTop: 24 }}>Tags</Title>
                            <Space wrap>
                                {(selectedCustomer.tags || []).map((tag: string) => (
                                    <Tag key={tag} color="blue" closable onClose={() => removeTag(selectedCustomer.id, tag)}>{tag}</Tag>
                                ))}
                                <Tag style={{ cursor: "pointer", borderStyle: "dashed" }} onClick={() => { setTagCustomerId(selectedCustomer.id); setTagModalOpen(true); }}>
                                    <PlusOutlined /> Add Tag
                                </Tag>
                            </Space>

                            {selectedCustomer.orders?.length > 0 && (
                                <>
                                    <Title level={5} style={{ marginTop: 24 }}>Order History</Title>
                                    <Table
                                        size="small"
                                        dataSource={selectedCustomer.orders}
                                        rowKey="id"
                                        pagination={false}
                                        columns={[
                                            { title: "Order#", dataIndex: "order_no", key: "order_no" },
                                            { title: "Item", dataIndex: "item_name", key: "item_name" },
                                            { title: "Qty", dataIndex: "quantity", key: "quantity" },
                                            {
                                                title: "Status", dataIndex: "status", key: "status",
                                                render: (s: string) => <Tag color={s === 'approved' ? 'green' : s === 'pending' ? 'orange' : 'default'}>{s}</Tag>
                                            },
                                            { title: "Date", dataIndex: "created_at", key: "created_at", render: (v: string) => dayjs(v).format("MMM D") }
                                        ]}
                                    />
                                </>
                            )}
                        </div>
                    )}
                </Drawer>
            </div>
        </AuthGuard>
    );
}
