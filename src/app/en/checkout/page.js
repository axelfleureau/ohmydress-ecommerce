import CheckoutClient from "@/app/checkout/CheckoutClient";
import {
  getCommerceSettings,
  getEnabledByPlacement,
  localizeCommerceSettings,
} from "@/lib/commerceContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout",
  alternates: {
    canonical: "/en/checkout",
    languages: {
      ro: "/checkout",
      en: "/en/checkout",
    },
  },
};

export default async function EnglishCheckoutPage() {
  const { settings: rawSettings } = await getCommerceSettings();
  const settings = localizeCommerceSettings(rawSettings, "en");

  return (
    <CheckoutClient
      locale="en"
      checkoutSettings={settings.checkout}
      announcements={getEnabledByPlacement(settings.announcementBars, "checkout")}
      banners={getEnabledByPlacement(settings.banners, "checkout")}
    />
  );
}
