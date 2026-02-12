import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripeClient(secretKey: string) {
    return new Stripe(secretKey);
}

export async function POST(req: Request) {
    try {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const stripe = new Stripe(secretKey);

        const auth = req.headers.get("authorization");
        if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { plan } = await req.json();

        const priceId =
            plan === "monthly"
                ? process.env.STRIPE_MONTHLY_PRICE_ID
                : process.env.STRIPE_YEARLY_PRICE_ID;

        if (!priceId) {
            return NextResponse.json(
                { error: "Stripe price not configured" },
                { status: 500 }
            );
        }

        const appUrl = process.env.APP_URL;
        if (!appUrl) {
            return NextResponse.json(
                { error: "APP_URL not configured" },
                { status: 500 }
            );
        }

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${appUrl}/subscribe/success`,
            cancel_url: `${appUrl}/subscribe`,
        });

        return NextResponse.json({ url: session.url });

    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Checkout failed" },
            { status: 500 }
        );
    }
}
