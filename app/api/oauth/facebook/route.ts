// app/api/oauth/facebook/route.ts
import { NextResponse } from "next/server";

export async function GET() {
    const redirectUri =
        "https://all-in-one-social-media-management-ashy.vercel.app/api/oauth/facebook/callback";

    const facebookAuthUrl =
        "https://www.facebook.com/v24.0/dialog/oauth" +
        `?client_id=${process.env.FACEBOOK_APP_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=public_profile,email` +
        `&response_type=code`;

    return NextResponse.redirect(facebookAuthUrl);
}
