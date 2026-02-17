"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/lib/supabase";
import { Menu, Button } from "antd";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    // Hide navbar on these routes
    const hiddenRoutes = new Set([
        "/",
        "/login",
        "/register",
        "/subscribe",
        "/success",
    ]);

    useEffect(() => {
        let mounted = true;

        // Initial session check
        supabase.auth.getSession().then(({ data }) => {
            if (!mounted) return;
            setIsAuthenticated(!!data.session);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!mounted) return;
            setIsAuthenticated(!!session);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Prevent flicker before session loads
    if (isAuthenticated === null) return null;

    // Hide navbar if not logged in
    if (!isAuthenticated) return null;

    // Hide navbar on specific routes
    if (hiddenRoutes.has(pathname)) return null;

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
                selectedKeys={[pathname]}
                style={{ flex: 1, marginLeft: 40 }}
                items={[
                    {
                        key: "/dashboard",
                        label: <Link href="/dashboard">Dashboard</Link>,
                    },
                    {
                        key: "/dashboard/platforms",
                        label: (
                            <Link href="/dashboard/platforms">
                                Connect Facebook
                            </Link>
                        ),
                    },
                    {
                        key: "/dashboard/billing",
                        label: <Link href="/dashboard/billing">Payment History</Link>,
                    },
                    {
                        key: "/subscribe",
                        label: <Link href="/subscribe">Upgrade Plan</Link>,
                    },
                ]}
            />

            <Button
                onClick={async () => {
                    await supabase.auth.signOut();
                    router.push("/");
                }}
                type="default"
                style={{ border: "1px solid #e5e5e5" }}
            >
                Logout
            </Button>
        </header>
    );
}
