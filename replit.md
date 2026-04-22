# OhMyDress — Next.js storefront

Romanian luxury fashion brand selling limited-edition dresses and Italian leather bags. The site was originally a Next.js template called "NRMLSS" and has been rebranded to **Oh My Dress** while preserving the underlying GSAP animations and scroll interactions.

## Tagline
"Dress it like you own it" — limited-edition luxury, Made in Italy craftsmanship.

## Tech stack
- **Framework**: Next.js 16.2.4 (App Router) + React
- **Animation**: GSAP (ScrollTrigger, SplitText), Lenis smooth scroll
- **State**: Zustand (`src/store/cartStore.js`)
- **Fonts**: Playfair Display (italic serif headings), Cormorant Garamond (body), Pinyon Script (script accents) via `next/font/google`
- **Dev server**: `npm run dev` on port 5000, host 0.0.0.0 (proxied through Replit preview)

## Workflow
- "Start application" runs `npm run dev` and serves the app in the webview.

## Brand system
- Palette tokens live in `src/app/globals.css`:
  - `--brand-burgundy: #7d1528` (primary)
  - `--brand-burgundy-deep: #5a0e1c`
  - `--brand-gold: #b08a4a`
  - `--base-100: #fffdf8` (cream background) → `--base-700: #0d0d0d` (deep black text)
- Primary buttons + CTAs use burgundy on cream; transition-block uses burgundy.

## Content sources
- Product images come from the OhMyDress Shopify CDN (`https://ohmydress.store/cdn/shop/files/...`). They are referenced directly via plain `<img>` tags — no `next/image` config required.
- Logo: `public/brand/ohmydress-logo.png`. Rendered by `src/components/BrandIcon/BrandIcon.jsx`.

## Catalogue
- `src/app/wardrobe/products.js` — 16 items (dresses + bags). Each product has `name`, `price` (lei suffix), `color`, `tag` (`Dresses` | `Bags`), `sizes`, `image` (CDN URL), `description`.
- Wardrobe filters: tag (All / Dresses / Bags), color (Black / Red / Burgundy / Blue / Ivory / Camel / Terracotta).

## Routes (kept from template — internal slugs, user-facing labels rebranded)
- `/` — home (hero + featured dresses + marquee + text block + peel reveal + CTA)
- `/wardrobe` — full collection with filters
- `/genesis` — brand story
- `/lookbook` — orb interactive lookbook
- `/touchpoint` — contact page
- `/unit` — featured product page (Halter Neck Ruched Red Gown)

## Contact
- hello@ohmydress.ro (customer care)
- press@ohmydress.ro (press / wholesale)
- Instagram: instagram.com/ohmydress.store
- TikTok: tiktok.com/@ohmydress
- Bucharest, Romania
