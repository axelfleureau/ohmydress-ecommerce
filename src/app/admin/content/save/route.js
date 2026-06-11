import { NextResponse } from "next/server";

import {
  getEditableSitePages,
  resetSitePage,
  saveSitePage,
} from "@/lib/siteContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isValidPage = (page) =>
  page &&
  typeof page === "object" &&
  page.sections &&
  typeof page.sections === "object" &&
  Array.isArray(page.order);

export async function POST(request) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const pageKey = String(formData.get("pageKey") || "home");
  const knownPage = getEditableSitePages().some((page) => page.key === pageKey);
  const redirectTo = (status) =>
    NextResponse.redirect(
      new URL(
        `/admin/content?page=${encodeURIComponent(pageKey)}&status=${status}`,
        request.url
      )
    );

  if (!knownPage) {
    return redirectTo("invalid");
  }

  if (intent === "reset") {
    await resetSitePage(pageKey);
    return redirectTo("reset");
  }

  try {
    const page = JSON.parse(String(formData.get("pageJson") || ""));

    if (!isValidPage(page)) {
      return redirectTo("invalid");
    }

    await saveSitePage(pageKey, page);
    return redirectTo("saved");
  } catch {
    return redirectTo("invalid");
  }
}
