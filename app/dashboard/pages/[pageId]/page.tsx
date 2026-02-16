"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase";
import { fetchWithAuth } from "@/lib/api";

interface Rule {
    id: string;
    keyword: string;
    reply_text: string;
    match_type: string;
    enabled: boolean;
}

export default function PageRules() {
    const { pageId } = useParams();

    const [rules, setRules] = useState<Rule[]>([]);
    const [keyword, setKeyword] = useState("");
    const [replyText, setReplyText] = useState("");
    const [matchType, setMatchType] = useState("contains");
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
        if (!keyword || !replyText) return alert("Fill all fields");

        const token = await getToken();
        if (!token) return;

        const newRule = await fetchWithAuth("rules", token, {
            method: "POST",
            body: JSON.stringify({
                page_id: pageId,
                keyword,
                reply_text: replyText,
                match_type: matchType,
            }),
        });

        if (!newRule?.id) {
            alert("Failed to create rule");
            return;
        }

        setRules((prev) => [...prev, newRule]);
        setKeyword("");
        setReplyText("");
        setMatchType("contains");
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
                page_id: String(pageId),
                keyword: rule.keyword,
                reply_text: rule.reply_text,
                match_type: rule.match_type,
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
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">
                Auto Reply Rules
            </h1>

            {/* Create Rule Card */}
            <div className="bg-white shadow rounded-lg p-6 mb-8 space-y-4 border">
                <h2 className="text-lg font-medium">Create New Rule</h2>

                <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />

                <select
                    className="w-full border rounded px-3 py-2"
                    value={matchType}
                    onChange={(e) => setMatchType(e.target.value)}
                >
                    <option value="contains">Contains</option>
                    <option value="exact">Exact Match</option>
                    <option value="starts_with">Starts With</option>
                    <option value="fallback">Fallback</option>
                </select>

                <textarea
                    className="w-full border rounded px-3 py-2"
                    placeholder="Reply message"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                />

                <button
                    onClick={createRule}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                >
                    Add Rule
                </button>
            </div>

            {/* Rules List */}
            <div className="space-y-4">
                {rules.map((rule) => (
                    <div
                        key={rule.id}
                        className="border rounded-lg p-4 flex justify-between items-center shadow-sm"
                    >
                        <div>
                            <div className="font-medium">
                                {rule.keyword}
                            </div>

                            <div className="text-sm text-gray-500">
                                Match: {rule.match_type}
                            </div>

                            <div className="text-sm mt-1">
                                {rule.reply_text}
                            </div>

                            <div
                                className={`text-xs mt-2 font-medium ${
                                    rule.enabled
                                        ? "text-green-600"
                                        : "text-gray-400"
                                }`}
                            >
                                {rule.enabled ? "Enabled" : "Disabled"}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => toggleRule(rule)}
                                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                            >
                                Toggle
                            </button>

                            <button
                                onClick={() => deleteRule(rule.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded text-sm"
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
