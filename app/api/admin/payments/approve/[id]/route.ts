import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const authHeader = req.headers.get("authorization");

        const response = await fetch(
            `${process.env.BACKEND_URL}/admin/payments/approve/${id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authHeader || "",
                },
                body: JSON.stringify(await req.json()),
            }
        );

        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
