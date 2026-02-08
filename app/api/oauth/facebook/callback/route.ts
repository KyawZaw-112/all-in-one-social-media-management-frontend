import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const tokenRes = await fetch(
        "https://graph.facebook.com/v18.0/oauth/access_token" +
        `?client_id=${process.env.FACEBOOK_APP_ID}` +
        `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
        `&redirect_uri=https://all-in-one-social-media-management-ashy.vercel.app/api/oauth/facebook` +
        `&code=${code}`
    );

    const data = await tokenRes.json();

    if (!data.access_token) {
        return NextResponse.json(data, { status: 400 });
    }

    console.log("✅ Facebook User Access Token:", data.access_token);

    return NextResponse.redirect(
        new URL("/dashboard?facebook=connected", req.url)
    );
}
