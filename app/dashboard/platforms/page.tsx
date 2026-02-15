"use client";

import { Button } from "antd";
import supabase from "@/lib/supabase";

export default function PlatformsPage() {

    const connectFacebook = async () => {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

        if (!token) {
            alert("Not authenticated");
            return;
        }

        // Redirect directly (NO fetch)
        window.location.href =
            `http://localhost:4000/api/oauth/facebook?token=${token}`;
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
