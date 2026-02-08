"use client";

import { Card, Input, Button, Checkbox, message } from "antd";
import { useState } from "react";

export default function PostNowPage() {
    const [content, setContent] = useState("");
    const [platforms, setPlatforms] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const postNow = async () => {
        if (!content || platforms.length === 0) {
            message.warning("Select platform and write content");
            return;
        }

        setLoading(true);

        // call backend later
        setTimeout(() => {
            setLoading(false);
            message.success("Post scheduled successfully 🚀");
            setContent("");
            setPlatforms([]);
        }, 1000);
    };

    return (
        <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
            <Card title="Post Now">
                <Input.TextArea
                    rows={4}
                    placeholder="Write your post..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <Checkbox.Group
                    style={{ marginTop: 16 }}
                    options={[
                        { label: "Facebook", value: "facebook" },
                        { label: "Instagram", value: "instagram" },
                        { label: "Twitter / X", value: "twitter" },
                        { label: "LinkedIn", value: "linkedin" },
                    ]}
                    value={platforms}
                    onChange={(v) => setPlatforms(v as string[])}
                />

                <Button
                    type="primary"
                    block
                    style={{ marginTop: 20 }}
                    loading={loading}
                    onClick={postNow}
                >
                    Post to all selected platforms
                </Button>
            </Card>
        </div>
    );
}
