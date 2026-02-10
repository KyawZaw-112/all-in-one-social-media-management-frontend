import { supabase } from "@/lib/supabase";

type AdminRecord = {
    role?: string | null;
    is_active?: boolean | null;
};

function hasAdminAccess(record: AdminRecord | null) {
    if (!record) return false;

    const roleAllowed = !record.role || record.role === "admin";
    const activeAllowed = record.is_active !== false;

    return roleAllowed && activeAllowed;
}

async function getSessionToken() {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token ?? null;
}

async function checkViaTables(userId: string) {
    const { data: adminData, error: adminError } = await supabase
        .from("admin_users")
        .select("role, is_active")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();

    if (!adminError && hasAdminAccess((adminData as AdminRecord | null) ?? null)) {
        return true;
    }

    const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role, is_active")
        .eq("id", userId)
        .limit(1)
        .maybeSingle();

    if (!profileError && hasAdminAccess((profileData as AdminRecord | null) ?? null)) {
        return true;
    }

    return false;
}

async function checkViaBackend() {
    const token = await getSessionToken();
    if (!token) return false;

    const response = await fetch("/api/admin/metrics", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.ok;
}

export async function checkCurrentSessionAdminAccess() {
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return false;

        // Prefer direct role mapping checks first (works even if backend URL is misconfigured).
        if (await checkViaTables(user.id)) {
            return true;
        }

        // Fallback to backend authorization as final source of truth.
        return await checkViaBackend();
    } catch {
        return false;
    }
}
