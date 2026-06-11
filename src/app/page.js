import DynamicHome from "@/components/DynamicHome/DynamicHome";
import { AnnouncementStrip, MarketingBanner } from "@/components/Marketing/Marketing";
import { getCommerceSettings, getEnabledByPlacement } from "@/lib/commerceContent";
import { getSitePage } from "@/lib/siteContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Index() {
  const { page } = await getSitePage("home");
  const { settings } = await getCommerceSettings();
  const announcements = getEnabledByPlacement(settings.announcementBars, "home");
  const banners = getEnabledByPlacement(settings.banners, "home");

  return (
    <>
      {announcements.map((item) => (
        <AnnouncementStrip key={item.id || item.text} item={item} />
      ))}
      {banners.map((item) => (
        <MarketingBanner key={item.id || item.title} item={item} />
      ))}
      <DynamicHome page={page} />
    </>
  );
}
