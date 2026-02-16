"use client";

import {Button} from "antd";
import supabase from "@/lib/supabase";

export default function PlatformsPage() {


    const connectFacebook = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            alert("Not logged in");
            return;
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/platforms/connect`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ platform: "facebook" }),
            }
        );

        const data = await res.json();

        window.location.href = data.url;
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
