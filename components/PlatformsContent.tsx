"use client";

import { Button, message, Tag, Spin, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
type PlatformConnection={
    page_id: string;
    page_name: string;
    platform: "facebook" | "tik tok" | "viber";
}
export default function PlatformsContent() {
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [pages, setPages] = useState<PlatformConnection[]>([]);

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        checkConnection();
    }, []);

    useEffect(() => {
        if (searchParams.get("connected") === "facebook") {
            message.success("Facebook connected successfully!");
            router.replace("/dashboard/platforms");
            checkConnection();
        }
    }, [searchParams]);

    const getSession = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        return session;
    };

    const checkConnection = async () => {
        try {
            const session = await getSession();
            if (!session) return;

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/platforms`,
                {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                }
            );

            const data:PlatformConnection[] = await res.json();
            setPages(data.filter((p) => p.platform === "facebook"));
        } catch (err) {
            console.error(err);
        } finally {
            setChecking(false);
        }
    };



    const connectFacebook = async () => {
        try {
            setLoading(true);
            const session = await getSession();

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

    const disconnectFacebook = async (pageId: string) => {
        try {
            const session = await getSession();
            if (!session) return;

            await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/platforms/${pageId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                }
            );

            message.success("Disconnected successfully");
            setPages((prev) => prev.filter((p) => p.page_id !== pageId));
        } catch {
            message.error("Failed to disconnect");
        }
    };

    if (checking) return <Spin />;

    return (
        <div style={{ padding: 40 }}>
            <h2>Facebook</h2>

            {pages.length > 0 ? (
                <>
                    <Tag color="green">Connected ✅</Tag>

                    {pages.map((page) => (
                        <div key={page.page_id} style={{ marginTop: 16 }}>
                            <strong>{page.page_name}</strong>

                            <Popconfirm
                                title="Disconnect this page?"
                                onConfirm={() => disconnectFacebook(page.page_id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button danger style={{ marginLeft: 16 }}>
                                    Disconnect
                                </Button>
                            </Popconfirm>
                        </div>
                    ))}
                </>
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
