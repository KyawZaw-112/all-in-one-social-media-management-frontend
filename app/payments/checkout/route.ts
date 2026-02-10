import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripeClient(secretKey: string) {
    return new Stripe(secretKey);
}

export async function POST(req: Request) {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY is missing");
        }

        const stripe = getStripeClient(process.env.STRIPE_SECRET_KEY);

        const auth = req.headers.get("authorization");
        if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { plan } = await req.json();
        console.log("Plan:", plan);

        const priceId =
            plan === "monthly"
                ? process.env.STRIPE_MONTHLY_PRICE_ID
                : process.env.STRIPE_YEARLY_PRICE_ID;

        if (!priceId) {
            throw new Error("Stripe price ID is missing");
        }

        if (!process.env.NEXT_PUBLIC_API_URL) {
            throw new Error("NEXT_PUBLIC_API_URL is missing");
        }


        console.log("Price ID:", priceId);

        console.log("Using price:", priceId);

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${process.env.NEXT_PUBLIC_API_URL}/subscribe/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/subscribe`,
        });


        console.log("Stripe session created:", session.id);

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error("❌ Checkout error:", err);

        return NextResponse.json(
            {
                error: err.message || "Checkout failed",
            },
            { status: 500 }
        );
    }
}
