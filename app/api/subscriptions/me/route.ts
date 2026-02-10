import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("authorization");

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions/me`,
            {
                method: "GET",
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            console.error("Backend subscription error:", response.status);
            return NextResponse.json(
                { status: "none" },
                { status: 200 }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching subscription:", error);
        // Return default response so app doesn't crash
        return NextResponse.json(
            { status: "none" },
            { status: 200 }
        );
    }
}

