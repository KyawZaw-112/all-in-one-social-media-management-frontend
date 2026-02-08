// app/api/oauth/facebook/route.ts
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        message: "Facebook OAuth root route",
    });
}
