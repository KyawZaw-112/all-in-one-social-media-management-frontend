"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "antd";
import {
    ShopOutlined,
    CarOutlined,
    CheckCircleOutlined,
    RocketOutlined,
    ThunderboltOutlined,
    GlobalOutlined,
    MobileOutlined,
    SafetyOutlined,
    ArrowRightOutlined,
    MessageOutlined,
    DashboardOutlined,
    ApiOutlined,
    StarFilled,
} from "@ant-design/icons";

export default function LandingPage() {
    const [selectedPlan, setSelectedPlan] = useState<"shop" | "cargo" | null>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#f1f5f9", fontFamily: "'Inter', -apple-system, sans-serif" }}>

            {/* ═══════════════════════════ NAVIGATION ═══════════════════════════ */}
            <nav style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                padding: "16px 32px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: scrolled ? "rgba(10,10,15,0.85)" : "transparent",
                backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
                borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
                transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                    }}>
                        🤖
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>AutoReply</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Link href="/login">
                        <Button type="text" style={{ color: "#94a3b8", fontWeight: 500, height: 40, borderRadius: 10 }}>
                            Login
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button type="primary" style={{
                            background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                            border: "none",
                            borderRadius: 10,
                            height: 40,
                            fontWeight: 600,
                            boxShadow: "0 4px 15px rgba(129,140,248,0.3)"
                        }}>
                            Get Started
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* ═══════════════════════════ HERO SECTION ═══════════════════════════ */}
            <section style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "120px 24px 80px",
                position: "relative",
                overflow: "hidden",
            }}>
                {/* Gradient Orbs */}
                <div style={{
                    position: "absolute",
                    width: 600,
                    height: 600,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(129,140,248,0.15) 0%, transparent 70%)",
                    top: "-10%",
                    left: "-10%",
                    filter: "blur(60px)",
                    pointerEvents: "none",
                }} />
                <div style={{
                    position: "absolute",
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)",
                    bottom: "5%",
                    right: "-5%",
                    filter: "blur(60px)",
                    pointerEvents: "none",
                }} />

                {/* Badge */}
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 16px 6px 8px",
                    borderRadius: 50,
                    border: "1px solid rgba(129,140,248,0.3)",
                    background: "rgba(129,140,248,0.08)",
                    marginBottom: 32,
                    fontSize: 13,
                    color: "#a5b4fc",
                    fontWeight: 500,
                }}>
                    <span style={{
                        background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                        padding: "2px 8px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "white"
                    }}>NEW</span>
                    Myanmar's #1 Auto-Reply Platform
                </div>

                {/* Headline */}
                <h1 style={{
                    fontSize: "clamp(36px, 6vw, 72px)",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                    margin: "0 0 24px",
                    maxWidth: 800,
                    background: "linear-gradient(135deg, #f1f5f9 0%, #a5b4fc 50%, #818cf8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}>
                    Automate Your Facebook Replies
                </h1>

                <p style={{
                    fontSize: "clamp(16px, 2.5vw, 20px)",
                    color: "#94a3b8",
                    maxWidth: 560,
                    margin: "0 0 16px",
                    lineHeight: 1.7,
                }}>
                    AI မလို၊ ငွေချွေတာမယ့် Auto-Reply Platform။
                    Online Shop နဲ့ Cargo လုပ်ငန်းတွေအတွက် အထူးဖန်တီးထားပါတယ်။
                </p>
                <p style={{
                    fontSize: 15,
                    color: "#64748b",
                    maxWidth: 480,
                    margin: "0 0 40px",
                    lineHeight: 1.6,
                }}>
                    Save time. Boost sales. Never miss a customer message again.
                </p>

                {/* CTA Buttons */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                    <Link href="/signup?plan=shop">
                        <Button size="large" style={{
                            height: 56,
                            padding: "0 36px",
                            borderRadius: 14,
                            fontWeight: 600,
                            fontSize: 16,
                            background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                            border: "none",
                            color: "white",
                            boxShadow: "0 8px 30px rgba(129,140,248,0.35)",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}>
                            Start Free Trial <ArrowRightOutlined />
                        </Button>
                    </Link>
                    <a href="#features">
                        <Button size="large" style={{
                            height: 56,
                            padding: "0 36px",
                            borderRadius: 14,
                            fontWeight: 500,
                            fontSize: 16,
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#e2e8f0",
                        }}>
                            Learn More
                        </Button>
                    </a>
                </div>

                {/* Trust Badges */}
                <div style={{
                    marginTop: 64,
                    display: "flex",
                    alignItems: "center",
                    gap: 32,
                    flexWrap: "wrap",
                    justifyContent: "center",
                    color: "#475569",
                    fontSize: 13,
                }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <CheckCircleOutlined style={{ color: "#22c55e" }} /> No Credit Card Required
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <CheckCircleOutlined style={{ color: "#22c55e" }} /> 7-Day Free Trial
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <CheckCircleOutlined style={{ color: "#22c55e" }} /> Cancel Anytime
                    </span>
                </div>
            </section>

            {/* ═══════════════════════════ FEATURES ═══════════════════════════ */}
            <section id="features" style={{
                padding: "100px 24px",
                maxWidth: 1200,
                margin: "0 auto",
            }}>
                <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <p style={{
                        fontSize: 13,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#818cf8",
                        marginBottom: 12,
                    }}>Features</p>
                    <h2 style={{
                        fontSize: "clamp(28px, 4vw, 42px)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        margin: 0,
                        color: "#f1f5f9",
                    }}>
                        Everything you need to automate
                    </h2>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 20,
                }}>
                    {[
                        {
                            icon: <ThunderboltOutlined />,
                            title: "No AI Cost",
                            desc: "OpenAI API မလို၊ လုံးဝ Free",
                            gradient: "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.03))",
                            border: "rgba(34,197,94,0.2)",
                            iconColor: "#22c55e",
                        },
                        {
                            icon: <MessageOutlined />,
                            title: "Smart Auto-Reply",
                            desc: "Keyword-based reply ဖြင့် ဖောက်သည်များကို လျှင်မြန်စွာ ပြန်ကြားပါ",
                            gradient: "linear-gradient(135deg, rgba(129,140,248,0.12), rgba(129,140,248,0.03))",
                            border: "rgba(129,140,248,0.2)",
                            iconColor: "#818cf8",
                        },
                        {
                            icon: <MobileOutlined />,
                            title: "Mobile First",
                            desc: "ဖုန်းနဲ့ သုံးဖို့ အဆင်ပြေဆုံး",
                            gradient: "linear-gradient(135deg, rgba(56,189,248,0.12), rgba(56,189,248,0.03))",
                            border: "rgba(56,189,248,0.2)",
                            iconColor: "#38bdf8",
                        },
                        {
                            icon: <GlobalOutlined />,
                            title: "Myanmar + English",
                            desc: "နှစ်ဘာသာလုံး Support",
                            gradient: "linear-gradient(135deg, rgba(168,85,247,0.12), rgba(168,85,247,0.03))",
                            border: "rgba(168,85,247,0.2)",
                            iconColor: "#a855f7",
                        },
                        {
                            icon: <DashboardOutlined />,
                            title: "Real-time Dashboard",
                            desc: "Message ပမာဏ၊ Reply Rate အားလုံးကို Dashboard မှာ ကြည့်ပါ",
                            gradient: "linear-gradient(135deg, rgba(251,146,60,0.12), rgba(251,146,60,0.03))",
                            border: "rgba(251,146,60,0.2)",
                            iconColor: "#fb923c",
                        },
                        {
                            icon: <SafetyOutlined />,
                            title: "Secure & Fast",
                            desc: "လုံခြုံ၊ မြန်ဆန်၊ 99.9% uptime",
                            gradient: "linear-gradient(135deg, rgba(244,63,94,0.12), rgba(244,63,94,0.03))",
                            border: "rgba(244,63,94,0.2)",
                            iconColor: "#f43f5e",
                        },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            style={{
                                background: feature.gradient,
                                border: `1px solid ${feature.border}`,
                                borderRadius: 20,
                                padding: "32px 28px",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                cursor: "default",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                                (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                            }}
                        >
                            <div style={{
                                width: 48,
                                height: 48,
                                borderRadius: 14,
                                background: `${feature.gradient}`,
                                border: `1px solid ${feature.border}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 22,
                                color: feature.iconColor,
                                marginBottom: 20,
                            }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 8px", color: "#f1f5f9" }}>
                                {feature.title}
                            </h3>
                            <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════ PRICING ═══════════════════════════ */}
            <section id="pricing" style={{
                padding: "100px 24px",
                maxWidth: 1000,
                margin: "0 auto",
            }}>
                <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <p style={{
                        fontSize: 13,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#818cf8",
                        marginBottom: 12,
                    }}>Pricing</p>
                    <h2 style={{
                        fontSize: "clamp(28px, 4vw, 42px)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        margin: "0 0 12px",
                        color: "#f1f5f9",
                    }}>
                        Choose your business type
                    </h2>
                    <p style={{ color: "#64748b", fontSize: 16 }}>
                        7 ရက် အခမဲ့ စမ်းသုံးပါ။ Credit card မလိုပါ။
                    </p>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: 24,
                }}>
                    {/* ── Online Shop Plan ── */}
                    <div
                        onClick={() => setSelectedPlan("shop")}
                        style={{
                            background: selectedPlan === "shop"
                                ? "linear-gradient(135deg, rgba(129,140,248,0.12), rgba(129,140,248,0.04))"
                                : "rgba(255,255,255,0.02)",
                            border: selectedPlan === "shop"
                                ? "2px solid rgba(129,140,248,0.5)"
                                : "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 24,
                            padding: "36px 32px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <div style={{
                            width: 56,
                            height: 56,
                            borderRadius: 16,
                            background: "linear-gradient(135deg, #818cf8, #6366f1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 20,
                        }}>
                            <ShopOutlined style={{ fontSize: 28, color: "white" }} />
                        </div>

                        <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", color: "#f1f5f9" }}>
                            🛍️ Online Shop
                        </h3>
                        <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 24px" }}>
                            E-commerce & Online Selling
                        </p>

                        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
                            <span style={{ fontSize: 42, fontWeight: 800, color: "#f1f5f9" }}>2,000</span>
                            <span style={{ fontSize: 16, color: "#94a3b8" }}>Baht / month</span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
                            {[
                                "Unlimited conversations",
                                "Auto order collection",
                                "Product catalog management",
                                "Online Warehouse feature",
                                "Payment options (COD/Bank)",
                                "Myanmar + English support",
                                "Mobile dashboard",
                            ].map((item, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#cbd5e1" }}>
                                    <CheckCircleOutlined style={{ color: "#22c55e", fontSize: 16 }} />
                                    {item}
                                </div>
                            ))}
                        </div>

                        <Link href="/signup?plan=shop">
                            <Button block size="large" style={{
                                height: 52,
                                borderRadius: 14,
                                fontWeight: 600,
                                background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                                border: "none",
                                color: "white",
                                fontSize: 15,
                                boxShadow: "0 6px 20px rgba(129,140,248,0.3)"
                            }}>
                                Start Free Trial
                            </Button>
                        </Link>
                    </div>

                    {/* ── Cargo Plan ── */}
                    <div
                        onClick={() => setSelectedPlan("cargo")}
                        style={{
                            background: selectedPlan === "cargo"
                                ? "linear-gradient(135deg, rgba(251,146,60,0.12), rgba(251,146,60,0.04))"
                                : "rgba(255,255,255,0.02)",
                            border: selectedPlan === "cargo"
                                ? "2px solid rgba(251,146,60,0.5)"
                                : "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 24,
                            padding: "36px 32px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Popular Badge */}
                        <div style={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            background: "linear-gradient(135deg, #fb923c, #f59e0b)",
                            padding: "4px 14px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 700,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                        }}>
                            <StarFilled /> POPULAR
                        </div>

                        <div style={{
                            width: 56,
                            height: 56,
                            borderRadius: 16,
                            background: "linear-gradient(135deg, #fb923c, #f59e0b)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 20,
                        }}>
                            <CarOutlined style={{ fontSize: 28, color: "white" }} />
                        </div>

                        <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", color: "#f1f5f9" }}>
                            📦 Cargo & Delivery
                        </h3>
                        <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 24px" }}>
                            Logistics & Shipping Business
                        </p>

                        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
                            <span style={{ fontSize: 42, fontWeight: 800, color: "#f1f5f9" }}>2,000</span>
                            <span style={{ fontSize: 16, color: "#94a3b8" }}>Baht / month</span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
                            {[
                                "Unlimited shipment tracking",
                                "Auto booking system",
                                "Tracking number generation",
                                "Cargo process flow",
                                "Rate calculator",
                                "Myanmar + English support",
                                "Priority support 24/7",
                            ].map((item, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#cbd5e1" }}>
                                    <CheckCircleOutlined style={{ color: "#22c55e", fontSize: 16 }} />
                                    {item}
                                </div>
                            ))}
                        </div>

                        <Link href="/signup?plan=cargo">
                            <Button block size="large" style={{
                                height: 52,
                                borderRadius: 14,
                                fontWeight: 600,
                                background: "linear-gradient(135deg, #fb923c, #f59e0b)",
                                border: "none",
                                color: "white",
                                fontSize: 15,
                                boxShadow: "0 6px 20px rgba(251,146,60,0.3)"
                            }}>
                                Start Free Trial
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════ HOW IT WORKS ═══════════════════════════ */}
            <section style={{
                padding: "100px 24px",
                maxWidth: 800,
                margin: "0 auto",
            }}>
                <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <p style={{
                        fontSize: 13,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#818cf8",
                        marginBottom: 12,
                    }}>How It Works</p>
                    <h2 style={{
                        fontSize: "clamp(28px, 4vw, 42px)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        margin: 0,
                        color: "#f1f5f9",
                    }}>
                        Get started in minutes
                    </h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {[
                        {
                            step: "01",
                            title: "Create Account",
                            desc: "အကောင့်ဖွင့်ပြီး plan ရွေးပါ (7 ရက် free trial)",
                            color: "#818cf8",
                        },
                        {
                            step: "02",
                            title: "Connect Facebook Page",
                            desc: "သင့် Facebook Page ချိတ်ဆက်ပါ — 1 click!",
                            color: "#22c55e",
                        },
                        {
                            step: "03",
                            title: "Setup Auto-Reply Flows",
                            desc: "Trigger keywords သတ်မှတ်ပြီး reply templates ဖန်တီးပါ",
                            color: "#a78bfa",
                        },
                        {
                            step: "04",
                            title: "Start Receiving Orders!",
                            desc: "ပြီးပါပြီ! Order/Booking တွေ အလိုအလျောက် လက်ခံပါမယ်! 🎉",
                            color: "#fb923c",
                        },
                    ].map((item, i) => (
                        <div key={i} style={{
                            display: "flex",
                            gap: 28,
                            padding: "32px 0",
                            borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
                        }}>
                            <div style={{
                                minWidth: 56,
                                height: 56,
                                borderRadius: 16,
                                background: `linear-gradient(135deg, ${item.color}22, ${item.color}08)`,
                                border: `1px solid ${item.color}33`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 18,
                                fontWeight: 800,
                                color: item.color,
                            }}>
                                {item.step}
                            </div>
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 6px", color: "#f1f5f9" }}>
                                    {item.title}
                                </h3>
                                <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════ CTA SECTION ═══════════════════════════ */}
            <section style={{
                padding: "80px 24px",
                margin: "0 24px",
                maxWidth: 1200,
                marginLeft: "auto",
                marginRight: "auto",
            }}>
                <div style={{
                    background: "linear-gradient(135deg, rgba(129,140,248,0.12), rgba(167,139,250,0.08))",
                    border: "1px solid rgba(129,140,248,0.15)",
                    borderRadius: 32,
                    padding: "64px 32px",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}>
                    {/* Glow */}
                    <div style={{
                        position: "absolute",
                        width: 400,
                        height: 400,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(129,140,248,0.12) 0%, transparent 70%)",
                        top: "-50%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        pointerEvents: "none",
                    }} />

                    <RocketOutlined style={{ fontSize: 48, color: "#818cf8", marginBottom: 24 }} />
                    <h2 style={{
                        fontSize: "clamp(24px, 4vw, 36px)",
                        fontWeight: 700,
                        margin: "0 0 16px",
                        color: "#f1f5f9",
                    }}>
                        Ready to automate your business?
                    </h2>
                    <p style={{
                        fontSize: 16,
                        color: "#94a3b8",
                        maxWidth: 480,
                        margin: "0 auto 32px",
                        lineHeight: 1.7,
                    }}>
                        7 ရက် အခမဲ့ စမ်းသုံးပါ။ အလုပ်များမှုက လျော့မယ်၊ အရောင်းက တက်မယ်။
                    </p>
                    <Link href="/signup">
                        <Button size="large" style={{
                            height: 56,
                            padding: "0 40px",
                            borderRadius: 14,
                            fontWeight: 600,
                            fontSize: 16,
                            background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                            border: "none",
                            color: "white",
                            boxShadow: "0 8px 30px rgba(129,140,248,0.35)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                        }}>
                            Start Free Trial Now <RocketOutlined />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* ═══════════════════════════ FOOTER ═══════════════════════════ */}
            <footer style={{
                padding: "48px 24px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                maxWidth: 1200,
                margin: "0 auto",
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 20,
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                        }}>
                            🤖
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8" }}>AutoReply</span>
                    </div>

                    <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
                        <Link href="/privacy-policy" style={{ color: "#64748b", textDecoration: "none" }}>Privacy</Link>
                        <Link href="/terms" style={{ color: "#64748b", textDecoration: "none" }}>Terms</Link>
                        <a href="mailto:support@example.com" style={{ color: "#64748b", textDecoration: "none" }}>Support</a>
                    </div>
                </div>

                <div style={{
                    marginTop: 24,
                    paddingTop: 24,
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                    textAlign: "center",
                    fontSize: 12,
                    color: "#475569",
                }}>
                    © 2026 AutoReply Platform. Made with 💖 in Myanmar.
                </div>
            </footer>
        </div>
    );
}
