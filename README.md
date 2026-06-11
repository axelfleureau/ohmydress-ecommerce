# OhMyDress Ecommerce

Self-hosted Next.js storefront for OhMyDress, designed to replace the Shopify storefront with first-party product pages, collection pages, cart, checkout, local order capture, admin order review, and SEO routes.

## Stack

- Next.js App Router
- React 19
- Zustand persisted cart
- GSAP / Lenis animations
- Cloudflare Workers via OpenNext
- Cloudflare D1 order storage
- Medusa backend/admin for products, orders, returns, fulfillment, and operations
- PostgreSQL + Redis for the commerce back office

## Local Development

```bash
npm install
npm run dev
```

The default dev script serves the app on `http://localhost:5000`. If that port is busy:

```bash
npx next dev -p 5001 -H 0.0.0.0
```

## Product Import

Import the live Shopify catalogue from `https://ohmydress.ro/products.json?limit=250`:

```bash
npm run import:products
```

This regenerates `src/app/wardrobe/shopify-products.generated.js`. Do not edit the generated file manually.

## Commerce Back Office

The Medusa backend lives in `apps/commerce/apps/backend`. It is the operational back office for catalog, orders, returns, fulfillment, shipping setup, and future locker/carrier integrations.

Start local services:

```bash
npm run commerce:services:start
```

Run migrations and create an admin user:

```bash
npm run commerce:migrate
npm run commerce:user -- -e admin@ohmydress.ro -p "change-me"
```

Start the Medusa Admin:

```bash
npm run commerce:dev
```

Admin URL:

```bash
http://localhost:9000/app
```

Import the Shopify-derived OhMyDress products into Medusa:

```bash
npm run import:products
npm run commerce:import-products
```

`commerce:import-products` exports `src/app/wardrobe/shopify-products.generated.js` into `apps/commerce/apps/backend/src/data/ohmydress-products.json`, imports missing products into Medusa, and soft-deletes the demo products from the Medusa starter. The import is idempotent by product handle.

Useful checks:

```bash
npm run commerce:services:status
npm run commerce:build
```

## Shopify Theme Content

The homepage is data-driven. It starts from the Shopify theme export JSON and can be edited from `/admin/content`.

Import a Shopify theme export homepage:

```bash
npm run import:theme-home -- /Users/axel/Downloads/theme_export__ohmydress-it-ohmydress__04JUN2026-1259pm
```

Seed the imported homepage into Cloudflare D1:

```bash
npm run db:migrate:remote
npm run seed:site-content
```

For local D1:

```bash
npm run db:migrate:local
npm run seed:site-content -- --local
```

Editable route:

```bash
/admin/content
```

The editable shape mirrors Shopify's `templates/index.json`: `sections`, `blocks`, `settings`, and `order`. Supported homepage sections are `image-banner`, `marquee`, `featured-collection`, `rich-text`, and `newsletter`.

## Environment

Copy `.env.example` and adjust values for the target host.

```bash
NEXT_PUBLIC_SITE_URL=https://ohmydress.ro
ORDER_STORAGE_PATH=data/orders.json
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me-before-production
NEXT_PUBLIC_SAMEDAY_CLIENT_ID=
NEXT_PUBLIC_SAMEDAY_API_USERNAME=
NEXT_PUBLIC_SAMEDAY_COUNTRY_CODE=RO
NEXT_PUBLIC_SAMEDAY_LANG_CODE=ro
```

`ORDER_STORAGE_PATH` should point to a persistent volume in production. Order JSON files are ignored by git.

Sameday locker selection uses the official Locker Plugin SDK from `https://cdn.sameday.ro/locker-plugin/lockerpluginsdk.js`. Ask Sameday for the Locker Plugin `clientId` and integrator `apiUsername`, then set the `NEXT_PUBLIC_SAMEDAY_*` variables before building.

## Cloudflare

This project is configured for Cloudflare Workers with OpenNext and D1.

One-command bootstrap for a production-like Cloudflare deploy:

```bash
npm run bootstrap:cloudflare
```

The bootstrap script:

- updates `wrangler.jsonc` with stable public/runtime vars;
- writes local-only `.dev.vars`;
- generates `ADMIN_PASSWORD` when one is not provided;
- uploads `ADMIN_PASSWORD` as a Cloudflare secret;
- applies remote D1 migrations;
- seeds Shopify-derived homepage content into D1;
- refreshes the Shopify product import;
- deploys the Worker.

To provide your own credentials:

```bash
ADMIN_PASSWORD="..." \
NEXT_PUBLIC_SAMEDAY_CLIENT_ID="..." \
NEXT_PUBLIC_SAMEDAY_API_USERNAME="..." \
npm run bootstrap:cloudflare
```

To validate setup without deploying:

```bash
npm run bootstrap:cloudflare -- --no-deploy
```

To require Sameday credentials and fail fast when they are missing:

```bash
npm run bootstrap:cloudflare -- --require-sameday
```

Manual Cloudflare commands remain available:

```bash
npm run cf-typegen
npm run db:migrate:local
npm run db:migrate:remote
npm run preview
npm run deploy
```

The D1 database is `ohmydress-ecommerce`, bound as `DB` in `wrangler.jsonc`.

Set production secrets before exposing the Worker:

```bash
npx wrangler secret put ADMIN_PASSWORD
```

Set the Sameday `NEXT_PUBLIC_*` values as Cloudflare build/runtime variables because they are used by the browser-side Locker Plugin.

If `ADMIN_PASSWORD` is missing in production, `/admin/*` is disabled.

## Commerce Routes

- `/collections/new-in`
- `/collections/dresses`
- `/collections/clothing`
- `/collections/accessories`
- `/collections/posete-din-piele-naturala`
- `/products/[slug]`
- `/checkout`
- `/admin/orders`
- `/admin/content`

Checkout supports delivery to address or Sameday easybox / PUDO. Orders store the selected locker metadata under `delivery.locker`.

Admin is protected by Basic Auth when `ADMIN_PASSWORD` is set.

## Technical Routes

- `/api/health`
- `/api/orders`
- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`

## Production Checks

```bash
npm audit --omit=dev
npm run build
```

Before launch, connect an online payment provider or keep manual payment confirmation explicit in the checkout copy. The current order flow records pending orders and requires manual stock/payment confirmation.
