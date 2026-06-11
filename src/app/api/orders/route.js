import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { getProductBySlug } from "@/app/wardrobe/products";
import { updateCartStatus } from "@/lib/cartStorage";
import { saveOrder } from "@/lib/orderStorage";

export const runtime = "nodejs";

const requiredFields = [
  "email",
  "phone",
  "firstName",
  "lastName",
];

const sanitizeText = (value, maxLength = 500) =>
  String(value ?? "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength);

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { error: "Cosul este gol sau request-ul este invalid." },
      { status: 400 }
    );
  }

  const customer = body.customer || {};
  const missingField = requiredFields.find((field) => !sanitizeText(customer[field]));

  if (missingField) {
    return NextResponse.json(
      { error: "Completeaza toate campurile obligatorii." },
      { status: 400 }
    );
  }

  const deliveryMethod = body.delivery?.method === "locker" ? "locker" : "address";
  const locker = body.delivery?.locker || null;

  if (deliveryMethod === "address") {
    const missingAddressField = ["address", "city", "county"].find(
      (field) => !sanitizeText(customer[field])
    );

    if (missingAddressField) {
      return NextResponse.json(
        { error: "Completeaza adresa de livrare." },
        { status: 400 }
      );
    }
  }

  if (deliveryMethod === "locker") {
    const missingLockerField = ["lockerId", "name", "address", "city", "county"].find(
      (field) => !sanitizeText(locker?.[field])
    );

    if (missingLockerField) {
      return NextResponse.json(
        { error: "Alege un easybox sau punct PUDO pentru livrare." },
        { status: 400 }
      );
    }
  }

  const items = body.items.map((item) => {
    const product = getProductBySlug(item.slug);

    if (!product) return null;

    const quantity = Math.min(Math.max(Number(item.quantity) || 1, 1), 20);
    const size = sanitizeText(item.size || product.sizes?.[0] || "One Size", 60);

    if (!product.sizes.includes(size)) return null;
    if (product.available === false) return null;

    const selectedVariant = product.variants?.find(
      (variant) => variant.size === size
    );

    if (selectedVariant && selectedVariant.available === false) return null;

    const unitPrice = Number(product.price);

    return {
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      size,
      quantity,
      unitPrice,
      lineTotal: unitPrice * quantity,
    };
  });

  if (items.some((item) => !item)) {
    return NextResponse.json(
      { error: "Un produs din cos nu mai este disponibil." },
      { status: 400 }
    );
  }

  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
  const orderNumber = `OMD-${Date.now().toString(36).toUpperCase()}`;
  const createdAt = new Date().toISOString();
  const order = {
    id: randomUUID(),
    orderNumber,
    createdAt,
    status: "pending_confirmation",
    currency: "RON",
    customer: {
      email: sanitizeText(customer.email, 120),
      phone: sanitizeText(customer.phone, 60),
      firstName: sanitizeText(customer.firstName, 80),
      lastName: sanitizeText(customer.lastName, 80),
      address: sanitizeText(customer.address, 240),
      city: sanitizeText(customer.city, 100),
      county: sanitizeText(customer.county, 100),
      postalCode: sanitizeText(customer.postalCode, 40),
      notes: sanitizeText(customer.notes, 800),
    },
    delivery: {
      provider: deliveryMethod === "locker" ? "sameday" : "manual",
      method: deliveryMethod,
      locker:
        deliveryMethod === "locker"
          ? {
              provider: "sameday",
              type: sanitizeText(locker.type, 30),
              lockerId: sanitizeText(locker.lockerId, 40),
              oohType: sanitizeText(locker.oohType, 20),
              name: sanitizeText(locker.name, 160),
              address: sanitizeText(locker.address, 240),
              cityId: sanitizeText(locker.cityId, 40),
              city: sanitizeText(locker.city, 100),
              countyId: sanitizeText(locker.countyId, 40),
              county: sanitizeText(locker.county, 100),
              postalCode: sanitizeText(locker.postalCode, 40),
            }
          : null,
    },
    items,
    totals: {
      subtotal,
      shipping: null,
      grandTotal: subtotal,
    },
    payment: {
      status: "pending_manual_confirmation",
      method: "manual",
    },
  };

  await saveOrder(order);
  await updateCartStatus(body.cartId, "converted", {
    orderNumber,
    orderId: order.id,
  });

  return NextResponse.json({
    orderNumber,
    status: order.status,
    grandTotal: order.totals.grandTotal,
  });
}
