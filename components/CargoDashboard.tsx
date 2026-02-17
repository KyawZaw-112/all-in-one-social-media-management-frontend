"use client";

import { Card, Table, Tag, Button, Space, Statistic, Steps, Typography } from "antd";
import { CarOutlined, ScanOutlined, FieldTimeOutlined, EnvironmentOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function CargoDashboard() {
    // Dummy Data for Demo
    const shipments = [
        { key: '1', tracking: 'SH-2026-001', customer: 'Ma Hla Myaing', destination: 'Yangon', status: 'In Transit' },
        { key: '2', tracking: 'SH-2026-002', customer: 'Ko Phyo', destination: 'Mandalay', status: 'Pending' },
        { key: '3', tracking: 'SH-2026-003', customer: 'Daw Sein', destination: 'Taunggyi', status: 'Delivered' },
    ];

    const columns = [
        { title: 'Tracking #', dataIndex: 'tracking', key: 'tracking', render: (text: string) => <Tag color="blue">{text}</Tag> },
        { title: 'Customer', dataIndex: 'customer', key: 'customer' },
        { title: 'Destination', dataIndex: 'destination', key: 'destination', render: (text: string) => <Tag icon={<EnvironmentOutlined />} color="cyan">{text}</Tag> },
        {
            title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => {
                let color = status === 'Delivered' ? 'green' : status === 'In Transit' ? 'geekblue' : 'volcano';
                return <Tag color={color} key={status}>{status.toUpperCase()}</Tag>;
            }
        },
    ];

    return (
        <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>🚚 Cargo Management</Title>
                <Button type="primary" icon={<ScanOutlined />} style={{ borderRadius: 8 }}>Create Shipment</Button>
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                <Card style={{ flex: 1 }}>
                    <Statistic title="Active Shipments" value={15} prefix={<CarOutlined />} valueStyle={{ color: '#1890ff' }} />
                </Card>
                <Card style={{ flex: 1 }}>
                    <Statistic title="Completed Today" value={8} prefix={<FieldTimeOutlined />} valueStyle={{ color: '#52c41a' }} />
                </Card>
                <Card style={{ flex: 1 }}>
                    <Statistic title="Pending Revenue" value="250,000" suffix="MMK" valueStyle={{ color: '#faad14' }} />
                </Card>
            </div>

            <Card title="Latest Shipments" bordered={false} style={{ borderRadius: 12 }}>
                <Table dataSource={shipments} columns={columns} pagination={false} />
            </Card>

            <div style={{ marginTop: 24, padding: 24, background: '#fff', borderRadius: 12 }}>
                <Title level={5}>Quick Process Flow</Title>
                <Steps
                    current={1}
                    size="small"
                    items={[
                        { title: 'New Order', description: 'Customer requests via FB' },
                        { title: 'Confirm Details', description: 'Weight & Destination' },
                        { title: 'Generate Tracking', description: 'Issue tracking number' },
                        { title: 'Delivery', description: 'Handover to driver' },
                    ]}
                />
            </div>
        </div>
    );
}
