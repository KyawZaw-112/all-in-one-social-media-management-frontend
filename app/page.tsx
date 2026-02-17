"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card } from "antd";
import {
    ShopOutlined,
    CarOutlined,
    CheckCircleOutlined,
    RocketOutlined,
    ThunderboltOutlined,
    GlobalOutlined,
    MobileOutlined,
    SafetyOutlined,
} from "@ant-design/icons";

export default function LandingPage() {
    const [selectedPlan, setSelectedPlan] = useState<"shop" | "cargo" | null>(null);

    return (
        <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
            {/* Hero Section */}
            <div
                style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    padding: "60px 20px",
                    textAlign: "center",
                    color: "white",
                }}
            >
                <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", margin: 0, color: "white" }}>
                    🤖 Facebook Auto-Reply
                </h1>
                <p style={{ fontSize: "clamp(16px, 3vw, 20px)", margin: "16px 0 0", opacity: 0.95 }}>
                    AI လိုမလို၊ ငွေချွေတာမယ့် Facebook Auto-Reply Platform
                </p>
                <p style={{ fontSize: "clamp(14px, 2.5vw, 18px)", margin: "8px 0", opacity: 0.9 }}>
                    Save time & money with automated replies
                </p>
            </div>

            {/* Features */}
            <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
                <h2 style={{ textAlign: "center", marginBottom: 40 }}>✨ Features</h2>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: 20,
                    }}
                >
                    <Card>
                        <div style={{ textAlign: "center" }}>
                            <ThunderboltOutlined style={{ fontSize: 40, color: "#52c41a" }} />
                            <h3>No AI Required</h3>
                            <p>OpenAI API မလို၊ လုံးဝ Free!</p>
                        </div>
                    </Card>
                    <Card>
                        <div style={{ textAlign: "center" }}>
                            <MobileOutlined style={{ fontSize: 40, color: "#1890ff" }} />
                            <h3>Mobile First</h3>
                            <p>ဖုန်းနဲ့ သုံးဖို့ အဆင်ပြေဆုံး!</p>
                        </div>
                    </Card>
                    <Card>
                        <div style={{ textAlign: "center" }}>
                            <GlobalOutlined style={{ fontSize: 40, color: "#722ed1" }} />
                            <h3>Myanmar + English</h3>
                            <p>နှစ်ဘာသာလုံး Support!</p>
                        </div>
                    </Card>
                    <Card>
                        <div style={{ textAlign: "center" }}>
                            <SafetyOutlined style={{ fontSize: 40, color: "#fa8c16" }} />
                            <h3>Secure & Fast</h3>
                            <p>လုံခြုံ၊ မြန်ဆန်ပါတယ်!</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Pricing Plans */}
            <div
                style={{
                    padding: "60px 20px",
                    background: "white",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: 16 }}>💰 Pricing Plans</h2>
                <p style={{ textAlign: "center", color: "#666", marginBottom: 40 }}>
                    Choose your business type
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: 30,
                        maxWidth: "900px",
                        margin: "0 auto",
                    }}
                >
                    {/* Online Shop Plan */}
                    <Card
                        hoverable
                        onClick={() => setSelectedPlan("shop")}
                        style={{
                            border: selectedPlan === "shop" ? "3px solid #1890ff" : "1px solid #d9d9d9",
                            boxShadow: selectedPlan === "shop" ? "0 4px 20px rgba(24,144,255,0.3)" : undefined,
                        }}
                    >
                        <div style={{ textAlign: "center" }}>
                            <ShopOutlined style={{ fontSize: 60, color: "#1890ff" }} />
                            <h2 style={{ margin: "16px 0" }}>🛍️ Online Shop</h2>
                            <div style={{ fontSize: 40, fontWeight: "bold", color: "#1890ff", margin: "20px 0" }}>
                                15,000 Ks
                            </div>
                            <p style={{ color: "#666", marginBottom: 30 }}>per month</p>

                            <div style={{ textAlign: "left", marginBottom: 30 }}>
                                <p><CheckCircleOutlined style={{ color: "#52c41a" }} /> Unlimited conversations</p>
                                <p><CheckCircleOutlined style={{ color: "#52c41a" }} /> Auto order collection</p>
                                <p><CheckCircleOutlined style={{ color: "#52c41a" }} /> Product catalog</p>
                                <p><CheckCircleOutlined style={{ color: "#52c41a" }} /> Payment options (COD/Bank)</p>
                                <p><CheckCircleOutlined style={{ color: "#52c41a" }} /> Myanmar + English</p>
                                <p><CheckCircleOutlined style={{ color: "#52c41a" }} /> Mobile dashboard</p>
                                <p><CheckCircleOutlined style={{ color: "#52c41a" }} /> Email support</p>
                            </div>

                            <Link href="/signup?plan=shop">
                                <Button type="primary" size="large" block>
                                    Start Free Trial (7 days)
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    {/* Cargo Plan */}
                    <Card
                        hoverable
                        onClick={() => setSelectedPlan("cargo")}
                        style={{
                            border: selectedPlan === "cargo" ? "3px solid #fa8c16" : "1px solid #d9d9d9",
                            boxShadow: selectedPlan === "cargo" ? "0 4px 20px rgba(250,140,22,0.3)" : undefined,
                        }}
                    >
                        <div style={{ textAlign: "center" }}>
                            <CarOutlined style={{ fontSize: 60, color: "#fa8c16" }} />
                            <h2 style={{ margin: "16px 0" }}>📦 Cargo & Delivery</h2>
                            <div style={{ fontSize: 40, fontWeight: "bold", color: "#fa8c16", margin: "20px 0" }}>
                                20,000 Ks
                            </div>
                            <p style={{ color: "#666", marginBottom: 30 }}>per month</p>

                            <div style={{ textAlign: "left", marginBottom: 30 }}>
                                <p><CheckCircleOutlined style={{ color: "#52c41a" }} /> Unlimited shipments</p>
                                <p><CheckCircleOutlined style={{ color: "#52c41a" }} /> Auto booking</p>
                                <p><CheckCircleOutlined style={{ color: "#52c41a" }} /> Tracking numbers</p>
                                <p><CheckCircleOutlined style={{ color: "#52c41a" }} /> Rate calculator</p>
                                <p><CheckCircleOutlined style={{ color: "#52c41a" }} /> Myanmar + English</p>
                                <p><CheckCircleOutlined style={{ color: "#52c41a" }} /> Mobile dashboard</p>
                                <p><CheckCircleOutlined style={{ color: "#52c41a" }} /> Priority support</p>
                            </div>

                            <Link href="/signup?plan=cargo">
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    style={{ background: "#fa8c16", borderColor: "#fa8c16" }}
                                >
                                    Start Free Trial (7 days)
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>

                <p style={{ textAlign: "center", marginTop: 40, color: "#666" }}>
                    🎁 7 ရက် အခမဲ့ စမ်းသုံးပါ! No credit card required.
                </p>
            </div>

            {/* How It Works */}
            <div style={{ padding: "60px 20px", maxWidth: "1000px", margin: "0 auto" }}>
                <h2 style={{ textAlign: "center", marginBottom: 40 }}>🚀 How It Works</h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                    <Card>
                        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                            <div
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: "50%",
                                    background: "#1890ff",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 24,
                                    fontWeight: "bold",
                                    flexShrink: 0,
                                }}
                            >
                                1
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>Sign Up & Choose Plan</h3>
                                <p style={{ margin: "8px 0 0", color: "#666" }}>
                                    အကောင့်ဖွင့်ပြီး plan ရွေးပါ (7 ရက် free trial)
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                            <div
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: "50%",
                                    background: "#52c41a",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 24,
                                    fontWeight: "bold",
                                    flexShrink: 0,
                                }}
                            >
                                2
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>Connect Facebook Page</h3>
                                <p style={{ margin: "8px 0 0", color: "#666" }}>
                                    သင့် Facebook Page ချိတ်ဆက်ပါ (1 click!)
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                            <div
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: "50%",
                                    background: "#722ed1",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 24,
                                    fontWeight: "bold",
                                    flexShrink: 0,
                                }}
                            >
                                3
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>Setup Auto-Reply Flows</h3>
                                <p style={{ margin: "8px 0 0", color: "#666" }}>
                                    Trigger keywords သတ်မှတ်ပြီး auto-reply setup လုပ်ပါ
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                            <div
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: "50%",
                                    background: "#fa8c16",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 24,
                                    fontWeight: "bold",
                                    flexShrink: 0,
                                }}
                            >
                                4
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>Start Receiving Orders!</h3>
                                <p style={{ margin: "8px 0 0", color: "#666" }}>
                                    ပြီးပါပြီ! Order/Booking များ အလိုအလျောက် လက်ခံပါမယ်! 🎉
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* CTA Section */}
            <div
                style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    padding: "60px 20px",
                    textAlign: "center",
                    color: "white",
                }}
            >
                <RocketOutlined style={{ fontSize: 60, marginBottom: 20 }} />
                <h2 style={{ color: "white", margin: "0 0 16px" }}>Ready to automate your business?</h2>
                <p style={{ fontSize: 18, marginBottom: 30, opacity: 0.95 }}>
                    7 ရက် အခမဲ့ စမ်းသုံးပါ! အလုပ်များမှုက လျော့မယ်၊ အရောင်းက တက်မယ်!
                </p>
                <Link href="/signup">
                    <Button type="primary" size="large" style={{ height: 50, fontSize: 18, padding: "0 40px" }}>
                        Start Free Trial Now 🚀
                    </Button>
                </Link>
            </div>

            {/* Footer */}
            <div style={{ padding: "40px 20px", textAlign: "center", background: "#001529", color: "white" }}>
                <p style={{ margin: 0, opacity: 0.8 }}>
                    © 2026 Facebook Auto-Reply Platform. Made with 💖 in Myanmar.
                </p>
                <div style={{ marginTop: 20 }}>
                    <Link href="/privacy-policy" style={{ color: "white", margin: "0 15px" }}>
                        Privacy
                    </Link>
                    <Link href="/terms" style={{ color: "white", margin: "0 15px" }}>
                        Terms
                    </Link>
                    <a href="mailto:support@example.com" style={{ color: "white", margin: "0 15px" }}>
                        Support
                    </a>
                </div>
            </div>
        </div>
    );
}
