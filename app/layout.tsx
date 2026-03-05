'use client';
import "./globals.css";
import { ConfigProvider } from "antd";
import Navbar from "@/components/Navbar";
import { ReactNode, useEffect } from "react";
import supabase from "@/lib/supabase";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { ThemeProvider, useFestivalTheme } from "@/lib/ThemeContext";

import { theme as antdTheme } from "antd";

function RootLayoutContent({ children }: { children: ReactNode }) {
    const { theme, mode } = useFestivalTheme();
    const isDark = mode === 'dark';

    return (
        <ConfigProvider
            theme={{
                algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                token: {
                    colorPrimary: theme.primaryColor,
                    borderRadius: 12,
                    colorBgContainer: isDark ? "#1e293b" : "#ffffff",
                    colorBgLayout: isDark ? "#0f172a" : "#f8fafc",
                    colorText: isDark ? "#f1f5f9" : "#0f172a",
                    colorTextSecondary: isDark ? "#94a3b8" : "#64748b",
                    fontSize: 14,
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                },
                components: {
                    Card: {
                        boxShadow: isDark ? "0 4px 6px -1px rgba(0, 0, 0, 0.2)" : "0 1px 3px rgba(0,0,0,0.04)",
                        borderRadius: 20,
                        colorBgContainer: isDark ? "#1e293b" : "#ffffff",
                    },
                    Button: {
                        borderRadius: 12,
                    },
                    Input: {
                        borderRadius: 12,
                    },
                    Table: {
                        borderRadius: 16,
                    },
                    Modal: {
                        borderRadius: 20,
                    },
                },
            }}
        >
            <LanguageProvider>
                <Navbar />
                {children}
            </LanguageProvider>
            <SpeedInsights />
        </ConfigProvider>
    );
}

export default function RootLayout({ children }: { children: ReactNode }) {

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
                await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/log-login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: session.user.id,
                        email: session.user.email,
                    }),
                });
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <html lang="en">
            <head>
                <title>AutoReply — Facebook Auto-Reply Platform for Myanmar Businesses</title>
                <meta name="facebook-domain-verification" content="faif4dh4d6aa4hoeez8439r5iygl9x" />
                <meta
                    name="description"
                    content="Myanmar's #1 Facebook Auto-Reply Platform. Automate your Online Shop and Cargo business replies. No extra cost, mobile-first, Myanmar + English support."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#0a0a0f" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <ThemeProvider>
                    <RootLayoutContent>{children}</RootLayoutContent>
                </ThemeProvider>
            </body>
        </html>
    );
}
