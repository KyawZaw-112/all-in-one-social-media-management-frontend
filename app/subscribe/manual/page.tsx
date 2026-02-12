"use client";

import { useState } from "react";
import {
    Card,
    Button,
    Typography,
    Input,
    Upload,
    Space,
    message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import supabase from "@/lib/supabase";

const { Title, Text } = Typography;

export default function ManualPaymentPage() {
    const [reference, setReference] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);



    const submitPayment = async () => {
        try {
            if (!file) {
                message.error("Please upload transfer screenshot");
                return;
            }

            if (!reference) {
                message.error("Please enter reference number");
                return;
            }

            setLoading(true);

            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                message.error("Please login first");
                return;
            }

            const userId = session.user.id;

            const fileExt = file.name.split(".").pop();
            const filePath = `${userId}/${Date.now()}.${fileExt}`;

            console.log({
                user_id: userId,
                reference,
                plan: "monthly",
                amount: 29,
                proof_url: filePath,
            });


            const { error: uploadError } = await supabase.storage
                .from("payment-proofs")
                .upload(filePath, file);

            if (uploadError) {
                message.error("Upload failed");
                return;
            }

            const response = await fetch("/api/payments/manual", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: userId,
                    reference,
                    plan: "monthly",
                    amount: 29,
                    proof_url: filePath,
                }),
            });

            if (!response.ok) {
                message.error("Failed to save payment");
                return;
            }

            message.success("Payment submitted. Await admin approval.");
            setReference("");
            setFile(null);
        } catch (err) {
            message.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{ maxWidth: 500, margin: "100px auto" }}>
            <Card>
                <Space orientation="vertical" size={16} style={{ width: "100%" }}>
                    <Title level={3}>Manual Payment</Title>

                    <Text>
                        Transfer $29 to:
                        <br />
                        Bank: KBZ
                        <br />
                        Account: 123-456
                    </Text>

                    <Input
                        placeholder="Reference number"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                    />

                    <Upload
                        beforeUpload={(file) => {
                            setFile(file);
                            return false; // prevent auto upload
                        }}
                        maxCount={1}
                        showUploadList
                    >
                        <Button icon={<UploadOutlined />}>
                            Upload Screenshot
                        </Button>
                    </Upload>

                    <Button
                        type="primary"
                        block
                        loading={loading}
                        onClick={submitPayment}
                    >
                        Submit Payment
                    </Button>
                </Space>
            </Card>
        </div>
    );
}
