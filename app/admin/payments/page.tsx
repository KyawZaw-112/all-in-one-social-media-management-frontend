"use client";

import { useEffect, useState, useCallback } from "react";
import { message } from "antd";
import { supabase } from "@/lib/supabase";

type Payment = {
    id: string;
    user_id: string;
    plan: string;
    reference: string;
    created_at: string;
    profiles: {
        email: string;
    }[];
};

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);

    const getSessionToken = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        return session?.access_token;
    };

    const loadPayments = useCallback(async () => {
        try {
            setLoading(true);
            const token = await getSessionToken();
            if (!token) {
                message.error("Not authenticated");
                return;
            }
            const res = await fetch("/api/admin/payments/pending", {
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (!res.ok) {
                message.error("Failed to load");
                return;
            }
            const data = await res.json();
            setPayments(data ?? []);
        } catch {
            message.error("Failed to load payments");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleApprove = async (paymentId: string) => {
        try {
            const token = await getSessionToken();
            if (!token) {
                message.error("Not authenticated");
                return;
            }
            const res = await fetch("/api/admin/payments/approve", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ paymentId }),
            });
            if (!res.ok) {
                message.error("Failed to approve");
                return;
            }
            message.success("Payment approved");
            loadPayments();
        } catch {
            message.error("Failed to approve payment");
        }
    };

    useEffect(() => {
        loadPayments();
    }, [loadPayments]);

    return (
        <div className="space-y-3">
            {payments.map((p) => (
                <div key={p.id} className="border p-3 rounded">
                    <div>
                        Email: {p.profiles?.[0]?.email ?? "Unknown"}
                    </div>
                    <div>Plan: {p.plan}</div>
                    <div>Reference: {p.reference}</div>

                    <button
                        className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
                        onClick={() => handleApprove(p.id)}
                        disabled={loading}
                    >
                        Approve
                    </button>
                </div>
            ))}

            {!payments.length && !loading && (
                <div className="text-gray-500">No pending payments</div>
            )}
        </div>
    );
}
