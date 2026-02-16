"use client";

import { useEffect, useState } from "react";
import { getPlatforms } from "@/lib/api";
import  supabase  from "@/lib/supabase";

interface Platform {
    id: string;
    page_id: string;
    page_name: string;
    platform: string;
}

export default function PagesListPage() {
    const [pages, setPages] = useState<Platform[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadPages() {
            try {
                setLoading(true);

                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (!session?.access_token) {
                    throw new Error("Not authenticated");
                }

                const data = await getPlatforms(session.access_token);

                setPages(data || []);
            } catch (err: any) {
                console.error("Failed to load pages:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadPages();
    }, []);

    if (loading) {
        return <div className="p-6">Loading pages...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-red-500">
                Error loading pages: {error}
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Connected Pages</h1>

            {pages.length === 0 ? (
                <div>No connected pages yet</div>
            ) : (
                <div className="space-y-4">
                    {pages.map((page) => (
                        <div
                            key={page.id}
                            className="border rounded-lg p-4 shadow-sm"
                        >
                            <div className="font-medium">{page.page_name}</div>
                            <div className="text-sm text-gray-500">
                                Platform: {page.platform}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
