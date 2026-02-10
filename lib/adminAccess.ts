import { supabase } from "@/lib/supabase";

export type AdminRecord = {
    role?: string | null;
    is_active?: boolean | null;
};

function hasAdminAccess(record: AdminRecord | null) {
    if (!record) return false;

    const roleAllowed = !record.role || record.role === "admin";
    const activeAllowed = record.is_active !== false;

    return roleAllowed && activeAllowed;
}

export async function checkCurrentUserAdminAccess(userId: string) {
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

    if (profileError) {
        return false;
    }

    return hasAdminAccess((profileData as AdminRecord | null) ?? null);
}
