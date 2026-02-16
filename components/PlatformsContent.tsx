"use client";

import { Button, message, Tag, Spin } from "antd";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

export default function PlatformsContent() {
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [connected, setConnected] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        checkConnection();
    }, []);

    useEffect(() => {
        if (searchParams.get("connected") === "facebook") {
            message.success("Facebook connected successfully!");
            router.replace("/dashboard/platforms");
            checkConnection(); // refresh state
        }
    }, [searchParams]);

    const checkConnection = async () => {
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) return;

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/platforms`,
                {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                }
            );

            const data = await res.json();

            const fb = data.find((p: any) => p.platform === "facebook");
            setConnected(fb?.connected ?? false);
        } catch (err) {
            console.error(err);
        } finally {
            setChecking(false);
        }
    };

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

            const data = await res.json();
            window.location.href = data.url;
        } catch {
            message.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (checking) return <Spin />;

    return (
        <div style={{ padding: 40 }}>
            <h2>Facebook</h2>

            {connected ? (
                <Tag color="green">Connected ✅</Tag>
            ) : (
                <Button
                    type="primary"
                    loading={loading}
                    onClick={connectFacebook}
                >
                    Connect Facebook
                </Button>
            )}
        </div>
    );
}
