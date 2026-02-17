"use client";

import { Card, Table, Tag, Button, Space, Statistic, Row, Col, Typography } from "antd";
import { ShoppingOutlined, DollarOutlined, DropboxOutlined, PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function WarehouseDashboard() {
    // Dummy Data for Demo
    const products = [
        { key: '1', name: 'Premium Lipstick', stock: 45, price: '15,000 MMK', status: 'In Stock' },
        { key: '2', name: 'Face Wash', stock: 12, price: '8,500 MMK', status: 'Low Stock' },
        { key: '3', name: 'Suncream', stock: 0, price: '12,000 MMK', status: 'Out of Stock' },
    ];

    const columns = [
        { title: 'Product Name', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong>{text}</Text> },
        {
            title: 'Stock', dataIndex: 'stock', key: 'stock', render: (stock: number) => (
                stock > 10 ? <Tag color="success">{stock} units</Tag> :
                    stock > 0 ? <Tag color="warning">{stock} units</Tag> :
                        <Tag color="error">Out of Stock</Tag>
            )
        },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
    ];

    return (
        <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>📦 Online Shop Warehouse</Title>
                <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 8 }}>Add Product</Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic title="Total Products" value={124} prefix={<DropboxOutlined />} valueStyle={{ color: '#3f8600' }} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Low Stock Items" value={5} prefix={<ShoppingOutlined />} valueStyle={{ color: '#cf1322' }} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Total Value" value="4.5M" prefix={<DollarOutlined />} suffix="MMK" />
                    </Card>
                </Col>
            </Row>

            <Card title="Recent Inventory" bordered={false} style={{ borderRadius: 12 }}>
                <Table dataSource={products} columns={columns} pagination={false} />
            </Card>
        </div>
    );
}
