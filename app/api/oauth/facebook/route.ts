import { NextResponse } from "next/server";

export async function GET() {
    const params = new URLSearchParams({
        client_id: process.env.FACEBOOK_APP_ID!,
        redirect_uri:
            "https://all-in-one-social-media-management-ashy.vercel.app/api/oauth/facebook/callback",
        scope: "pages_show_list,pages_read_engagement",
        response_type: "code",
        state: crypto.randomUUID(), // CSRF protection
    });

    return NextResponse.redirect(
        `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
    );
}
