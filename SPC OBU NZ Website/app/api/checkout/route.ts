import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PRODUCTS = {
  gala_single: {
    name: "Gala Dinner Dance 2026 — Single Ticket",
    description: "SPC OBU NZ Gala Dinner Dance · Sat 3 Oct 2026 · Fairway Events Centre, Auckland",
    amount: 11000, // NZD cents
    adjustable: true,
    max: 9,
  },
  gala_table: {
    name: "Gala Dinner Dance 2026 — Table of 10",
    description: "Reserved table of 10 · Sat 3 Oct 2026 · Fairway Events Centre, Auckland",
    amount: 110000,
    adjustable: false,
    max: 1,
  },
  membership_annual: {
    name: "SPC OBU NZ Membership — Annual",
    description: "Annual membership of the St. Peter's College OBU New Zealand",
    amount: 5000,
    adjustable: false,
    max: 1,
  },
} as const;

export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Payments are not configured yet. Please set STRIPE_SECRET_KEY." },
      { status: 500 },
    );
  }

  try {
    const { product, quantity = 1 } = (await req.json()) as {
      product: keyof typeof PRODUCTS;
      quantity?: number;
    };
    const item = PRODUCTS[product];
    if (!item) {
      return NextResponse.json({ error: "Unknown product." }, { status: 400 });
    }

    const stripe = new Stripe(key);
    const origin =
      req.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "nzd",
      line_items: [
        {
          quantity: Math.min(Math.max(1, quantity), item.max),
          adjustable_quantity: item.adjustable
            ? { enabled: true, minimum: 1, maximum: item.max }
            : undefined,
          price_data: {
            currency: "nzd",
            unit_amount: item.amount,
            product_data: { name: item.name, description: item.description },
          },
        },
      ],
      metadata: { product },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${product.startsWith("gala") ? "events" : "membership"}?cancelled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to start checkout." }, { status: 500 });
  }
}
