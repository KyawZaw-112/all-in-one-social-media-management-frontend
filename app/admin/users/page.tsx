"use client";

import {useEffect, useState} from "react";
import {Table, Card, Typography, Input, Space, Tag} from "antd";
import type {ColumnsType} from "antd/es/table";
import supabase from "@/lib/supabase";

const {Title, Text} = Typography;
const {Search} = Input;

interface User {
    id: string;
    user_id: string;
    email: string;
    last_sign_in_at: string | null;
    plan: string;
    status: string;
    country: string;
    expires_at: string;
    created_at: string;
}


export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [filtered, setFiltered] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [now, setNow] = useState(Date.now());
    console.log("Users:", users);

    const fetchUsers = async () => {
        setLoading(true);

        const {
            data: {session},
        } = await supabase.auth.getSession();

        if (!session) {
            setLoading(false);
            return;
        }

        const res = await fetch("/api/admin/users", {
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        if (!res.ok) {
            setLoading(false);
            return;
        }

        const data = await res.json();

        setUsers(data.users || []);
        setFiltered(data.users || []);
        setLoading(false);
    };

    const onSearch = (value: string) => {
        const keyword = value.toLowerCase();

        const filteredData = users.filter((u) =>
            u.email?.toLowerCase().includes(keyword)
        );

        setFiltered(filteredData);
    };


    const extendSubscription = async (id: string) => {
        await fetch(`/api/admin/subscription/extend/${id}`, {
            method: "POST",
        });

        fetchUsers();
    };

    const timeAgo = (dateString: string) => {
        const past = new Date(dateString);
        const diff = Math.floor((now - past.getTime()) / 1000);

        if (diff < 60) return "Just now";

        const minutes = Math.floor(diff / 60);
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? "s" : ""} ago`;
    };


    const getLoginStatus = (dateString: string | null) => {
        if (!dateString) {
            return {color: "default", text: "Never"};
        }

        const now = Date.now();
        const past = new Date(dateString).getTime();
        const diffMinutes = (now - past) / 1000 / 60;

        if (diffMinutes <= 5) {
            return {color: "green", text: "Online"};
        }

        if (diffMinutes <= 60) {
            return {color: "gold", text: "Recently Active"};
        }

        const diffDays = diffMinutes / 60 / 24;

        if (diffDays > 7) {
            return {color: "red", text: "Inactive"};
        }

        return {color: "default", text: "Offline"};
    };


    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 60000);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        fetchUsers();
    }, []);

    const columns: ColumnsType<User> = [
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Last Login",
            render: (_, record) => {
                const status = getLoginStatus(record.last_sign_in_at);

                return (
                    <div style={{display: "flex", alignItems: "center", gap: 8}}>
                        <Tag color={status.color}>{status.text}</Tag>

                        {record.last_sign_in_at && (
                            <span style={{color: "#888", fontSize: 12}}>
            ({timeAgo(record.last_sign_in_at)})
          </span>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Plan",
            dataIndex: "plan",
        },
        {
            title: "Country",
            dataIndex: "country",
        },
        {
            title: "Status",
            render: (_, record) => {
                const isExpired =
                    new Date(record.expires_at) < new Date();

                return (
                    <Tag color={isExpired ? "red" : "green"}>
                        {isExpired ? "Expired" : "Active"}
                    </Tag>
                );
            },
        },
        {
            title: "Expires",
            render: (_, record) => {
                const isExpired =
                    new Date(record.expires_at) < new Date();

                return (
                    <span style={{color: isExpired ? "red" : "inherit"}}>
          {new Date(record.expires_at).toLocaleDateString()}
        </span>
                );
            },
        },
        {
            title: "Device",
            dataIndex: "device",
        },

        {
            title: "Browser",
            dataIndex: "browser",
        },

        {
            title: "Country",
            dataIndex: "country",
        },

        {
            title: "Logins",
            dataIndex: "login_count",
        },
        {
            title: "Actions",
            render: (_, record) => (
                <>
                    <button
                        onClick={() => extendSubscription(record.id)}
                        style={{
                            background: "#1677ff",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: 6,
                            cursor: "pointer",
                        }}
                    >
                        +30 Days
                    </button>
                    <button
                        onClick={() =>
                            fetch(`/api/admin/force-logout/${record.user_id}`, {
                                method: "POST",
                            })
                        }
                    >
                        Force Logout
                    </button>
                </>
            ),
        },
    ];


    return (
        <Card style={{borderRadius: 12}} styles={{body: {padding: 24}}}>
            <Space orientation="vertical" size="large" style={{width: "100%"}}>
                <Space
                    style={{
                        width: "100%",
                        justifyContent: "space-between",
                    }}
                >
                    <Title level={3} style={{margin: 0}}>
                        Subscribed Users
                    </Title>
                    <Text type="secondary">Total: {users.length}</Text>
                </Space>

                <Search
                    placeholder="Search by User Email"
                    allowClear
                    onChange={(e) => onSearch(e.target.value)}
                    style={{maxWidth: 300}}
                />

                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    loading={loading}
                    pagination={{pageSize: 8}}
                />
            </Space>
        </Card>
    );
}
