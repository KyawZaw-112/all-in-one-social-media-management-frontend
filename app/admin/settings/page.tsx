"use client";

import { Card, Typography, Form, Input, Button, Switch, Divider, message } from "antd";

const { Title, Text } = Typography;

export default function SettingsPage() {
    const onFinish = () => {
        message.success("Settings updated successfully! ⚙️");
    };

    return (
        <div style={{ maxWidth: 800 }}>
            <Title level={2}>⚙️ Global Settings</Title>
            <Text type="secondary">Control system-wide configurations and platform defaults.</Text>

            <Card style={{ marginTop: 24, borderRadius: 16 }}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Title level={4}>Platform Maintenance</Title>
                    <Form.Item label="Maintenance Mode" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Text type="secondary">When enabled, only admins can access the platform.</Text>

                    <Divider />

                    <Title level={4}>Subscription Defaults</Title>
                    <Form.Item label="Free Trial Days" initialValue={7}>
                        <Input type="number" suffix="Days" />
                    </Form.Item>

                    <Form.Item label="Support Email" initialValue="support@autoreply.biz">
                        <Input />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" size="large">
                        Update Settings
                    </Button>
                </Form>
            </Card>
        </div>
    );
}
