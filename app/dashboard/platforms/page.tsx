"use client";

import { Card, Button, Space, Typography, message } from "antd";
import { FacebookFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

export default function PlatformsPage() {
    const [facebookConnected, setFacebookConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/platforms/status")
            .then((res) => res.json())
            .then((data) => {
                setFacebookConnected(data.facebook);
                setLoading(false);
            });
    }, []);

    const connectFacebook = () => {
        window.location.href = "/api/oauth/facebook";
    };

    return (
        <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
            <Title level={3}>Connected With Platforms</Title>

            <Card>
                <Space
                    align="center"
                    style={{ justifyContent: "space-between", width: "100%" }}
                >
                    <Space>
                        <FacebookFilled style={{ fontSize: 24, color: "#1877F2" }} />
                        <Text strong>Facebook Pages</Text>
                    </Space>

                    {loading ? null : facebookConnected ? (
                        <Button disabled type="default">
                            ✅ Connected
                        </Button>
                    ) : (
                        <Button type="primary" onClick={connectFacebook}>
                            Connect
                        </Button>
                    )}
                </Space>
            </Card>
        </div>
    );
}
