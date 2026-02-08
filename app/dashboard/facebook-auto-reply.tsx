"use client";

import { Card, Switch, Input, Button, message } from "antd";
import { useState } from "react";

export default function FacebookAutoReply() {
    const [enabled, setEnabled] = useState(false);
    const [messageText, setMessageText] = useState(
        "Thanks for messaging us! We'll reply shortly 😊"
    );

    const save = () => {
        message.success("Auto-reply settings saved");
    };

    return (
        <Card title="Facebook Auto Reply" style={{ marginTop: 24 }}>
            <div style={{ marginBottom: 16 }}>
                <Switch checked={enabled} onChange={setEnabled} /> Enable auto reply
            </div>

            <Input.TextArea
                rows={3}
                disabled={!enabled}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
            />

            <Button
                type="primary"
                style={{ marginTop: 16 }}
                disabled={!enabled}
                onClick={save}
            >
                Save
            </Button>
        </Card>
    );
}
