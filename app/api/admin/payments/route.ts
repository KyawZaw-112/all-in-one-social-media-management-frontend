import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    const { data, error } = await supabase
        .from("payment_approvals")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ payments: data });
}

export async function PATCH(req: NextRequest) {
    const { id, status } = await req.json();

    const { error } = await supabase
        .from("payment_approvals")
        .update({
            status,
            approved_at: status === "approved" ? new Date() : null,
        })
        .eq("id", id);

    if (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
