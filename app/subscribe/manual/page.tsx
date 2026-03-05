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
import AuthGuard from "@/components/AuthGuard";
import InvoiceModal from "@/components/InvoiceModal";
import dayjs from "dayjs";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const { Title, Text } = Typography;

export default function ManualPaymentPage() {
    const { t, language } = useLanguage();
    const [reference, setReference] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [monthCount, setMonthCount] = useState(1);
    const PRICE_PER_MONTH = 500;
    const BAHT_TO_MMK = 155;
    const [payment_provider, setPaymentProvider] = useState("KPlus");

    const baseAmountBaht = monthCount * PRICE_PER_MONTH;

    // Invoice State
    const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);
    const [invoiceData, setInvoiceData] = useState<any>(null);

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

            // 🔥 Get token from localStorage (Express Auth pattern)
            const token = localStorage.getItem("authToken");
            const userData = localStorage.getItem("user");

            if (!token || !userData) {
                message.error("Please login first");
                return;
            }

            const user = JSON.parse(userData);
            const userId = user.id;

            // 🔥 Ensure Supabase client is aware of the session for storage upload
            // We use a try-catch for setSession to avoid blocking valid tokens
            try {
                await supabase.auth.setSession({
                    access_token: token,
                    refresh_token: "", // not strictly required for storage upload if access_token is valid
                });
            } catch (sessionError) {
                console.warn("Supabase Session Sync Warning:", sessionError);
                // We don't return here because upload might still work if headers are set or if it's intermittent
            }

            const finalAmount = payment_provider === "KPlus" ? baseAmountBaht : baseAmountBaht * BAHT_TO_MMK;

            const fileExt = file.name.split(".").pop();
            const filePath = `${userId}/${Date.now()}.${fileExt}`;

            console.log("📤 Uploading proof to path:", filePath);

            const { error: uploadError } = await supabase.storage
                .from("payment-proofs")
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error("Full Upload Error Object:", uploadError);
                message.error(`Upload failed: ${uploadError.message}. If this is an RLS error, please run the setup_payment_storage.sql script in Supabase Dashboard.`);
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/manual`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    reference,
                    plan: `${monthCount} months`,
                    amount: finalAmount,
                    currency: payment_provider === "KPlus" ? "THB" : "MMK",
                    payment_provider: payment_provider,
                    proof_url: filePath,
                    metadata: {
                        monthCount,
                        pageCount: 1
                    }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                message.error(errorData.error || "Failed to save payment");
                return;
            }

            message.success("Payment submitted. Await admin approval. ✅");

            // Set invoice data for the modal
            setInvoiceData({
                userId: user.id,
                userName: user.user_metadata?.full_name || user.email,
                userEmail: user.email,
                amount: getDisplayAmount(),
                reference: reference,
                provider: payment_provider,
                date: dayjs().format('DD MMM YYYY, HH:mm'),
                plan: `${monthCount} Month${monthCount > 1 ? 's' : ''} Pro (1 Page)`
            });
            setIsInvoiceVisible(true);

            setReference("");
            setFile(null);
        } catch (err: any) {
            console.error("Payment Submission Error:", err);
            message.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    return (
        <AuthGuard>
            <div style={{ maxWidth: 500, margin: "50px auto", padding: "0 20px" }}>
                <Card style={{ borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                    <Space direction="vertical" size={24} style={{ width: "100%" }}>
                        <div style={{ textAlign: "center" }}>
                            <Title level={2} style={{ margin: 0 }}>💳 Manual Payment</Title>
                            <Text type="secondary">လစဉ်ကြေး ပေးဆောင်ရန် အချက်အလက်များ</Text>
                        </div>

                        <div style={{ background: "#f9f9f9", borderRadius: 12, padding: 16, border: "1px solid #f0f0f0" }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>{language === 'my' ? "သက်တမ်းရွေးချယ်ပါ (လ)" : "Select Duration (Months)"}</Text>
                            <Segmented
                                block
                                value={monthCount}
                                onChange={(value) => setMonthCount(value as number)}
                                options={[
                                    { label: '1 Month', value: 1 },
                                    { label: '3 Months', value: 3 },
                                    { label: '6 Months', value: 6 },
                                    { label: '12 Months', value: 12 },
                                ]}
                            />
                        </div>

                        <Card style={{ background: "#f9f9f9", borderRadius: 12, textAlign: "center", border: "1px dashed #d9d9d9" }}>
                            <Text type="secondary" style={{ fontSize: 14 }}>
                                Total Amount to Pay ({monthCount} Month{monthCount > 1 ? 's' : ''})
                            </Text>
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

                            {invoiceData && (
                                <Button
                                    type="default"
                                    block
                                    style={{ marginTop: 8, borderColor: '#722ed1', color: '#722ed1' }}
                                    onClick={() => setIsInvoiceVisible(true)}
                                >
                                    View Last Invoice
                                </Button>
                            )}
                        </div>
                    </Space>
                </Card>

                <InvoiceModal
                    visible={isInvoiceVisible}
                    onClose={() => setIsInvoiceVisible(false)}
                    paymentData={invoiceData}
                />
            </div>
        </AuthGuard>
    );
}
