import { NextResponse } from "next/server";

import {
  resetCommerceSettings,
  saveCommerceSettings,
} from "@/lib/commerceContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

const isValidSettings = (settings) =>
  isObject(settings) &&
  Array.isArray(settings.announcementBars) &&
  Array.isArray(settings.banners) &&
  Array.isArray(settings.productCtas) &&
  isObject(settings.checkout) &&
  Array.isArray(settings.customCollections);

export async function POST(request) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const redirectTo = (status) =>
    NextResponse.redirect(new URL(`/admin/marketing?status=${status}`, request.url));

  if (intent === "reset") {
    await resetCommerceSettings();
    return redirectTo("reset");
  }

  try {
    const settings = JSON.parse(String(formData.get("settingsJson") || ""));

    if (!isValidSettings(settings)) {
      return redirectTo("invalid");
    }

    await saveCommerceSettings(settings);
    return redirectTo("saved");
  } catch {
    return redirectTo("invalid");
  }
}
