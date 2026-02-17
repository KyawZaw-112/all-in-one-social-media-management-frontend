"use client";

import { useState, useEffect } from "react";
import {
    Layout,
    Card,
    Row,
    Col,
    Statistic,
    Button,
    Typography,
    Space,
    Badge,
    Tabs,
    Empty,
    List,
    Avatar,
    Tag,
    Divider
} from "antd";
import {
    HomeOutlined,
    RobotOutlined,
    BarChartOutlined,
    UserOutlined,
    PlusOutlined,
    CheckCircleOutlined,
    ThunderboltOutlined,
    QuestionCircleOutlined,
    ArrowRightOutlined,
    BellOutlined,
    FacebookOutlined,
    CreditCardOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import axios from "axios";

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function UserDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("home");
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
                const res = await axios.get(`${apiUrl}/api/automation/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data.data);
            } catch (err) {
                console.error("Failed to fetch stats");
            }
        };
        fetchStats();
    }, []);

    const tabItems = [
        { key: "home", icon: <HomeOutlined />, label: "Home" },
        { key: "auto", icon: <RobotOutlined />, label: "Auto-Reply" },
        { key: "stats", icon: <BarChartOutlined />, label: "Stats" },
        { key: "profile", icon: <UserOutlined />, label: "Profile" },
    ];

    return (
        <AuthGuard>
            <div style={{ minHeight: "100vh", background: "#f8fafc", paddingBottom: "70px" }}>
                {/* Fixed Premium Header */}
                <div style={{
                    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                    padding: "40px 24px 80px 24px",
                    color: "white",
                    borderRadius: "0 0 40px 40px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                        <div>
                            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", letterSpacing: "0.5px" }}>WELCOME BACK</Text>
                            <Title level={2} style={{ color: "white", margin: 0, fontSize: "28px", fontWeight: 800 }}>Merchant Center</Title>
                        </div>
                        <Badge dot color="#22c55e">
                            <Button
                                icon={<BellOutlined />}
                                type="text"
                                style={{ color: "white", fontSize: "22px", background: "rgba(255,255,255,0.1)", borderRadius: "12px", width: "45px", height: "45px" }}
                            />
                        </Badge>
                    </div>

                    <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "10px" }}>
                        <Card
                            style={{ minWidth: "160px", borderRadius: "20px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
                            styles={{ body: { padding: "16px" } }}
                        >
                            <Statistic
                                title={<Text style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 500 }}>ACTIVE FLOWS</Text>}
                                value={stats?.active_flows || 0}
                                valueStyle={{ color: "white", fontSize: "24px", fontWeight: 700 }}
                            />
                        </Card>
                        <Card
                            style={{ minWidth: "160px", borderRadius: "20px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
                            styles={{ body: { padding: "16px" } }}
                        >
                            <Statistic
                                title={<Text style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 500 }}>AUTO REPLIES</Text>}
                                value={stats?.conversations?.completed || 0}
                                valueStyle={{ color: "white", fontSize: "24px", fontWeight: 700 }}
                            />
                        </Card>
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ padding: "0 20px", marginTop: "-40px" }}>
                    {activeTab === "home" && (
                        <Space direction="vertical" size={24} style={{ width: "100%" }}>
                            {/* Pro Setup Guide */}
                            <Card
                                bordered={false}
                                style={{ borderRadius: "24px", boxShadow: "0 15px 35px rgba(0,0,0,0.05)", background: "#fff", border: "1px solid #f1f5f9" }}
                                styles={{ body: { padding: "20px" } }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <div style={{ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", padding: "14px", borderRadius: "16px" }}>
                                        <ThunderboltOutlined style={{ color: "#166534", fontSize: "24px" }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Text strong style={{ fontSize: "17px", display: "block", marginBottom: "2px" }}>Fast Setup Guide</Text>
                                        <Text style={{ color: "#64748b", fontSize: "13px" }}>သင့်လုပ်ငန်းကို ၂ မိနစ်အတွင်း Auto-Reply စတင်လိုက်ပါ။</Text>
                                    </div>
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<ArrowRightOutlined />}
                                        style={{ width: "44px", height: "44px", background: "#0f172a", border: "none" }}
                                        onClick={() => router.push("/automation/facebook")}
                                    />
                                </div>
                            </Card>

                            <div>
                                <Title level={5} style={{ marginBottom: "16px", fontSize: "16px", color: "#1e293b", fontWeight: 700, letterSpacing: "0.3px" }}>QUICK ACTIONS</Title>
                                <Row gutter={[16, 16]}>
                                    <Col span={8}>
                                        <Card hoverable style={{ borderRadius: "20px", textAlign: "center", border: "1px solid #f1f5f9", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }} onClick={() => router.push("/automation/facebook")}>
                                            <div style={{ background: "#f5f3ff", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px auto" }}>
                                                <RobotOutlined style={{ fontSize: "22px", color: "#7c3aed" }} />
                                            </div>
                                            <Text strong style={{ fontSize: "12px" }}>Create Flow</Text>
                                        </Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card hoverable style={{ borderRadius: "20px", textAlign: "center", border: "1px solid #f1f5f9", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }} onClick={() => router.push("/dashboard/platforms")}>
                                            <div style={{ background: "#eff6ff", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px auto" }}>
                                                <FacebookOutlined style={{ fontSize: "22px", color: "#1d4ed8" }} />
                                            </div>
                                            <Text strong style={{ fontSize: "12px" }}>Connect FB</Text>
                                        </Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card hoverable style={{ borderRadius: "20px", textAlign: "center", border: "1px solid #f1f5f9", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                                            <div style={{ background: "#fff7ed", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px auto" }}>
                                                <QuestionCircleOutlined style={{ fontSize: "22px", color: "#ea580c" }} />
                                            </div>
                                            <Text strong style={{ fontSize: "12px" }}>Get Help</Text>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>

                            <div>
                                <Title level={5} style={{ marginBottom: "16px", marginTop: "8px", fontSize: "16px", color: "#1e293b", fontWeight: 700 }}>RECENT ACTIVITY</Title>
                                <Card style={{ borderRadius: "24px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.03)" }} styles={{ body: { padding: "12px" } }}>
                                    {stats?.conversations?.total > 0 ? (
                                        <List
                                            dataSource={[1, 2, 3]}
                                            renderItem={(item) => (
                                                <List.Item style={{ padding: "16px", borderBottom: item === 3 ? "none" : "1px solid #f1f5f9" }}>
                                                    <List.Item.Meta
                                                        avatar={<Avatar size={40} style={{ backgroundColor: '#f1f5f9' }} icon={<UserOutlined style={{ color: '#64748b' }} />} />}
                                                        title={<Text strong>New Customer Inquiry</Text>}
                                                        description="Automated reply sent via Facebook"
                                                    />
                                                    <Tag color="success" style={{ borderRadius: "8px", padding: "2px 10px" }}>Replied</Tag>
                                                </List.Item>
                                            )}
                                        />
                                    ) : (
                                        <div style={{ padding: "40px 0" }}>
                                            <Empty description={<Text type="secondary">No recent activity yet.</Text>} />
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </Space>
                    )}

                    {activeTab === "auto" && (
                        <Card style={{ borderRadius: "24px", textAlign: "center", padding: "40px 20px" }}>
                            <RobotOutlined style={{ fontSize: "48px", color: "#6366f1", marginBottom: "16px" }} />
                            <Title level={4}>Automation Flows</Title>
                            <Paragraph style={{ color: "#64748b", marginBottom: "24px" }}>Manage your automated response keywords and business logic.</Paragraph>
                            <Button type="primary" size="large" icon={<PlusOutlined />} style={{ borderRadius: "12px", height: "50px", padding: "0 30px" }} onClick={() => router.push("/automation/facebook")}>
                                Manage Facebook Flows
                            </Button>
                        </Card>
                    )}

                    {activeTab === "stats" && (
                        <Card title={<Text strong>Traffic Analytics</Text>} style={{ borderRadius: "24px" }}>
                            <div style={{ padding: "40px", textAlign: "center" }}>
                                <BarChartOutlined style={{ fontSize: "40px", color: "#94a3b8", marginBottom: "16px" }} />
                                <Paragraph style={{ color: "#64748b" }}>Statistics and daily charts will appear here as your page grows.</Paragraph>
                            </div>
                        </Card>
                    )}

                    {activeTab === "profile" && (
                        <Card style={{ borderRadius: "24px" }}>
                            <div style={{ textAlign: "center", padding: "20px" }}>
                                <div style={{ position: "relative", display: "inline-block", marginBottom: "20px" }}>
                                    <Avatar size={90} icon={<UserOutlined />} style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", boxShadow: "0 10px 20px rgba(99, 102, 241, 0.2)" }} />
                                    <div style={{ position: "absolute", bottom: "5px", right: "0", background: "#22c55e", width: "22px", height: "22px", borderRadius: "50%", border: "4px solid #fff" }} />
                                </div>
                                <Title level={4} style={{ margin: 0 }}>Merchant User</Title>
                                <Text type="secondary">merchant@example.com</Text>
                                <div style={{ marginTop: "16px" }}>
                                    <Tag color="gold" style={{ padding: "6px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: 600, border: "none", boxShadow: "0 4px 10px rgba(234, 179, 8, 0.15)" }}>
                                        <ThunderboltOutlined /> PRO PLAN
                                    </Tag>
                                </div>
                            </div>
                            <Divider />
                            <Space direction="vertical" style={{ width: "100%" }}>
                                <Button block size="large" style={{ borderRadius: "12px", textAlign: "left" }}>Business Settings</Button>
                                <Button
                                    block
                                    size="large"
                                    icon={<CreditCardOutlined />}
                                    style={{ borderRadius: "12px", textAlign: "left" }}
                                    onClick={() => router.push("/dashboard/billing")}
                                >
                                    Billing History
                                </Button>
                                <Button block danger size="large" style={{ borderRadius: "12px", marginTop: "10px", fontWeight: 600 }} onClick={() => { localStorage.clear(); router.push("/login"); }}>Sign Out</Button>
                            </Space>
                        </Card>
                    )}
                </div>

                {/* Mobile Bottom Nav */}
                <div style={{
                    position: "fixed",
                    bottom: 20,
                    left: 20,
                    right: 20,
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    display: "flex",
                    justifyContent: "space-around",
                    padding: "12px 0",
                    borderRadius: "24px",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                    zIndex: 1000
                }}>
                    {tabItems.map((item) => (
                        <div
                            key={item.key}
                            onClick={() => setActiveTab(item.key)}
                            style={{
                                textAlign: "center",
                                width: "25%",
                                color: activeTab === item.key ? "#0f172a" : "#94a3b8",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                transform: activeTab === item.key ? "scale(1.1)" : "scale(1)"
                            }}
                        >
                            <div style={{ fontSize: "22px" }}>{item.icon}</div>
                            <div style={{ fontSize: "10px", marginTop: "4px", fontWeight: activeTab === item.key ? 700 : 500, opacity: activeTab === item.key ? 1 : 0.7 }}>{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthGuard>
    );
}
