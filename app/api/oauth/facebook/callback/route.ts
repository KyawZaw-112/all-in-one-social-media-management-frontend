// app/api/oauth/facebook/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    console.log("🔥 /api/oauth/facebook HIT");
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    console.log("🧩 OAuth code:", code);
    if (!code) {
        return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
        return NextResponse.json(
            { error: "Facebook env vars missing" },
            { status: 500 }
        );
    }

    const tokenUrl =
        "https://graph.facebook.com/v24.0/oauth/access_token" +
        `?client_id=${process.env.FACEBOOK_APP_ID}` +
        `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
        `&redirect_uri=https://all-in-one-social-media-management-ashy.vercel.app/api/oauth/facebook` +
        `&code=${code}`;

    const tokenRes = await fetch(tokenUrl);
    const data = await tokenRes.json();

    if (!data.access_token) {
        console.error("❌ Facebook token error:", data);
        return NextResponse.redirect(
            "https://all-in-one-social-media-management-ashy.vercel.app/auth/error"
        );
    }

    console.log("✅ Facebook User Access Token:", data.access_token);

    // TODO: save token in DB or session here

    return NextResponse.redirect(
        "https://all-in-one-social-media-management-ashy.vercel.app/dashboard?fb=connected"
    );
}
