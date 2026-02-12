'use client';
import {ConfigProvider} from "antd";
import Navbar from "@/components/Navbar";
import {ReactNode, useEffect} from "react";
import supabase from "@/lib/supabase";

export default function RootLayout({children}:{children: ReactNode}) {

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
                await fetch("/api/log-login", {
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
            <title>PostNow - Schedule and Post to Social Media Effortlessly</title>
            <meta
                name="description"
                content="PostNow is a social media scheduling tool that helps you plan, schedule, and post content across multiple platforms with ease."
            />
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="icon" href="/favicon.ico"/>
        </head>
        <body>
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#111111",      // clean black primary
                    borderRadius: 8,
                    colorBgContainer: "#ffffff",
                    colorText: "#111111",
                    colorTextSecondary: "#666666",
                    fontSize: 14,
                },
                components: {
                    Card: {
                        boxShadow: "none",
                        borderRadius: 12,
                    },
                    Button: {
                        borderRadius: 8,
                    },
                },
            }}
        >
            <Navbar/>
            {children}
        </ConfigProvider>
        </body>
        </html>
    );
}
