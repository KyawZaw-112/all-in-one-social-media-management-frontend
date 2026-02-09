import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(
            new URL("/dashboard/platforms?fb=error", req.url)
        );
    }

    // 1️⃣ Exchange code → access token
    const tokenRes = await fetch(
        "https://graph.facebook.com/v18.0/oauth/access_token" +
        `?client_id=${process.env.FACEBOOK_APP_ID}` +
        `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
        `&redirect_uri=https://all-in-one-social-media-management-ashy.vercel.app/api/oauth/facebook/callback` +
        `&code=${code}`
    );

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
        console.error("FB token error:", tokenData);
        return NextResponse.redirect(
            new URL("/dashboard/platforms?fb=error", req.url)
        );
    }

    // 2️⃣ Get current user (Supabase session)
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(
            new URL("/login", req.url)
        );
    }

    // 3️⃣ Persist connection
    await supabase.from("social_connections").upsert({
        user_id: user.id,
        platform: "facebook",
        access_token: tokenData.access_token,
        connected: true,
    });

    // 4️⃣ Redirect back to UI
    return NextResponse.redirect(
        new URL("/dashboard/platforms?fb=connected", req.url)
    );
}
