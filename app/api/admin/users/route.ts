import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        const { data: subs, error } = await supabase
            .from("subscriptions")
            .select("*");

        if (error) throw error;

        const { data: authData } =
            await supabase.auth.admin.listUsers();

        const { data: logs } = await supabase
            .from("login_logs")
            .select("*");

        const users = subs.map((sub) => {
            const authUser = authData.users.find(
                (u) => u.id === sub.user_id
            );

            const userLogs = logs?.filter(
                (l) => l.user_id === sub.user_id
            );

            const lastLogin =
                userLogs?.sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                )[0] || null;

            return {
                ...sub,
                email: authUser?.email || "Unknown",
                last_sign_in_at:
                    authUser?.last_sign_in_at || null,
                login_count: userLogs?.length,
                device: lastLogin?.device || "-",
                country: lastLogin?.country || "-",
                browser: lastLogin?.browser || "-",
            };
        });

        return NextResponse.json({ users });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}
