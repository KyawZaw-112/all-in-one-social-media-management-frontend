/**
 * Central API helper
 * Uses same-origin requests (NO CORS)
 */

export async function fetchWithAuth(
    path: string,
    token: string,
    options: RequestInit = {}
) {
    const headers: HeadersInit = {
        ...(options.headers || {}),
    };

    // Only attach auth + JSON headers for real requests
    if (options.method && options.method !== "GET") {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(path, {
        ...options,
        headers,
    });

    if (!res.ok) {
        let message = "Request failed";
        try {
            const error = await res.json();
            message = error.error || error.message || message;
        } catch {}
        throw new Error(message);
    }

    return res.json();
}

/**
 * Stripe checkout
 */
export function createCheckoutSession(
    token: string,
    plan: "monthly" | "yearly"
) {
    return fetchWithAuth("/payments/checkout", token, {
        method: "POST",
        body: JSON.stringify({ plan }),
    });
}

/**
 * Platforms
 */
export function getPlatforms(token: string) {
    return fetchWithAuth("/platforms", token);
}

export function connectPlatform(token: string, platform: string) {
    return fetchWithAuth("/platforms/connect", token, {
        method: "POST",
        body: JSON.stringify({ platform }),
    });
}

/**
 * Subscription
 */
export function getMySubscription(token: string) {
    return fetchWithAuth("/subscriptions/me", token);
}
