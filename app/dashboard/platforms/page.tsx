"use client";

import { Button } from "antd";
import supabase from "@/lib/supabase";

export default function PlatformsPage() {

    const connectFacebook = async () => {
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;

        const res = await fetch(
            "http://localhost:4000/api/oauth/facebook",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await res.json();
        window.location.href = data.url;
    };


    return (
        <div style={{ padding: 40 }}>
            <h2>Connect Facebook</h2>
            <Button type="primary" onClick={connectFacebook}>
                Connect Facebook
            </Button>
        </div>
    );
}
