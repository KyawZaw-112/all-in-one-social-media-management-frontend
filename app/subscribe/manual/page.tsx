"use client";

import {useState} from "react";
import {
    Card,
    Button,
    Typography,
    Input,
    Upload,
    Space,
    message,
} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import supabase from "@/lib/supabase";
import {Dropdown} from 'antd';
import Image from "next/image.js";

const {Title, Text} = Typography;

export default function ManualPaymentPage() {
    const [reference, setReference] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(100);
    const [payment_provider, setPaymentProvider] = useState("KBZ");


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
                data: {session},
            } = await supabase.auth.getSession();

            if (!session) {
                message.error("Please login first");
                return;
            }

            const userId = session.user.id;

            const fileExt = file.name.split(".").pop();
            const filePath = `${userId}/${Date.now()}.${fileExt}`;

            const {error: uploadError} = await supabase.storage
                .from("payment-proofs")
                .upload(filePath, file);

            if (uploadError) {
                message.error("Upload failed");
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/manual`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    user_id: userId,
                    reference,
                    plan: "monthly",
                    amount: amount,
                    payment_provider: payment_provider,
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
        <div style={{maxWidth: 500, margin: "50px auto"}}>
            <Card>
                <Space orientation="vertical" size={16} style={{width: "100%"}}>
                    <Title level={3}>Manual Payment</Title>
                    <Text>
                        <div>
                            <p>
                                Transfer Amount
                            </p>
                            <b>{amount}</b> kyat
                        </div>
                        <div className={""}>
                            <p>Choose Bank Name</p>
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: 'KBZ Pay',
                                            label: 'KBZ Pay',
                                            onClick: () => setPaymentProvider('KBZ'),
                                        },
                                        {
                                            key: 'WAVE',
                                            label: 'Wave Pay',
                                            onClick: () => setPaymentProvider('WAVE'),
                                        }
                                    ],
                                }}
                            >
                                <Button>
                                    {payment_provider} ▼
                                </Button>
                            </Dropdown>
                        </div>
                        <br/>
                        <div>
                            <p>Bank Account Details</p>
                            {payment_provider === "KBZ" && (
                                <div>
                                    <div>
                                        <p>Account Name</p>
                                        <b>Kyaw Zaw Win</b>
                                        <p>Account Number</p>
                                        <b>09 973302141</b>
                                    </div>
                                    <div className={"flex "}>
                                        <p>KBZ QR CODE</p>
                                        <Image src={"/k-pay.jpg"} alt={"KBZ QR Code"} width={250} height={400}/>
                                    </div>
                                </div>
                            )}
                            {payment_provider === "WAVE" && (
                                <div>
                                    <div className={"flex "}>
                                        <p>Account Name</p>
                                        <b>Kyaw Zaw Win</b>
                                    </div>
                                    <div className={"flex "}>
                                        <p>Account Number</p>
                                        <b>
                                            09973302141
                                        </b>
                                    </div>
                                    <Image src={"/wave-pay.jpg"} alt={"WAVE QR Code"} width={200} height={200}/>
                                </div>
                            )}
                        </div>
                        Please transfer the amount to the selected bank account and upload the screenshot along with the
                        reference number provided after the transfer.
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
                        <Button icon={<UploadOutlined/>}>
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
