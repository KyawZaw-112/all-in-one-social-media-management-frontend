"use client";

import { Card, Col, Row, Statistic } from "antd";
import {
    UserOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import AnalyticsChart from "@/components/AnalyticsChart";
import axios from "axios";
import { API_URL } from "@/lib/apiConfig";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        pending: 0,
        approved: 0,
        subscribers: 0,
        activeSubscribers: 0,
        monthlyRevenue: 0,
    });

    const [chartData, setChartData] = useState([]);

    const loadStats = async () => {
        try {
            const token = localStorage.getItem("authToken");

            const res = await axios.get(`${API_URL}/api/admin/system-stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                const data = res.data.data;
                setStats({
                    users: data.totalUsers,
                    pending: data.pendingPayments,
                    approved: data.activeSubs,
                    subscribers: data.planDistribution.shop + data.planDistribution.cargo,
                    activeSubscribers: data.activeSubs,
                    monthlyRevenue: data.monthlyRevenue,
                });
                if (data.chartData) {
                    setChartData(data.chartData);
                }
            }
        } catch (error) {
            console.error("Dashboard error:", error);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={6}>
                <Card bordered={false} style={{ borderRadius: 16 }}>
                    <Statistic
                        title="Total Merchants"
                        value={stats.users}
                        prefix={<TeamOutlined style={{ color: '#1677ff' }} />}
                    />
                </Card>
            </Col>

            <Col xs={24} md={12} lg={6}>
                <Card bordered={false} style={{ borderRadius: 16 }}>
                    <Statistic
                        title="Monthly Revenue"
                        value={stats.monthlyRevenue}
                        precision={0}
                        suffix="Ks"
                        prefix={<span style={{ fontSize: 18 }}>💰</span>}
                        valueStyle={{ color: "#52c41a" }}
                    />
                </Card>
            </Col>

            <Col xs={24} md={12} lg={6}>
                <Card bordered={false} style={{ borderRadius: 16 }}>
                    <Statistic
                        title="Pending Reviews"
                        value={stats.pending}
                        valueStyle={{ color: "#faad14" }}
                        prefix={<UserOutlined />}
                    />
                </Card>
            </Col>

            <Col xs={24} md={12} lg={6}>
                <Card bordered={false} style={{ borderRadius: 16 }}>
                    <Statistic
                        title="Active Subscriptions"
                        value={stats.activeSubscribers}
                        valueStyle={{ color: "#722ed1" }}
                        prefix={<TeamOutlined />}
                    />
                </Card>
            </Col>

            <Col span={24}>
                <Card style={{ marginTop: 24, borderRadius: 16 }} title="Growth Overview">
                    <AnalyticsChart data={chartData} />
                </Card>
            </Col>
        </Row>
    );
}
