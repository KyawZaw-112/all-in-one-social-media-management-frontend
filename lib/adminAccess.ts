import supabase from "@/lib/supabase";

export type AdminRecord = {
    [key: string]: unknown;
    role?: string | null;
    is_active?: boolean | null;
};

export function hasAdminAccess(record: AdminRecord | null): boolean {
    if (!record) return false;

    const isActive = record.is_active !== false; // treat null as active
    const isAdmin = record.role?.toLowerCase() === "admin";

    return isActive && isAdmin;
}


export async function checkCurrentUserAdminAccess(userId: string) {
    const {data: adminData, error: adminError} = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();
    // ADD THESE LOGS:
    console.log('Admin data query:', {adminData, adminError});
    console.log('Has admin access from admin_users:', hasAdminAccess(adminData));

    if (!adminError && hasAdminAccess((adminData as AdminRecord | null) ?? null, "admin_users")) {
        return true;
    }

    const {data: profileData, error: profileError} = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .limit(1)
        .maybeSingle();

    if (profileError) {
        return false;
    }

    return hasAdminAccess((profileData as AdminRecord | null) ?? null, "profiles");
}
