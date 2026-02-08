"use client";

import { Card, Button, Space, Typography, Switch, message } from "antd";
import { FacebookFilled, InstagramFilled } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function PlatformsPage() {
    const connect = (platform: string) => {
        message.info(`Redirecting to ${platform} OAuth…`);
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/oauth/${platform}`;
        console.log(`Connecting to ${platform}...`);
    };



    return (
        <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
            <Title level={3}>Connected Platforms</Title>

            <Space orientation="vertical" size={16} style={{ width: "100%" }}>
                <Card>
                    <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
                        <Space>
                            <FacebookFilled style={{ fontSize: 24, color: "#1877F2" }} />
                            <Text strong>Facebook Pages</Text>
                        </Space>
                        <Button type="primary" onClick={() => connect("facebook")}>
                            Connect
                        </Button>
                    </Space>
                </Card>

                <Card>
                    <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
                        <Space>
                            <InstagramFilled style={{ fontSize: 24, color: "#E4405F" }} />
                            <Text strong>Instagram</Text>
                        </Space>
                        <Button onClick={() => connect("instagram")}>
                            Connect
                        </Button>
                    </Space>
                </Card>
            </Space>
        </div>

    );

}
