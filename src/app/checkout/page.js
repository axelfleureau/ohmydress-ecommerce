import CheckoutClient from "./CheckoutClient";
import {
  getCommerceSettings,
  getEnabledByPlacement,
} from "@/lib/commerceContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const { settings } = await getCommerceSettings();

  return (
    <CheckoutClient
      locale="ro"
      checkoutSettings={settings.checkout}
      announcements={getEnabledByPlacement(settings.announcementBars, "checkout")}
      banners={getEnabledByPlacement(settings.banners, "checkout")}
    />
  );
}
