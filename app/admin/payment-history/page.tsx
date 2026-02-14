"use client";

import { useEffect, useState } from "react";
import { Table, Tag, Button, Space, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import  supabase  from "@/lib/supabase";

const { Title } = Typography;

interface Payment {
    id: string;
    amount: number;
    currency: string;
    plan: string;
    status: string;
    created_at: string;
    approved_at: string | null;
    proof_url: string | null;
    payment_provider: string;
}

export default function PaymentsPage() {
    const [data, setData] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setLoading(true);

        const {
            data: { session },
        } = await supabase.auth.getSession();

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/my-history`,
            {
                headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                },
            }
        );

        const result = await res.json();
        setData(result);
        setLoading(false);
    };

    const columns: ColumnsType<Payment> = [
        {
            title: "Date",
            dataIndex: "created_at",
            render: (value) => dayjs(value).format("DD MMM YYYY"),
            sorter: (a, b) =>
                dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
        },
        {
            title: "Plan",
            dataIndex: "plan",
            render: (plan) => <Tag color="blue">{plan?.toUpperCase()}</Tag>,
        },
        {
            title: "Amount",
            render: (_, record) => (
                <strong>
                    {record.currency} {record.amount}
                </strong>
            ),
        },
        {
            title: "Method",
            dataIndex: "payment_provider",
            render: (method) => <Tag color="purple">{method}</Tag>,
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (status) => {
                const color =
                    status === "approved"
                        ? "green"
                        : status === "pending"
                            ? "orange"
                            : "red";

                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: "Proof",
            dataIndex: "proof_url",
            render: (url) =>
                url ? (
                    <a
                        href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${url}`}
                        target="_blank"
                    >
                        View
                    </a>
                ) : (
                    "-"
                ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Title level={3}>Payment History</Title>

                <Button type="primary">
                    Download PDF
                </Button>
            </Space>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
                bordered
            />
        </div>
    );
}
