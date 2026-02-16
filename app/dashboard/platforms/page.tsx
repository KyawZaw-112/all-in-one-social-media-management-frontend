"use client";

import {Button} from "antd";

export default function PlatformsPage() {

    const connectFacebook = async () => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/platforms/connect`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // if using JWT
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
