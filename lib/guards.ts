import { supabase } from "./supabase";

export async function requireAdmin() {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) throw new Error("Not authenticated");

    const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

    if (data?.role !== "admin") {
        throw new Error("Admin only");
    }
}
