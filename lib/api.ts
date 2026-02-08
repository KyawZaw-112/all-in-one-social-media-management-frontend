const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Fetch helper with Bearer token
 */
export async function fetchWithAuth(
    path: string,
    token: string,
    options: RequestInit = {}
) {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        let errorMessage = "Request failed";
        try {
            const error = await res.json();
            errorMessage = error.error || error.message || errorMessage;
        } catch {
            // ignore
        }
        throw new Error(errorMessage);
    }

    return res.json();
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(
    token: string,
    plan: "monthly" | "yearly"
) {
    return fetchWithAuth("/payments/checkout", token, {
        method: "POST",
        body: JSON.stringify({ plan }),
    });
}

export async function getPlatforms(token: string) {
    return fetchWithAuth("/platforms", token);
}

export async function connectPlatform(token: string, platform: string) {
    return fetchWithAuth("/platforms/connect", token, {
        method: "POST",
        body: JSON.stringify({ platform }),
    });
}

/**
 * Get current subscription
 */
export async function getMySubscription(token: string) {
    return fetchWithAuth("/subscriptions/me", token);
}

/**
 * Example: create post (premium feature)
 */
export async function createPost(token: string, payload: any) {
    return fetchWithAuth("/posts/create", token, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
