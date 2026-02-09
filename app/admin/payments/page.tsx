"use client";

import { useEffect, useState } from "react";
import { Table, Button, Tag, message } from "antd";
import { getPendingPayments, approvePayment } from "@/lib/admin";

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);
        const data = await getPendingPayments();
        setPayments(data);
        setLoading(false);
    }

    async function handleApprove(payment) {
        await approvePayment(payment);
        message.success("Payment approved");
        load();
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Pending Payments</h2>

            <Table
                loading={loading}
                rowKey="id"
                dataSource={payments}
                pagination={false}
                columns={[
                    {
                        title: "User",
                        dataIndex: ["users", "email"],
                    },
                    {
                        title: "Plan",
                        dataIndex: "plan",
                        render: (plan) => <Tag color="blue">{plan}</Tag>,
                    },
                    {
                        title: "Reference",
                        dataIndex: "reference",
                    },
                    {
                        title: "Created",
                        dataIndex: "created_at",
                        render: (d) => new Date(d).toLocaleString(),
                    },
                    {
                        title: "Action",
                        render: (_, record) => (
                            <Button
                                type="primary"
                                onClick={() => handleApprove(record)}
                            >
                                Approve
                            </Button>
                        ),
                    },
                ]}
            />
        </div>
    );
}
