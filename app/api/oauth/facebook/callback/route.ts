// app/api/oauth/facebook/callback/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(
            new URL("/login?error=missing_code", url.origin)
        );
    }

    const redirectUri =
        "https://all-in-one-social-media-management-ashy.vercel.app/api/oauth/facebook/callback";

    // 🔁 Exchange code → access token
    const tokenRes = await fetch(
        "https://graph.facebook.com/v24.0/oauth/access_token" +
        `?client_id=${process.env.FACEBOOK_APP_ID}` +
        `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&code=${code}`
    );

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
        console.error("❌ Token error:", tokenData);
        return NextResponse.redirect(
            new URL("/login?error=token_failed", url.origin)
        );
    }

    // (Optional but recommended) Fetch user profile
    const profileRes = await fetch(
        `https://graph.facebook.com/me?fields=id,name&access_token=${tokenData.access_token}`
    );

    const profile = await profileRes.json();

    console.log("✅ Facebook connected:", profile);

    // TODO:
    // - Save access_token to DB
    // - Link Facebook ID to user
    // - Create session / cookie

    return NextResponse.redirect(
        new URL("/dashboard?fb=connected", url.origin)
    );
}
