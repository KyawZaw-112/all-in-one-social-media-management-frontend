"use client";

import {Button} from "antd";
import supabase from "@/lib/supabase";

export default function PlatformsPage() {

    const connectFacebook = async () => {
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (!session) {
            alert("Not authenticated");
            return;
        }

        // const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
        // const redirectUri = "https://all-in-one-social-media-management.onrender.com/api/oauth/facebook/callback";

        const url =
            `https://www.facebook.com/v19.0/dialog/oauth?` +
            `client_id=789934663517168` +
            `&redirect_uri=https://all-in-one-social-media-management.onrender.com/api/oauth/facebook/callback` +
            `&response_type=code` +
            `&scope=email`;

        window.location.href = url;
    };


    return (
        <div style={{padding: 40}}>
            <h2>Connect Facebook</h2>
            <Button type="primary" onClick={connectFacebook}>
                Connect Facebook
            </Button>
        </div>
    );
}
