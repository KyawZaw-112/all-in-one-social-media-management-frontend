export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users`;
        const response = await fetch(backendUrl, {
            method: "GET",
            headers: {
                Authorization: authHeader,
            },
        });

        if (!response.ok) {
            const details = await response.text();
            return new Response(JSON.stringify({ error: "Failed to load users", details }), {
                status: response.status,
            });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        const details = error instanceof Error ? error.message : String(error);
        return new Response(JSON.stringify({ error: "Internal error", details }), { status: 500 });
    }
}
