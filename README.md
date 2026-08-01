# SPC OBU New Zealand — Official Website

Premium website for the St. Peter's College Old Boys' Union New Zealand.
**Virtus et Veritas** · Est. 2020

## Stack

Next.js 15 (App Router) · Tailwind CSS · Framer Motion · Stripe Checkout · TypeScript

## Getting Started

```bash
npm install
cp .env.example .env.local   # add your Stripe secret key
npm run dev                  # http://localhost:3000
```

## Stripe Setup

1. Create a Stripe account and grab your secret key from https://dashboard.stripe.com/apikeys
2. Set `STRIPE_SECRET_KEY` in `.env.local` (and in Vercel project settings for production).
3. Prices are defined in `app/api/checkout/route.ts`:
   - Gala single ticket — $110 NZD (quantity adjustable up to 9)
   - Gala table of 10 — $1,100 NZD
   - Annual membership — $50 NZD (edit as needed)

Payments redirect to `/success`. Buyer receipts are emailed by Stripe automatically.

## Deployment

**Vercel (recommended):** push the repo to GitHub → import to Vercel → add
`STRIPE_SECRET_KEY` and `NEXT_PUBLIC_SITE_URL` env vars → deploy. API routes work out of the box.

**GitHub Pages:** static hosting doesn't support the Stripe API route. If you must use Pages,
replace the checkout buttons with [Stripe Payment Links](https://stripe.com/docs/payment-links)
and add `output: "export"` to `next.config.mjs`.

## Editing Content

- **Committee, events, contact details, nav** → `lib/site.ts`
- **Gala date / venue / price labels** → `lib/site.ts` (`gala`)
- **Sponsors** → add entries to the `sponsors` array in `app/sponsors/page.tsx`
- **Gallery photos** → drop files in `public/images/` and list them in `app/gallery/page.tsx`
- **Crest / logo** → replace `public/images/crest.jpg` (keep the filename)

## Structure

```
app/            pages (App Router) + /api/checkout (Stripe)
components/     Header, Footer, Reveal animations, Countdown, forms, gallery
lib/site.ts     all site data in one place
public/images/  photos & brand assets
```
