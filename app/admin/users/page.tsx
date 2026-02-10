"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { supabase } from "@/lib/supabase";

type User = {
    id: string;
    email: string;
    full_name?: string;
    subscription_status?: string;
    role?: string;
    is_active?: boolean;
    created_at?: string;
};

type UserPayload = {
    email: string;
    full_name?: string;
    subscription_status?: string;
    role?: string;
    is_active?: boolean;
};

const emptyForm: UserPayload = {
    email: "",
    full_name: "",
    subscription_status: "free",
    role: "user",
    is_active: true,
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [createForm, setCreateForm] = useState<UserPayload>(emptyForm);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<UserPayload>(emptyForm);

    const editingUser = useMemo(
        () => users.find((u) => u.id === editingUserId) ?? null,
        [users, editingUserId]
    );

    const getSessionToken = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        return session?.access_token;
    };

    const authHeaders = useCallback(async () => {
        const token = await getSessionToken();
        if (!token) {
            throw new Error("Not authenticated");
        }

        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    }, []);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const headers = await authHeaders();
            const response = await fetch("/api/admin/users", { headers });

            if (!response.ok) {
                message.error("Failed to load users");
                return;
            }

            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            message.error(error instanceof Error ? error.message : "Failed to load users");
        } finally {
            setLoading(false);
        }
    }, [authHeaders]);

    const resetCreateForm = () => setCreateForm(emptyForm);

    const handleCreateUser = async () => {
        if (!createForm.email.trim()) {
            message.error("Email is required");
            return;
        }

        try {
            setSubmitting(true);
            const headers = await authHeaders();
            const response = await fetch("/api/admin/users", {
                method: "POST",
                headers,
                body: JSON.stringify(createForm),
            });

            if (!response.ok) {
                message.error("Failed to create user");
                return;
            }

            message.success("User created");
            resetCreateForm();
            await loadUsers();
        } catch (error) {
            message.error(error instanceof Error ? error.message : "Failed to create user");
        } finally {
            setSubmitting(false);
        }
    };

    const beginEdit = (user: User) => {
        setEditingUserId(user.id);
        setEditForm({
            email: user.email ?? "",
            full_name: user.full_name ?? "",
            subscription_status: user.subscription_status ?? "free",
            role: user.role ?? "user",
            is_active: user.is_active ?? true,
        });
    };

    const handleUpdateUser = async () => {
        if (!editingUserId) return;

        try {
            setSubmitting(true);
            const headers = await authHeaders();
            const response = await fetch(`/api/admin/users/${editingUserId}`, {
                method: "PUT",
                headers,
                body: JSON.stringify(editForm),
            });

            if (!response.ok) {
                message.error("Failed to update user");
                return;
            }

            message.success("User updated");
            setEditingUserId(null);
            await loadUsers();
        } catch (error) {
            message.error(error instanceof Error ? error.message : "Failed to update user");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm("Delete this user?")) {
            return;
        }

        try {
            setSubmitting(true);
            const headers = await authHeaders();
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE",
                headers,
            });

            if (!response.ok) {
                message.error("Failed to delete user");
                return;
            }

            message.success("User deleted");
            await loadUsers();
        } catch (error) {
            message.error(error instanceof Error ? error.message : "Failed to delete user");
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">User Management Dashboard</h1>

            <div className="rounded border p-4 space-y-3">
                <h2 className="text-lg font-semibold">Create User</h2>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                    <input
                        className="border rounded px-3 py-2"
                        placeholder="Email"
                        value={createForm.email}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
                    />
                    <input
                        className="border rounded px-3 py-2"
                        placeholder="Full name"
                        value={createForm.full_name ?? ""}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, full_name: e.target.value }))}
                    />
                    <input
                        className="border rounded px-3 py-2"
                        placeholder="Subscription status"
                        value={createForm.subscription_status ?? ""}
                        onChange={(e) =>
                            setCreateForm((prev) => ({ ...prev, subscription_status: e.target.value }))
                        }
                    />
                    <input
                        className="border rounded px-3 py-2"
                        placeholder="Role"
                        value={createForm.role ?? ""}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, role: e.target.value }))}
                    />
                    <button
                        className="bg-blue-600 text-white px-3 py-2 rounded disabled:opacity-50"
                        onClick={handleCreateUser}
                        disabled={submitting}
                    >
                        Create
                    </button>
                </div>
            </div>

            {editingUser && (
                <div className="rounded border p-4 space-y-3">
                    <h2 className="text-lg font-semibold">Edit User</h2>
                    <div className="text-sm text-gray-500">ID: {editingUser.id}</div>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                        <input
                            className="border rounded px-3 py-2"
                            placeholder="Email"
                            value={editForm.email}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                        />
                        <input
                            className="border rounded px-3 py-2"
                            placeholder="Full name"
                            value={editForm.full_name ?? ""}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, full_name: e.target.value }))}
                        />
                        <input
                            className="border rounded px-3 py-2"
                            placeholder="Subscription status"
                            value={editForm.subscription_status ?? ""}
                            onChange={(e) =>
                                setEditForm((prev) => ({ ...prev, subscription_status: e.target.value }))
                            }
                        />
                        <input
                            className="border rounded px-3 py-2"
                            placeholder="Role"
                            value={editForm.role ?? ""}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value }))}
                        />
                        <div className="flex gap-2">
                            <button
                                className="bg-green-600 text-white px-3 py-2 rounded disabled:opacity-50"
                                onClick={handleUpdateUser}
                                disabled={submitting}
                            >
                                Save
                            </button>
                            <button
                                className="bg-gray-300 px-3 py-2 rounded"
                                onClick={() => setEditingUserId(null)}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto rounded border">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Role</th>
                            <th className="px-4 py-2">Subscription</th>
                            <th className="px-4 py-2">Joined</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-t">
                                <td className="px-4 py-2">{user.full_name ?? "-"}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">{user.role ?? "user"}</td>
                                <td className="px-4 py-2">{user.subscription_status ?? "free"}</td>
                                <td className="px-4 py-2">
                                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                                </td>
                                <td className="px-4 py-2">
                                    <div className="flex gap-2">
                                        <button
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                                            onClick={() => beginEdit(user)}
                                            disabled={submitting}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                                            onClick={() => handleDeleteUser(user.id)}
                                            disabled={submitting}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!users.length && !loading && (
                            <tr>
                                <td className="px-4 py-3 text-gray-500" colSpan={6}>
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
