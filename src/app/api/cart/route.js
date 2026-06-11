import { NextResponse } from "next/server";

import { getProductBySlug } from "@/app/wardrobe/products";
import { updateCartStatus, upsertCart } from "@/lib/cartStorage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sanitizeText = (value, maxLength = 500) =>
  String(value ?? "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength);

const normalizeItems = (items = []) =>
  items
    .map((item) => {
      const product = getProductBySlug(item.slug);
      if (!product) return null;

      const quantity = Math.min(Math.max(Number(item.quantity) || 1, 1), 20);
      const size = sanitizeText(item.size || product.sizes?.[0] || "One Size", 60);
      const unitPrice = Number(product.price);

      return {
        slug: product.slug,
        sku: product.sku,
        name: product.name,
        size,
        quantity,
        unitPrice,
        lineTotal: unitPrice * quantity,
        image: product.image,
      };
    })
    .filter(Boolean);

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body?.cartId) {
    return NextResponse.json({ error: "Missing cart id." }, { status: 400 });
  }

  const items = normalizeItems(body.items);
  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
  const customer = body.customer || {};

  await upsertCart({
    id: sanitizeText(body.cartId, 120),
    status: items.length > 0 ? "active" : "empty",
    currency: "RON",
    locale: sanitizeText(body.locale, 12),
    path: sanitizeText(body.path, 240),
    customer: {
      email: sanitizeText(customer.email, 120),
      phone: sanitizeText(customer.phone, 60),
      firstName: sanitizeText(customer.firstName, 80),
      lastName: sanitizeText(customer.lastName, 80),
    },
    items,
    totals: {
      subtotal,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
    },
    metadata: {
      userAgent: sanitizeText(request.headers.get("user-agent"), 240),
    },
  });

  return NextResponse.json({ ok: true, subtotal });
}

export async function DELETE(request) {
  const body = await request.json().catch(() => null);

  if (!body?.cartId) {
    return NextResponse.json({ error: "Missing cart id." }, { status: 400 });
  }

  await updateCartStatus(sanitizeText(body.cartId, 120), "cleared");
  return NextResponse.json({ ok: true });
}
