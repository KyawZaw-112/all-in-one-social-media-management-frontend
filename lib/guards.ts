import  supabase  from "./supabase";
import {checkCurrentUserAdminAccess} from "@/lib/adminAccess";

export async function requireAdmin() {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) throw new Error("Not authenticated");

    const hasAccess = await checkCurrentUserAdminAccess(session.user.id)

    if (!hasAccess) {
        throw new Error("Admin only");
    }
}
