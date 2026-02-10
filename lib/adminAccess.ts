import { supabase } from "@/lib/supabase";

async function getSessionToken() {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token ?? null;
}

export async function checkCurrentSessionAdminAccess() {
    try {
        const token = await getSessionToken();
        if (!token) return false;

        // Use backend-protected admin endpoint as the source of truth.
        const response = await fetch("/api/admin/metrics", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.ok;
    } catch {
        return false;
    }
}
