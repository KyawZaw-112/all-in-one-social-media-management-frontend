"use client";

import {useEffect, useState} from "react";
import {Table, Tag, Button, Space, Card, Typography, message} from "antd";
import supabase from "@/lib/supabase";
import { Modal } from "antd";
import Image from "next/image";
const {Title} = Typography;

export default function PaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fetchPayments = async () => {
        const {
            data: {session},
        } = await supabase.auth.getSession();

        if (!session) return;

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/payments/pending`,
            {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            }
        );

        const data = await res.json();

        setPayments(data || []);
        setLoading(false);
    };

    console.log("Payments:", payments);

    const getProofUrl = async (path: string) => {
        const { data, error } = await supabase.storage
            .from("payment-proofs")
            .createSignedUrl(path, 300);

        if (error) {
            console.error("Signed URL error:", error);
            return null;
        }

        return data.signedUrl;
    };

    const approvePayment = async (id: string) => {
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/payments/approve/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.access_token}`,
                    },
                    body: JSON.stringify({}),
                }
            );

            if (!res.ok) throw new Error("Failed");

            fetchPayments();
        } catch (err) {
            console.error(err);
        }
    };


    const rejectPayment = async (id: string) => {
        const {
            data: {session},
        } = await supabase.auth.getSession();

        await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/payments/reject`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({paymentId: id}),
            }
        );

        fetchPayments();
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const columns = [
        {
            title: "No",
            dataIndex: "no",
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: "Transaction Id",
            dataIndex: "transaction_id",
        },
        {
            title: "Payment Method",
            dataIndex: "method",
        },
        {title: "Amount", dataIndex: "amount",},
        {
            title: "Proof",
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={async () => {
                        const url = await getProofUrl(record.proof_url);
                        if (url) setPreview(url);
                    }}
                >
                    View
                </Button>
            ),
        },

        {title: "User ID", dataIndex: "user_id"},
        {
            title: "Status",
            dataIndex: "status",
            render: (status: string) => {
                const color =
                    status === "approved"
                        ? "green"
                        : status === "rejected"
                            ? "red"
                            : "orange";

                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: "Actions",
            render: (_: any, record: any) =>
                record.status === "pending" && (
                    <Space>
                        <Button
                            type="primary"
                            loading={processingId === record.id}
                            onClick={() => approvePayment(record.id)}
                        >
                            Approve
                        </Button>
                        <Button
                            danger
                            onClick={() => rejectPayment(record.id)}
                        >
                            Reject
                        </Button>
                    </Space>
                ),
        },
    ];

    return (
        <Card>
            <Title level={3}>Payment Approvals</Title>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={payments}
                loading={loading}
            />
            <Modal
                open={!!preview}
                footer={null}
                onCancel={() => setPreview(null)}
                width={800}
            >
                {preview && (
                    <Image
                        src={preview}
                        alt="Payment Proof"
                        width={1000}
                        height={400}
                        style={{ width: "100%", height: "auto", borderRadius: 8 }}
                        priority
                    />
                )}
            </Modal>


        </Card>
    );
}
