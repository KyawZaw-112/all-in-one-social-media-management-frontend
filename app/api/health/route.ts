export async function GET() {
    try {
        const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/health`;


        const response = await fetch(backendUrl, {
            method: "GET",
        });

        if (response.ok) {
            const data = await response.json();

            return new Response(JSON.stringify({
                status: "ok",
                message: "Backend is reachable",
                backendUrl: backendUrl,
                backendResponse: data
            }), { status: 200 });
        } else {
            console.error("❌ Backend returned error:", response.status);
            return new Response(JSON.stringify({
                status: "error",
                message: `Backend returned ${response.status}`,
                backendUrl: backendUrl
            }), { status: response.status });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("❌ Cannot reach backend:", errorMessage);
        return new Response(JSON.stringify({
            status: "error",
            message: "Cannot reach backend",
            details: errorMessage,
            backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL
        }), { status: 503 });
    }
}

