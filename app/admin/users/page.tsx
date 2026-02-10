"use client";

import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import { supabase } from "@/lib/supabase";

type User = {
    id: string;
    email: string;
    full_name?: string;
    subscription_status?: string;
    created_at?: string;
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const getSessionToken = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        return session?.access_token;
    };

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const token = await getSessionToken();
            if (!token) {
                message.error("Not authenticated");
                return;
            }

            const response = await fetch("/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                message.error("Failed to load users");
                return;
            }

            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch {
            message.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">User Management</h1>

            <div className="overflow-x-auto rounded border">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Subscription</th>
                        <th className="px-4 py-2">Joined</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-t">
                            <td className="px-4 py-2">{user.full_name ?? "-"}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2">{user.subscription_status ?? "free"}</td>
                            <td className="px-4 py-2">
                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                            </td>
                        </tr>
                    ))}
                    {!users.length && !loading && (
                        <tr>
                            <td className="px-4 py-3 text-gray-500" colSpan={4}>
                                No users found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
