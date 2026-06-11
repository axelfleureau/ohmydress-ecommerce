import { getCloudflareContext } from "@opennextjs/cloudflare";

import {
  shopifyHomePage,
  shopifyPageTemplates,
  shopifyTheme,
} from "@/content/shopify-theme.generated";
import { defaultCommerceSettings } from "@/content/commerce-settings.default";

const fallbackPages = {
  home: shopifyHomePage,
  commerce_settings: defaultCommerceSettings,
  theme_manifest: shopifyTheme,
  ...Object.fromEntries(
    Object.entries(shopifyPageTemplates).map(([handle, page]) => [
      `page.${handle}`,
      page,
    ])
  ),
};

export const getEditableSitePages = () => [
  {
    key: "home",
    label: "Homepage",
    previewPath: "/",
  },
  ...Object.entries(shopifyPageTemplates).map(([handle, page]) => ({
    key: `page.${handle}`,
    label: page.title || handle,
    previewPath: `/pages/${handle}`,
  })),
];

const deserialize = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getD1 = async () => {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return null;
  }

  try {
    return getCloudflareContext().env.DB;
  } catch {
    try {
      const context = await getCloudflareContext({ async: true });
      return context.env.DB;
    } catch {
      return null;
    }
  }
};

export const getFallbackSitePage = (pageKey) => fallbackPages[pageKey] || null;

export const getSitePage = async (pageKey) => {
  const fallback = getFallbackSitePage(pageKey);
  const db = await getD1();

  if (!db) {
    return {
      page: fallback,
      source: "fallback",
    };
  }

  const row = await db
    .prepare("SELECT data_json, updated_at FROM site_pages WHERE page_key = ?")
    .bind(pageKey)
    .first();

  if (!row) {
    return {
      page: fallback,
      source: "fallback",
    };
  }

  return {
    page: deserialize(row.data_json, fallback),
    source: "d1",
    updatedAt: row.updated_at,
  };
};

export const saveSitePage = async (pageKey, page) => {
  const db = await getD1();

  if (!db) {
    throw new Error("Cloudflare D1 binding DB is not available.");
  }

  const updatedAt = new Date().toISOString();

  await db
    .prepare(
      `INSERT INTO site_pages (page_key, data_json, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(page_key) DO UPDATE SET
         data_json = excluded.data_json,
         updated_at = excluded.updated_at`
    )
    .bind(pageKey, JSON.stringify(page), updatedAt)
    .run();

  return { updatedAt };
};

export const resetSitePage = async (pageKey) => {
  const fallback = getFallbackSitePage(pageKey);

  if (!fallback) {
    throw new Error(`Unknown site page: ${pageKey}`);
  }

  return saveSitePage(pageKey, fallback);
};
