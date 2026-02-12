import { NextRequest, NextResponse } from "next/server";
import {UAParser} from "ua-parser-js";
import {createClient} from "@supabase/supabase-js";


export async function POST(req: NextRequest) {
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);
    try {
        const body = await req.json();
        const { user_id, email } = body;

        if (!user_id) {
            return NextResponse.json(
                { error: "Missing user_id" },
                { status: 400 }
            );
        }

        // 1️⃣ Get IP
        const forwarded = req.headers.get("x-forwarded-for");
        const ip =
            forwarded?.split(",")[0] ||
            req.headers.get("x-real-ip") ||
            "8.8.8.8"; // fallback for dev

        // 2️⃣ Parse User Agent
        const userAgent = req.headers.get("user-agent") || "";
        const parser = new UAParser(userAgent);
        const ua = parser.getResult();

        const browser = ua.browser.name || "Unknown";
        const device = ua.device.type || "Desktop";

        // 3️⃣ Get Country from ipinfo
        let country = "Unknown";

        try {
            const ipRes = await fetch(
                `https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`
            );
            const ipData = await ipRes.json();
            country = ipData.country || "Unknown";
        } catch (err) {
            console.log("IP lookup failed:", err);
        }

        // 4️⃣ Insert login log
        await supabase.from("login_logs").insert({
            user_id,
            email,
            browser,
            device,
            country,
            ip_address: ip,
        });

        // 5️⃣ Increment login_count in users table
        await supabase.rpc("increment_login_count", {
            user_id_input: user_id,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal error" },
            { status: 500 }
        );
    }
}
