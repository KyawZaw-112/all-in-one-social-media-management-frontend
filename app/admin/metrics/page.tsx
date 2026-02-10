"use client";

import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import { supabase } from "@/lib/supabase";

type UserMetrics = {
    totalUsers?: number;
    activeUsers?: number;
    subscribedUsers?: number;
    churnedUsers?: number;
};

const metricsToShow: Array<{ key: keyof UserMetrics; label: string }> = [
    { key: "totalUsers", label: "Total Users" },
    { key: "activeUsers", label: "Active Users" },
    { key: "subscribedUsers", label: "Subscribed Users" },
    { key: "churnedUsers", label: "Churned Users" },
];

export default function AdminMetricsPage() {
    const [metrics, setMetrics] = useState<UserMetrics | null>(null);
    const [loading, setLoading] = useState(false);

    const getSessionToken = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        return session?.access_token;
    };

    const loadMetrics = useCallback(async () => {
        try {
            setLoading(true);
            const token = await getSessionToken();
            if (!token) {
                message.error("Not authenticated");
                return;
            }

            const response = await fetch("/api/admin/metrics", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                message.error("Failed to load user metrics");
                return;
            }

            const data = await response.json();
            setMetrics(data ?? {});
        } catch {
            message.error("Failed to load user metrics");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMetrics();
    }, [loadMetrics]);

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">User Metrics</h1>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {metricsToShow.map(({ key, label }) => (
                    <div key={key} className="rounded-lg border p-4">
                        <div className="text-sm text-gray-500">{label}</div>
                        <div className="mt-2 text-2xl font-semibold">
                            {loading ? "..." : (metrics?.[key] ?? 0)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
