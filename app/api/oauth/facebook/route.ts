import { NextResponse } from "next/server";

export async function GET() {
    const appId = process.env.FACEBOOK_APP_ID;
    const redirectUri = process.env.FB_REDIRECT_URI;
    if (!appId || !redirectUri) {
        throw new Error("Missing Facebook OAuth environment variables");
    }
    const facebookAuthUrl =
        "https://www.facebook.com/v24.0/dialog/oauth" +
        `?client_id=${appId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        "&scope=pages_manage_metadata,pages_read_engagement";

    return NextResponse.redirect(facebookAuthUrl);
}