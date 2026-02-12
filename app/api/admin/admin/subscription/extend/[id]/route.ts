import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const { data: sub, error } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !sub) throw new Error("Subscription not found");

        const currentExpiry = new Date(sub.expires_at);
        const newExpiry = new Date(
            currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000
        );

        const { error: updateError } = await supabase
            .from("subscriptions")
            .update({ expires_at: newExpiry.toISOString() })
            .eq("id", id);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
    }
}
