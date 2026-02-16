"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import  supabase  from "@/lib/supabase";
import { fetchWithAuth } from "@/lib/api";

interface Rule {
    id: string;
    keyword: string;
    reply_text: string;
    enabled: boolean;
}

export default function PageRules() {
    const { pageId } = useParams();
    const [rules, setRules] = useState<Rule[]>([]);
    const [keyword, setKeyword] = useState("");
    const [replyText, setReplyText] = useState("");
    const [loading, setLoading] = useState(true);

    async function getToken() {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        return session?.access_token;
    }

    async function loadRules() {
        const token = await getToken();
        if (!token) return;

        const data = await fetchWithAuth(`rules/${pageId}`, token);
        setRules(Array.isArray(data) ? data : []);
        setLoading(false);
    }

    async function createRule() {
        const token = await getToken();
        if (!token) return;

        const newRule = await fetchWithAuth("rules", token, {
            method: "POST",
            body: JSON.stringify({
                page_id: pageId,
                keyword,
                reply_text: replyText,
            }),
        });

        setRules((prev) => [...prev, newRule]);
        setKeyword("");
        setReplyText("");
    }

    async function deleteRule(id: string) {
        const token = await getToken();
        if (!token) return;

        await fetchWithAuth(`rules/${id}`, token, {
            method: "DELETE",
        });

        setRules((prev) => prev.filter((r) => r.id !== id));
    }

    async function toggleRule(rule: Rule) {
        const token = await getToken();
        if (!token) return;

        const updated = await fetchWithAuth(`rules/${rule.id}`, token, {
            method: "PUT",
            body: JSON.stringify({
                keyword: rule.keyword,
                reply_text: rule.reply_text,
                enabled: !rule.enabled,
            }),
        });

        setRules((prev) =>
            prev.map((r) => (r.id === rule.id ? updated : r))
        );
    }

    useEffect(() => {
        loadRules();
    }, []);

    if (loading) return <div className="p-6">Loading rules...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">
                Auto Reply Rules
            </h1>

            {/* Create Rule */}
            <div className="mb-6 space-y-2">
                <input
                    className="border p-2 w-full"
                    placeholder="Keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />

                <textarea
                    className="border p-2 w-full"
                    placeholder="Reply text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                />

                <button
                    onClick={createRule}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add Rule
                </button>
            </div>

            {/* Rule List */}
            <div className="space-y-4">
                {rules?.filter(Boolean).map((rule) => (
                    <div
                        key={rule.id}
                        className="border rounded p-4 flex justify-between items-center"
                    >
                        <div>
                            <div className="font-medium">
                                Keyword: {rule.keyword}
                            </div>
                            <div className="text-sm text-gray-600">
                                Reply: {rule.reply_text}
                            </div>
                            <div className="text-sm">
                                Status: {rule.enabled ? "Enabled" : "Disabled"}
                            </div>
                        </div>

                        <div className="space-x-2">
                            <button
                                onClick={() => toggleRule(rule)}
                                className="px-3 py-1 bg-yellow-500 text-white rounded"
                            >
                                Toggle
                            </button>

                            <button
                                onClick={() => deleteRule(rule.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
