import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
        return NextResponse.redirect(
            `${process.env.FRONTEND_URL}/dashboard/platforms?error=facebook`
        );
    }

    const tokenRes = await fetch(
        `https://graph.facebook.com/v24.0/oauth/access_token` +
        `?client_id=${process.env.FACEBOOK_APP_ID}` +
        `&redirect_uri=${process.env.BASE_URL}/api/oauth/facebook/callback` +
        `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
        `&code=${code}`
    );

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
        console.error("Facebook token error:", tokenData);
        return NextResponse.json(tokenData, { status: 500 });
    }

    // ✅ Store token here (Supabase / DB)
    console.log("Facebook access token:", tokenData.access_token);

    return NextResponse.redirect(
        `${process.env.FRONTEND_URL}/dashboard/platforms?connected=facebook`
    );
}
