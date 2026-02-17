"use client";

import { Card, Typography, Table, Tag } from "antd";

const { Title, Text } = Typography;

export default function SubscriptionsPage() {
    return (
        <div>
            <Title level={2}>💳 Active Subscriptions</Title>
            <Text type="secondary">View and manage all active recurring subscriptions.</Text>

            <Card style={{ marginTop: 24, borderRadius: 16 }}>
                <Table
                    dataSource={[]}
                    columns={[
                        { title: "Merchant", dataIndex: "merchant", key: "merchant" },
                        { title: "Plan", dataIndex: "plan", key: "plan" },
                        { title: "Next Billing", dataIndex: "next_billing", key: "next_billing" },
                        { title: "Status", dataIndex: "status", key: "status" },
                    ]}
                    locale={{ emptyText: "Subscription tracking will be available after payment gateway integration." }}
                />
            </Card>
        </div>
    );
}
