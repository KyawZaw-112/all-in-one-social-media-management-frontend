"use client";

import Link from "next/link";
import LandingNavbar from "@/components/LandingNavbar";
import { Button, Typography, Space } from "antd";
import {usePathname} from "next/navigation";

const { Title, Paragraph } = Typography;

export default function Home() {
    const pathname:string = usePathname()

    console.log(pathname)
    return (
        <div className={"relative"}>
            <LandingNavbar />
            <main
                style={{
                    minHeight: "80vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "0 16px",
                }}
            >
                <Space orientation="vertical" size="large" align="center">
                    {/* Headline */}
                    <Title level={1} style={{ marginBottom: 0 }}>
                        Post to all platforms
                        <br />
                        <span style={{ color: "#888", fontWeight: 400 }}>
              in one click
            </span>
                    </Title>

                    {/* Description */}
                    <Paragraph style={{ maxWidth: 520, fontSize: 16 }}>
                        Schedule, manage, and publish your content across platforms — fast,
                        simple, and reliable.
                    </Paragraph>

                    {/* CTA Buttons */}
                    <Space size="middle" wrap>
                        <Link href="/subscribe">
                            <Button type="primary" size="large">
                                Start Posting
                            </Button>
                        </Link>

                        <Link href="/login">
                            <Button size="large">
                                I already have an account
                            </Button>
                        </Link>
                    </Space>
                </Space>
            </main>
        </div>
    );
}
