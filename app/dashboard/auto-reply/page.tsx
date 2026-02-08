"use client";

import { Card, Button, Input, Switch, Space, Typography, Table } from "antd";
import { useState } from "react";

const { Title } = Typography;

export default function AutoReplyPage() {
    const [rules, setRules] = useState([
        { key: 1, keyword: "price", reply: "Please check our pricing page 💰", enabled: true },
        { key: 2, keyword: "hello", reply: "Hi 👋 How can we help you?", enabled: false },
    ]);

    const columns = [
        { title: "Keyword", dataIndex: "keyword" },
        { title: "Reply", dataIndex: "reply" },
        {
            title: "Enabled",
            render: (_: any, record: any) => (
                <Switch defaultChecked={record.enabled} />
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>Facebook Auto-Replies</Title>

            <Card style={{ marginBottom: 24 }}>
                <Space>
                    <Input placeholder="Keyword (e.g. price)" />
                    <Input placeholder="Auto reply message" />
                    <Button type="primary">Add Rule</Button>
                </Space>
            </Card>

            <Table columns={columns} dataSource={rules} />
        </div>
    );
}
