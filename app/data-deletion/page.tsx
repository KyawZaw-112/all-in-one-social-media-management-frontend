"use client";

import { Card, Typography, Divider } from "antd";

const { Title, Paragraph, Text } = Typography;

export default function DataDeletionPage() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f5f5",
                padding: 16,
            }}
        >
            <Card
                style={{ maxWidth: 720, width: "100%" }}
                bordered={false}
            >
                <Title level={2}>Data Deletion Instructions</Title>

                <Paragraph>
                    We respect your privacy and are committed to protecting your personal data.
                </Paragraph>

                <Divider />

                <Title level={4}>How to request data deletion</Title>

                <Paragraph>
                    If you have used <Text strong>Facebook Login</Text> with our application
                    and would like us to delete your data, please follow the steps below:
                </Paragraph>

                <Paragraph>
                    1. Send an email to:
                    <br />
                    <Text strong>support@yourdomain.com</Text>
                </Paragraph>

                <Paragraph>
                    2. Use the subject line:
                    <br />
                    <Text code>Facebook Data Deletion Request</Text>
                </Paragraph>

                <Paragraph>
                    3. Include the following information in your email:
                    <ul>
                        <li>Your Facebook User ID</li>
                        <li>The email associated with your Facebook account</li>
                    </ul>
                </Paragraph>

                <Divider />

                <Paragraph>
                    Once we receive your request, we will delete your data from our systems
                    within <Text strong>7 days</Text> and confirm via email.
                </Paragraph>

                <Paragraph type="secondary">
                    If you have any questions, please contact us at
                    {" "}
                    <Text strong>support@yourdomain.com</Text>.
                </Paragraph>
            </Card>
        </div>
    );
}
