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
    Segmented,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import supabase from "@/lib/supabase";
import { Dropdown } from 'antd';
import Image from "next/image";

const { Title, Text } = Typography;

export default function ManualPaymentPage() {
    const [reference, setReference] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [baseAmountBaht] = useState(2000);
    const BAHT_TO_MMK = 155; // Update rate here
    const [payment_provider, setPaymentProvider] = useState("KPlus");

    const getDisplayAmount = () => {
        if (payment_provider === "KPlus") {
            return `${baseAmountBaht.toLocaleString()} Baht`;
        }
        return `${(baseAmountBaht * BAHT_TO_MMK).toLocaleString()} ကျပ်`;
    };


    const submitPayment = async () => {
        try {
            if (payment_provider === "") {
                message.error("Please select payment provider");
                return;
            }
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
            const finalAmount = payment_provider === "KPlus" ? baseAmountBaht : baseAmountBaht * BAHT_TO_MMK;

            const fileExt = file.name.split(".").pop();
            const filePath = `${userId}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("payment-proofs")
                .upload(filePath, file);

            if (uploadError) {
                message.error("Upload failed");
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/manual`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    user_id: userId,
                    reference,
                    plan: "monthly",
                    amount: finalAmount,
                    currency: payment_provider === "KPlus" ? "THB" : "MMK",
                    payment_provider: payment_provider,
                    proof_url: filePath,
                }),
            });

            if (!response.ok) {
                message.error("Failed to save payment");
                return;
            }

            message.success("Payment submitted. Await admin approval. ✅");
            setReference("");
            setFile(null);
        } catch (err) {
            message.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{ maxWidth: 500, margin: "50px auto", padding: "0 20px" }}>
            <Card style={{ borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <Space orientation="vertical" size={24} style={{ width: "100%" }}>
                    <div style={{ textAlign: "center" }}>
                        <Title level={2} style={{ margin: 0 }}>💳 Manual Payment</Title>
                        <Text type="secondary">လစဉ်ကြေး ပေးဆောင်ရန် အချက်အလက်များ</Text>
                    </div>

                    <Card style={{ background: "#f9f9f9", borderRadius: 12, textAlign: "center", border: "1px dashed #d9d9d9" }}>
                        <Text type="secondary" style={{ fontSize: 14 }}>Total Amount to Pay</Text>
                        <div style={{ fontSize: 32, fontWeight: 800, color: "#722ed1" }}>
                            {getDisplayAmount()}
                        </div>
                        {payment_provider !== "KPlus" && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                (Exchange Rate: 1 Baht = {BAHT_TO_MMK} MMK)
                            </Text>
                        )}
                    </Card>

                    <div>
                        <Text strong style={{ display: "block", marginBottom: 8 }}>၁။ ငွေလွှဲမည့် နည်းလမ်းကို ရွေးချယ်ပါ</Text>
                        <Segmented
                            block
                            value={payment_provider}
                            onChange={(value) => setPaymentProvider(value as string)}
                            options={[
                                { label: 'KPlus', value: 'KPlus' },
                                { label: 'KBZ Pay', value: 'KBZ' },
                                { label: 'Wave Pay', value: 'WAVE' },
                            ]}
                        />
                    </div>

                    <div style={{ background: "#fff", padding: "16px", borderRadius: 12, border: "1px solid #f0f0f0" }}>
                        <Text strong style={{ display: "block", marginBottom: 12 }}>၂။ အောက်ပါအကောင့်သို့ ငွေလွှဲပေးပါ</Text>

                        {payment_provider === "KPlus" && (
                            <div style={{ textAlign: "center" }}>
                                <div style={{ marginBottom: 16, textAlign: "left", background: "#f0fdf4", padding: 12, borderRadius: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Account Name</Text>
                                    <div style={{ fontWeight: "bold", fontSize: 16 }}>Kyaw Zaw Win</div>
                                    <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: "block" }}>KPlus Number</Text>
                                    <div style={{ fontWeight: "bold", fontSize: 16 }}>082-XXX-XXXX</div>
                                </div>
                                <div style={{ position: "relative", width: "100%", height: 350, borderRadius: 12, overflow: "hidden", border: "1px solid #eee" }}>
                                    <Image src="/kplus.jpg" alt="KPlus QR Code" fill style={{ objectFit: "contain" }} />
                                </div>
                                <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: "block" }}>Scan QR Code to pay</Text>
                            </div>
                        )}

                        {payment_provider === "KBZ" && (
                            <div style={{ textAlign: "center" }}>
                                <div style={{ marginBottom: 16, textAlign: "left", background: "#f0f7ff", padding: 12, borderRadius: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Account Name</Text>
                                    <div style={{ fontWeight: "bold", fontSize: 16 }}>Kyaw Zaw Win</div>
                                    <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: "block" }}>KPay Number</Text>
                                    <div style={{ fontWeight: "bold", fontSize: 16 }}>09 973302141</div>
                                </div>
                                <div style={{ position: "relative", width: "100%", height: 350, borderRadius: 12, overflow: "hidden", border: "1px solid #eee" }}>
                                    <Image src="/k-pay.jpg" alt="KBZ QR Code" fill style={{ objectFit: "contain" }} />
                                </div>
                            </div>
                        )}

                        {payment_provider === "WAVE" && (
                            <div style={{ textAlign: "center" }}>
                                <div style={{ marginBottom: 16, textAlign: "left", background: "#fff7ed", padding: 12, borderRadius: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Account Name</Text>
                                    <div style={{ fontWeight: "bold", fontSize: 16 }}>Kyaw Zaw Win</div>
                                    <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: "block" }}>Wave Number</Text>
                                    <div style={{ fontWeight: "bold", fontSize: 16 }}>09973302141</div>
                                </div>
                                <div style={{ position: "relative", width: "100%", height: 350, borderRadius: 12, overflow: "hidden", border: "1px solid #eee" }}>
                                    <Image src="/wave-pay.jpg" alt="WAVE QR Code" fill style={{ objectFit: "contain" }} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <Text strong style={{ display: "block", marginBottom: 8 }}>၃။ ငွေလွှဲလက်ခံဖြတ်ပိုင်း တင်ပေးပါ</Text>

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
                            style={{ marginTop: 16 }}
                        >
                            Submit Payment
                        </Button>
                    </div>
                </Space>
            </Card>
        </div>
    );
}
