"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";

import { getPathLocale } from "@/lib/i18n";
import { useCartStore } from "@/store/cartStore";

export default function useCartSync(customer = {}) {
  const pathname = usePathname();
  const cartId = useCartStore((state) => state.cartId);
  const cartItems = useCartStore((state) => state.cartItems);
  const ensureCartId = useCartStore((state) => state.ensureCartId);
  const lastPayloadRef = useRef("");
  const customerEmail = customer.email || "";
  const customerPhone = customer.phone || "";
  const customerFirstName = customer.firstName || "";
  const customerLastName = customer.lastName || "";

  useEffect(() => {
    ensureCartId();
  }, [ensureCartId]);

  const payload = useMemo(
    () => ({
      cartId,
      locale: getPathLocale(pathname),
      path: pathname,
      customer: {
        email: customerEmail,
        phone: customerPhone,
        firstName: customerFirstName,
        lastName: customerLastName,
      },
      items: cartItems.map((item) => ({
        slug: item.slug,
        size: item.size,
        quantity: item.quantity || 1,
      })),
    }),
    [
      cartId,
      cartItems,
      customerEmail,
      customerFirstName,
      customerLastName,
      customerPhone,
      pathname,
    ]
  );

  useEffect(() => {
    if (!payload.cartId) return;

    const serialized = JSON.stringify(payload);
    if (serialized === lastPayloadRef.current) return;

    const timer = window.setTimeout(() => {
      lastPayloadRef.current = serialized;

      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: serialized,
        keepalive: true,
      }).catch(() => {});
    }, 700);

    return () => window.clearTimeout(timer);
  }, [payload]);
}
