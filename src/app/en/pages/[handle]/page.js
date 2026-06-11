import { notFound } from "next/navigation";

import DynamicHome from "@/components/DynamicHome/DynamicHome";
import { shopifyPageTemplates } from "@/content/shopify-theme.generated";
import { getSitePage } from "@/lib/siteContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return Object.keys(shopifyPageTemplates).map((handle) => ({ handle }));
}

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const template = shopifyPageTemplates[handle];

  if (!template) return {};

  return {
    title: template.title,
    alternates: {
      canonical: `/en/pages/${handle}`,
      languages: {
        ro: `/pages/${handle}`,
        en: `/en/pages/${handle}`,
      },
    },
    robots:
      handle === "privacy-policy" || handle === "terms-conditions"
        ? {
            index: false,
            follow: true,
          }
        : undefined,
  };
}

export default async function EnglishShopifyPage({ params }) {
  const { handle } = await params;

  if (!shopifyPageTemplates[handle]) notFound();

  const { page } = await getSitePage(`page.${handle}`);

  if (!page) notFound();

  return <DynamicHome page={page} locale="en" />;
}
