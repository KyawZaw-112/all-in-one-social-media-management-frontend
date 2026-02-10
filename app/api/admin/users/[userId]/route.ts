function getBackendUrl(path: string) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
}

function unauthorized() {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
}

async function proxyToBackend(request: Request, userId: string, method: string, defaultError: string) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return unauthorized();
    }

    const headers: Record<string, string> = {
        Authorization: authHeader,
    };

    const init: RequestInit = {
        method,
        headers,
    };

    if (method !== "GET") {
        headers["Content-Type"] = "application/json";
        init.body = await request.text();
    }

    const response = await fetch(getBackendUrl(`/admin/users/${userId}`), init);

    if (!response.ok) {
        const details = await response.text();
        return new Response(JSON.stringify({ error: defaultError, details }), {
            status: response.status,
        });
    }

    const text = await response.text();
    return new Response(text || "{}", {
        status: response.status,
        headers: { "Content-Type": "application/json" },
    });
}

type Context = {
    params: Promise<{
        userId: string;
    }>;
};

export async function GET(request: Request, context: Context) {
    try {
        const { userId } = await context.params;
        return await proxyToBackend(request, userId, "GET", "Failed to load user");
    } catch (error) {
        const details = error instanceof Error ? error.message : String(error);
        return new Response(JSON.stringify({ error: "Internal error", details }), { status: 500 });
    }
}

export async function PUT(request: Request, context: Context) {
    try {
        const { userId } = await context.params;
        return await proxyToBackend(request, userId, "PUT", "Failed to update user");
    } catch (error) {
        const details = error instanceof Error ? error.message : String(error);
        return new Response(JSON.stringify({ error: "Internal error", details }), { status: 500 });
    }
}

export async function DELETE(request: Request, context: Context) {
    try {
        const { userId } = await context.params;
        return await proxyToBackend(request, userId, "DELETE", "Failed to delete user");
    } catch (error) {
        const details = error instanceof Error ? error.message : String(error);
        return new Response(JSON.stringify({ error: "Internal error", details }), { status: 500 });
    }
}
