import { NextResponse } from "next/server";

export async function GET() {
    const params = new URLSearchParams({
        client_id: process.env.FACEBOOK_APP_ID!,
        redirect_uri: `${process.env.BASE_URL}/api/oauth/facebook/callback`,
        scope: [
            "public_profile",
            "email",
            "pages_show_list",
            "pages_read_engagement"
        ].join(","),
        response_type: "code",
        state: "facebook_oauth"
    });

    return NextResponse.redirect(
        `https://www.facebook.com/v24.0/dialog/oauth?${params.toString()}`
    );
}
