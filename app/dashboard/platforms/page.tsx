"use client";

import { Button, message } from "antd";
import { useState } from "react";
import supabase from "@/lib/supabase";

export default function PlatformsPage() {
    const [loading, setLoading] = useState(false);

    const connectFacebook = async () => {
        try {
            setLoading(true);

            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                message.error("Please login first");
                return;
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/platforms/connect`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({ platform: "facebook" }),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to get Facebook auth URL");
            }

            const data = await res.json();

            window.location.href = data.url;
        } catch (err) {
            message.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 40 }}>
            <h2>Connect Facebook</h2>
            <Button
                type="primary"
                loading={loading}
                onClick={connectFacebook}
            >
                Connect Facebook
            </Button>
        </div>
    );
}
