"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Menu, Button } from "antd";

export default function Navbar() {
    const pathname = usePathname();
    const [isLogined, setIsLogined] = useState(false);
    const [loading, setLoading] = useState(true);

    // routes where navbar should be hidden
    const hiddenRoutes = ["/", "/login", "/register", "/subscribe", "/success"];

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setIsLogined(!!data.session);
            setLoading(false);
        });

        const { data: listener } =
            supabase.auth.onAuthStateChange((_event, session) => {
                setIsLogined(!!session);
            });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    // ✅ SAFE conditional rendering (AFTER hooks)
    if (loading) return null;
    if (!isLogined) return null;
    if (hiddenRoutes.includes(pathname)) return null;

    return (
        <header
            style={{
                height: 56,
                borderBottom: "1px solid #f0f0f0",
                padding: "0 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fff",
            }}
        >
            <Link href="/dashboard" style={{ fontWeight: 600 }}>
                🚀 PostNow
            </Link>

            <Menu
                mode="horizontal"
                selectable={false}
                items={[
                    { key: "dashboard", label: <Link href="/dashboard">Dashboard</Link> },
                    { key: "post", label: <Link href="/post-now">Post Now</Link> },
                    { key: "billing", label: <Link href="/subscribe">Billing</Link> },
                    { key: "platforms", label: <Link href="/dashboard/platforms">Connect with Facebook</Link> },
                ]}
            />

            <Button
                danger
                onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = "/";
                }}
            >
                Logout
            </Button>
        </header>
    );
}
