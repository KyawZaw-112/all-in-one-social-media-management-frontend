"use client";

import { Card, Switch, Input, Button } from "antd";
import AuthGuard from "@/components/AuthGuard";

export default function FacebookAutoReply() {
    return (
        <AuthGuard>
            <Card title="Facebook Auto Reply" style={{ maxWidth: 600, margin: "24px auto" }}>
                <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />

                <Input.TextArea
                    rows={3}
                    placeholder="Auto reply message..."
                    style={{ marginTop: 16 }}
                />

                <Button type="primary" style={{ marginTop: 16 }}>
                    Save
                </Button>
            </Card>
        </AuthGuard>
    );
}
