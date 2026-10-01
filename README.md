# Headless Shopify storefront (Next.js)

A reusable, config-driven storefront. One codebase, many businesses: every brand
is a single config file (colours, fonts, copy, homepage sections, demo catalog).
Products, cart checkout and payments come from Shopify's Storefront API.

Ships with **WagWellness**, a demo dog-supplement brand that runs without any
Shopify account.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

With no Shopify keys, the site runs on the demo catalog in
`src/config/sites/wagwellness.ts`. Everything works except the final checkout.

## Stack

- Next.js 16 (App Router, React 19, TypeScript)
- Tailwind CSS v4, themed through CSS variables from the site config
- Motion (Framer Motion) for interactions
- Zustand for the cart (saved in the browser)
- Shopify Storefront API (GraphQL), with Shopify's own checkout

## Project map

```
src/
  config/
    types.ts               ← the SiteConfig contract (read this first)
    sites/wagwellness.ts   ← one business = one file
    sites/index.ts         ← register businesses here
  lib/commerce/
    index.ts               ← getProducts / getProduct / search / checkout
    shopify.ts             ← Storefront API client + mapping
    types.ts               ← provider-neutral Product types
  components/
    layout/                ← header, cart drawer, search, quick view, footer
    product/               ← card, gallery, purchase box, drawn packaging
    sections/              ← homepage blocks + SectionRenderer
  store/cart.ts            ← cart + UI state
  app/                     ← routes: /, /shop, /products/[handle], /pages/[slug], /api/*
```

## Launch a new business

1. Copy `src/config/sites/wagwellness.ts` to e.g. `src/config/sites/acme.ts`.
2. Change the name, theme colours, fonts (any Google Font), copy and `sections`.
   Sections render in the order you list them. Remove any you don't need.
3. Register it in `src/config/sites/index.ts`.
4. Set `NEXT_PUBLIC_SITE_ID=acme` in that deployment's environment.
5. Add that business's Shopify keys (below) and set `demoMode: false`.

Deploy one copy per business (e.g. one Vercel project each, same Git repo,
different environment variables). Updating a component updates every store.

### Available homepage sections

| type       | What it shows                                                  |
|------------|----------------------------------------------------------------|
| `hero`     | Headline, CTAs, featured product with tilt + fact stickers     |
| `trust`    | Four short trust points with icons                             |
| `products` | Product grid with quick add and quick view                     |
| `story`    | Big stat + explanation + benefit list                          |
| `steps`    | Numbered "how it works"                                        |
| `bundle`   | Mix-and-match bundle builder with tiered discounts             |
| `quiz`     | Product finder; each answer adds points to product handles     |
| `reviews`  | Review carousel (`sample: true` shows a placeholder notice)    |
| `faq`      | Accordion                                                      |
| `cta`      | Closing call to action                                         |

To add a new section type: add it to `Section` in `config/types.ts`, build the
component in `components/sections/`, and add one `case` in `SectionRenderer.tsx`.

## Connect Shopify

1. In Shopify admin: **Settings → Apps and sales channels → Develop apps → Create an app**
   (or install the **Headless** sales channel, which gives you a token directly).
2. Enable **Storefront API** scopes: `unauthenticated_read_product_listings`,
   `unauthenticated_read_product_inventory`, `unauthenticated_write_checkouts`,
   `unauthenticated_read_selling_plans`.
3. Copy the **Storefront API access token** into `.env.local`:

```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=xxxxxxxx
```

4. Make sure products are published to the Headless / custom app sales channel.

Restart `npm run dev`. Products now come from Shopify, and **Check out** sends
customers to Shopify's hosted checkout (GCash, Maya, cards, COD — whatever you
enable in Shopify Payments or a local gateway such as PayMongo or Xendit).

### Optional product fields (metafields)

Create these product metafields in Shopify to fill the product page extras:

| Namespace.key           | Type                 | Used for                   |
|-------------------------|----------------------|----------------------------|
| `custom.subtitle`       | Single line text     | Line under the title       |
| `custom.highlights`     | List of single line  | Tick list                  |
| `custom.how_to_use`     | Multi-line text      | "How to use" panel         |
| `custom.ingredients`    | Multi-line text      | "Ingredients" panel        |
| `reviews.rating`        | Rating               | Stars (set by review apps such as Judge.me) |
| `reviews.rating_count`  | Integer              | Review count               |

Expose each one to the Storefront API (Settings → Custom data → Products → the
metafield → **Storefronts access**).

### Subscriptions and bundles

- **Subscribe & save** appears automatically when a product has a selling plan
  (install a subscription app such as Shopify Subscriptions, Recharge or Seal).
- **Bundle discounts** shown in the cart are estimates. Create matching
  automatic discounts in Shopify (e.g. "buy 3, get 15% off") so the real price
  at checkout agrees. Bundle lines carry a `_bundle` cart attribute you can
  target with a Shopify Function if you want exact rules.

## Before going live

- Replace sample reviews, ratings and policy text in the site config.
- Set `demoMode: false` to remove the demo banner.
- Use real product photos in Shopify. Drawn packaging only appears for
  products without images.
- Check product claims with your supplier and the relevant regulator
  (for animal supplements in the Philippines, the Bureau of Animal Industry).

## Deploy

Works on Vercel out of the box (`npm run build`). Cloudflare also works through
the OpenNext adapter. Set the environment variables per project.
