"use client";

import {Button} from "antd";

export default function PlatformsPage() {

    const connectFacebook = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/oauth/facebook`;
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
