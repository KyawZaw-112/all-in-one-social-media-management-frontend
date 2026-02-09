export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            console.warn("No authorization header provided");
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/payments/pending`;
        console.log("📡 Frontend API Route - Pending Payments");
        console.log("🔗 Backend URL:", backendUrl);
        console.log("🔑 Auth Header:", authHeader.substring(0, 30) + "...");

        // Forward to backend with the auth header
        let response;
        try {
            response = await fetch(backendUrl, {
                method: "GET",
                headers: {
                    "Authorization": authHeader,
                },
            });
        } catch (fetchError) {
            const fetchMsg = fetchError instanceof Error ? fetchError.message : String(fetchError);
            console.error("❌ Fetch failed:", fetchMsg);
            console.error("   Is backend running at", backendUrl, "?");
            return new Response(
                JSON.stringify({
                    error: "Failed to connect to backend",
                    details: fetchMsg,
                    backendUrl: backendUrl
                }),
                { status: 503 }
            );
        }

        console.log("✅ Backend responded with status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Backend error:", response.status, errorText);
            return new Response(
                JSON.stringify({
                    error: `Backend error: ${response.status}`,
                    details: errorText
                }),
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log("✅ Successfully fetched", data?.length || 0, "payments");
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : "";
        console.error("❌ API Error:", errorMessage);
        console.error("   Stack:", stack);
        return new Response(JSON.stringify({
            error: "Internal error",
            details: errorMessage
        }), {
            status: 500,
        });
    }
}

