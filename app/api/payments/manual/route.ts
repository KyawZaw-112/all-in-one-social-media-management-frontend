import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            user_id,
            reference,
            amount,
            proof_url,
        } = body;

        if (!user_id || !reference || !proof_url) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const { error } = await supabase.from("payments").insert({
            user_id,
            amount,
            currency: "MM",
            method: "kbz",
            transaction_id: reference,
            proof_url,
            status: "pending",
        });

        if (error) {
            console.error(error);
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
