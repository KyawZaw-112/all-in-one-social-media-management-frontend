"use client";

import { Card, Typography, Row, Col, Progress, Statistic } from "antd";
import { ThunderboltOutlined, BugOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function AnalyticsPage() {
    return (
        <div>
            <Title level={2}>📊 System Health & Analytics</Title>
            <Text type="secondary">Real-time infrastructure monitoring and performance metrics.</Text>

            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col span={8}>
                    <Card style={{ borderRadius: 16 }}>
                        <Statistic
                            title="Server Uptime"
                            value={99.9}
                            precision={2}
                            suffix="%"
                            prefix={<ThunderboltOutlined style={{ color: '#52c41a' }} />}
                        />
                        <Progress percent={99.9} status="active" strokeColor="#52c41a" showInfo={false} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card style={{ borderRadius: 16 }}>
                        <Statistic
                            title="API Response Time"
                            value={120}
                            suffix="ms"
                            prefix={<SafetyCertificateOutlined style={{ color: '#1890ff' }} />}
                        />
                        <Text type="secondary">Stable across all regions</Text>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card style={{ borderRadius: 16 }}>
                        <Statistic
                            title="Open Issues"
                            value={0}
                            prefix={<BugOutlined style={{ color: '#f5222d' }} />}
                        />
                        <Text type="success">System operating normally</Text>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
