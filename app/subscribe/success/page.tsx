"use client";

import { Result, Button } from "antd";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

export default function SuccessPage() {
    const router = useRouter();

    return (
        <AuthGuard>
            <Result
                status="success"
                title="Subscription activated 🎉"
                subTitle="Your payment was successful. You now have full access to all premium features."
                extra={[
                    <Button
                        type="primary"
                        key="dashboard"
                        onClick={() => router.push("/dashboard")}
                    >
                        Go to Dashboard
                    </Button>,
                ]}
            />
        </AuthGuard>
    );
}
