"use client";

import { useSubscription } from "@/hooks/useSubscription";

export default function SubscriptionGuard({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    const { loading, active } = useSubscription();

    if (loading) return null;

    if (!active) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-semibold mb-2">
                    Subscription required
                </h2>
                <a href="/subscribe" className="underline text-primary">
                    View pricing
                </a>
            </div>
        );
    }

    return <>{children}</>;
}
