import { NextResponse } from "next/server";
import  supabase  from "@/lib/supabase";

export async function GET() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ facebook: false });
    }

    const { data } = await supabase
        .from("social_connections")
        .select("platform, connected")
        .eq("user_id", user.id);

    return NextResponse.json({
        facebook: data?.some(
            (c) => c.platform === "facebook" && c.connected
        ),
    });
}
