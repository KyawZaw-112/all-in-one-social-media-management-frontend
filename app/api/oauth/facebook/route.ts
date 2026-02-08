import { NextResponse } from "next/server";

export async function GET() {
    const facebookAuthUrl =
        "https://www.facebook.com/v24.0/dialog/oauth" +
        `?client_id=${process.env.FACEBOOK_APP_ID}` +
        `&redirect_uri=${encodeURIComponent(process.env.FB_REDIRECT_URI)}` +
        "&scope=pages_manage_metadata,pages_read_engagement";

    return NextResponse.redirect(facebookAuthUrl);
}
