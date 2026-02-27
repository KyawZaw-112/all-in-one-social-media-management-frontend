"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/lib/supabase";
import { Menu, Button } from "antd";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFestivalTheme } from "@/lib/ThemeContext";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { t, language } = useLanguage();
    const { theme } = useFestivalTheme();

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
                borderBottom: `2px solid ${theme.primaryColor}33`, // 20% opacity
                padding: "0 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fff",
                position: "sticky",
                top: 0,
                zIndex: 1000,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Link href="/dashboard" style={{ fontWeight: 800, fontSize: 20, color: theme.primaryColor, letterSpacing: -0.5 }}>
                    Vibe
                </Link>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: `${theme.primaryColor}10`,
                        padding: "4px 10px",
                        borderRadius: 20,
                        border: `1px solid ${theme.primaryColor}25`,
                        fontSize: 12,
                        fontWeight: 500,
                        color: theme.primaryColor
                    }}
                    title={theme.description}
                >
                    <span>{theme.icon}</span>
                    <span style={{ whiteSpace: "nowrap" }}>
                        {language === 'my' ? theme.burmeseMonth : theme.festivalName}
                    </span>
                </div>
            </div>

            <Menu
                mode="horizontal"
                selectedKeys={[pathname]}
                style={{ flex: 1, marginLeft: 40 }}
                items={[
                    {
                        key: "/dashboard",
                        label: <Link href="/dashboard">{t.dashboard.dashboard}</Link>,
                    },
                    {
                        key: "/dashboard/platforms",
                        label: (
                            <Link href="/dashboard/platforms">
                                {t.platforms.connectFacebook}
                            </Link>
                        ),
                    },
                    {
                        key: "/dashboard/orders",
                        label: <Link href="/dashboard/orders">{language === 'my' ? "အမှာစာများ" : "Orders"}</Link>,
                    },
                    {
                        key: "/dashboard/shipments",
                        label: <Link href="/dashboard/shipments">{language === 'my' ? "Cargo" : "Cargo"}</Link>,
                    },
                    {
                        key: "/dashboard/billing",
                        label: <Link href="/dashboard/billing">{t.dashboard.billingHistory}</Link>,
                    },
                    {
                        key: "/subscribe",
                        label: <Link href="/subscribe">{t.auth.changePlan}</Link>,
                    },
                ]}
            />

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <LanguageSwitcher />
                <Button
                    onClick={async () => {
                        await supabase.auth.signOut();
                        router.push("/");
                    }}
                    type="default"
                    style={{ border: "1px solid #e5e5e5" }}
                >
                    {t.nav.signOut}
                </Button>
            </div>
        </header>
    );
}
