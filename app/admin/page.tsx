"use client";

import { Card, Col, Row, Statistic } from "antd";
import {
    UserOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import AnalyticsChart from "@/components/AnalyticsChart";
import supabase from "@/lib/supabase";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        pending: 0,
        approved: 0,
        subscribers: 0,
        activeSubscribers: 0,
        monthlyRevenue: 0,
    });

    const loadStats = async () => {
        try {
            const now = new Date();
            const firstDayOfMonth = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            ).toISOString();

            const [
                usersRes,
                paymentsRes,
                subscriptionsRes,
                monthlyRevenueRes,
            ] = await Promise.all([
                // Users count
                supabase
                    .from("profiles")
                    .select("*", { count: "exact", head: true }),

                // All payments
                supabase.from("payments").select("status, amount, created_at"),

                // Subscriptions
                supabase
                    .from("subscriptions")
                    .select("status, expires_at"),

                // Monthly revenue (only approved this month)
                supabase
                    .from("payments")
                    .select("amount")
                    .eq("status", "approved")
                    .gte("created_at", firstDayOfMonth),
            ]);

            if (usersRes.error) throw usersRes.error;
            if (paymentsRes.error) throw paymentsRes.error;
            if (subscriptionsRes.error) throw subscriptionsRes.error;
            if (monthlyRevenueRes.error) throw monthlyRevenueRes.error;

            const usersCount = usersRes.count || 0;

            const pending =
                paymentsRes.data?.filter((p) => p.status === "pending").length || 0;

            const approved =
                paymentsRes.data?.filter((p) => p.status === "approved").length || 0;

            const subscribers = subscriptionsRes.data?.length || 0;

            const activeSubscribers =
                subscriptionsRes.data?.filter(
                    (s) =>
                        s.status === "active" &&
                        s.expires_at &&
                        new Date(s.expires_at) > now
                ).length || 0;

            // 💰 Calculate Monthly Revenue
            const monthlyRevenue =
                monthlyRevenueRes.data?.reduce(
                    (sum, p) => sum + Number(p.amount || 0),
                    0
                ) || 0;

            setStats({
                users: usersCount,
                pending,
                approved,
                subscribers,
                activeSubscribers,
                monthlyRevenue,
            });
        } catch (error) {
            console.error("Dashboard error:", error);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);


    console.log("monthly",stats.monthlyRevenue)


    const chartData = [
        { date: "Mon", users: 2 },
        { date: "Tue", users: 5 },
        { date: "Wed", users: 8 },
        { date: "Thu", users: 12 },
        { date: "Fri", users: 15 },
    ];

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={6}>
                <Card>
                    <Statistic
                        title="Total Users"
                        value={stats.users}
                        prefix={<UserOutlined />}
                    />
                </Card>
            </Col>

            <Col xs={24} md={12} lg={6}>
                <Card>
                    <Statistic
                        title="Monthly Revenue"
                        value={stats.monthlyRevenue}
                        precision={2}
                        prefix="฿"
                        valueStyle={{ color: "#52c41a" }}
                    />
                </Card>
            </Col>

            <Col xs={24} md={12} lg={6}>
                <Card>
                    <Statistic
                        title="Pending Payments"
                        value={stats.pending}
                        valueStyle={{ color: "#faad14" }}
                    />
                </Card>
            </Col>

            <Col xs={24} md={12} lg={6}>
                <Card>
                    <Statistic
                        title="Active Subscribers"
                        value={stats.activeSubscribers}
                        valueStyle={{ color: "#1677ff" }}
                        prefix={<TeamOutlined />}
                    />
                </Card>
            </Col>

            <Col span={24}>
                <Card style={{ marginTop: 24 }}>
                    <AnalyticsChart data={chartData} />
                </Card>
            </Col>
        </Row>
    );
}
