// app/api/posts/stats/route.ts
import { NextResponse } from "next/server";

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Methods": "GET,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}

export async function GET() {
    return NextResponse.json(
        { success: true },
        {
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:3000",
            },
        }
    );
}
