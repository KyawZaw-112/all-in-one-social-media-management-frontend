"use client";

import { useState, useEffect } from "react";
import {
    Table,
    Tag,
    Space,
    Button,
    Typography,
    Card,
    Modal,
    message,
    Popconfirm,
    Empty,
    Spin,
    Divider
} from "antd";
import {
    DeleteOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined,
    BugOutlined,
    EyeOutlined
} from "@ant-design/icons";
import axios from "axios";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFestivalTheme } from "@/lib/ThemeContext";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";

const { Title, Text, Paragraph } = Typography;

const API_URL = process.env.APP_URL || "http://localhost:4000";

const LogsPage = () => {
    const { t, language } = useLanguage();
    const { mode } = useFestivalTheme();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState<any>(null);

    const isDark = mode === 'dark';

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.get(`${API_URL}/api/system-logs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch logs");
            message.error("Failed to load logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleResolve = async (id: string) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.put(`${API_URL}/api/system-logs/${id}/resolve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success(t.logs.resolved);
            fetchLogs();
        } catch (err) {
            message.error("Action failed");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`${API_URL}/api/system-logs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success("Deleted successfully");
            fetchLogs();
        } catch (err) {
            message.error("Delete failed");
        }
    };

    const columns = [
        {
            title: t.logs.level,
            dataIndex: "level",
            key: "level",
            width: 120,
            render: (level: string) => {
                let color = "blue";
                let icon = <InfoCircleOutlined />;
                if (level === "error") { color = "red"; icon = <BugOutlined />; }
                if (level === "warn") { color = "orange"; icon = <ExclamationCircleOutlined />; }
                return <Tag icon={icon} color={color}>{level.toUpperCase()}</Tag>;
            }
        },
        {
            title: t.logs.message,
            dataIndex: "message",
            key: "message",
            render: (text: string, record: any) => (
                <Space direction="vertical" size={0}>
                    <Text strong style={{ color: isDark ? '#f8fafc' : '#1e293b' }}>{text}</Text>
                    <Text type="secondary" className="text-xs">
                        {new Date(record.created_at).toLocaleString()}
                    </Text>
                </Space>
            )
        },
        {
            title: "Status",
            dataIndex: "is_resolved",
            key: "is_resolved",
            width: 120,
            render: (resolved: boolean) => (
                <Tag color={resolved ? "success" : "processing"}>
                    {resolved ? t.logs.resolved : "NEW"}
                </Tag>
            )
        },
        {
            title: t.common.actions,
            key: "actions",
            width: 200,
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => setSelectedLog(record)}
                    />
                    {!record.is_resolved && (
                        <Button
                            type="primary"
                            size="small"
                            icon={<CheckCircleOutlined />}
                            onClick={() => handleResolve(record.id)}
                        >
                            {t.logs.resolve}
                        </Button>
                    )}
                    <Popconfirm
                        title={t.logs.confirmDelete}
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <AuthGuard>
            <div style={{
                minHeight: "100vh",
                backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                transition: 'background-color 0.3s'
            }}>
                <Navbar />
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
                    <Card style={{
                        borderRadius: 16,
                        border: 'none',
                        boxShadow: isDark ? '0 4px 6px -1px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.1)',
                        backgroundColor: isDark ? '#1e293b' : '#fff'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <div>
                                <Title level={2} style={{ margin: 0, color: isDark ? '#f8fafc' : '#1e293b' }}>
                                    {t.logs.title}
                                </Title>
                                <Text type="secondary">Monitor system health and track errors</Text>
                            </div>
                            <Button onClick={fetchLogs} loading={loading}>Refresh</Button>
                        </div>

                        <Table
                            columns={columns}
                            dataSource={logs}
                            rowKey="id"
                            loading={loading}
                            pagination={{ pageSize: 10 }}
                            locale={{ emptyText: <Empty description={t.logs.noLogs} /> }}
                        />
                    </Card>
                </div>

                <Modal
                    title={t.logs.details}
                    open={!!selectedLog}
                    onCancel={() => setSelectedLog(null)}
                    footer={[
                        <Button key="close" onClick={() => setSelectedLog(null)}>Close</Button>
                    ]}
                    width={800}
                    styles={{ body: { backgroundColor: isDark ? '#1e293b' : '#fff' } }}
                >
                    {selectedLog && (
                        <div style={{ color: isDark ? '#f8fafc' : '#1e293b' }}>
                            <Paragraph>
                                <Text strong>Message:</Text> {selectedLog.message}
                            </Paragraph>
                            <Paragraph>
                                <Text strong>Time:</Text> {new Date(selectedLog.created_at).toLocaleString()}
                            </Paragraph>
                            <Divider />
                            <Title level={5}>Details</Title>
                            <pre style={{
                                backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
                                padding: 12,
                                borderRadius: 8,
                                color: isDark ? '#94a3b8' : '#475569',
                                overflow: 'auto'
                            }}>
                                {JSON.stringify(selectedLog.details, null, 2)}
                            </pre>
                            {selectedLog.stack && (
                                <>
                                    <Divider />
                                    <Title level={5}>Stack Trace</Title>
                                    <pre style={{
                                        backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
                                        padding: 12,
                                        borderRadius: 8,
                                        color: isDark ? '#ef4444' : '#b91c1c',
                                        fontSize: 12,
                                        overflow: 'auto',
                                        maxHeight: 300
                                    }}>
                                        {selectedLog.stack}
                                    </pre>
                                </>
                            )}
                        </div>
                    )}
                </Modal>
            </div>
        </AuthGuard>
    );
};

export default LogsPage;
