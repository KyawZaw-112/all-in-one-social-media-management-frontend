import { NextResponse } from "next/server";

export async function GET() {
    const appId = process.env.FACEBOOK_APP_ID;
    const redirectUri = process.env.FB_REDIRECT_URI;
    if (!appId || !redirectUri) {
        throw new Error("Missing Facebook OAuth environment variables");
    }
    const facebookAuthUrl =
        "https://www.facebook.com/v18.0/dialog/oauth" +
        `?client_id=${appId}` +
        `&redirect_uri=https://all-in-one-social-media-management-ashy.vercel.app/api/oauth/facebook` +
        "&scope=public_profile";

    return NextResponse.redirect(facebookAuthUrl);
}