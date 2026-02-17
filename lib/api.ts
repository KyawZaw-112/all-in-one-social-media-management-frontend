const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
}

export async function fetchWithAuth<T = any>(
    path: string,
    token: string,
    options: RequestInit = {}
): Promise<T> {
    if (!token) {
        throw new Error("No auth token provided");
    }

    const headers = new Headers(options.headers || {});

    headers.set("Authorization", `Bearer ${token}`);

    if (options.method && options.method !== "GET") {
        headers.set("Content-Type", "application/json");
    }

    const cleanPath = path.startsWith("/") ? path.slice(1) : path;

    const res = await fetch(`${BASE_URL}/${cleanPath}`, {
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

/* ===========================
   ADMIN USERS
=========================== */

export function getAdminUsers(
    token: string,
    page = 1,
    limit = 10,
    search = ""
) {
    const query = `admin/users?page=${page}&limit=${limit}&search=${search}`;
    return fetchWithAuth(query, token);
}

export function createAdminUser(
    token: string,
    data: { email: string; role: string }
) {
    return fetchWithAuth("admin/users", token, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function updateAdminUser(
    token: string,
    id: string,
    data: { email?: string; role?: string }
) {
    return fetchWithAuth(`admin/users/${id}`, token, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export function deleteAdminUser(token: string, id: string) {
    return fetchWithAuth(`admin/users/${id}`, token, {
        method: "DELETE",
    });
}

/* ================================
   GET ALL CONVERSATIONS
================================ */
export async function getConversations() {
    const res = await fetch(`${BASE_URL}/api/conversations`, {
        credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch conversations");

    return res.json();
}

/* ================================
   GET SINGLE CONVERSATION DETAIL
================================ */
export async function getConversationDetail(id: string) {
    const res = await fetch(
        `${BASE_URL}/api/conversations/${id}`,
        {
            credentials: "include",
        }
    );

    if (!res.ok) throw new Error("Failed to fetch conversation");

    return res.json();
}

/* ================================
   CLOSE CONVERSATION
================================ */
export async function closeConversation(id: string) {
    const res = await fetch(
        `${BASE_URL}/api/conversations/${id}/close`,
        {
            method: "POST",
            credentials: "include",
        }
    );
    if(!res.ok) throw new Error("Failed to close conversation");
    return res.json();
}

/* ===========================
   OTHER EXAMPLES
=========================== */

export function getPlatforms(token: string) {
    return fetchWithAuth("platforms", token);
}

export function connectPlatform(token: string, platform: string) {
    return fetchWithAuth("platforms/connect", token, {
        method: "POST",
        body: JSON.stringify({ platform }),
    });
}

export function getMySubscription(token: string) {
    return fetchWithAuth("subscriptions/me", token);
}

export function createCheckoutSession(
    token: string,
    plan: "monthly" | "yearly"
) {
    return fetchWithAuth("payments/checkout", token, {
        method: "POST",
        body: JSON.stringify({ plan }),
    });
}
