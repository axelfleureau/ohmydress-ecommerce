import DynamicHome from "@/components/DynamicHome/DynamicHome";
import { AnnouncementStrip, MarketingBanner } from "@/components/Marketing/Marketing";
import {
  getCommerceSettings,
  getEnabledByPlacement,
  localizeCommerceSettings,
} from "@/lib/commerceContent";
import { getSitePage } from "@/lib/siteContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "OhMyDress | Limited edition dresses and accessories",
  description:
    "Limited edition dresses, occasion outfits and Italian leather bags. Shop online in Romania, priced in lei.",
  alternates: {
    canonical: "/en",
    languages: {
      ro: "/",
      en: "/en",
    },
  },
};

export default async function EnglishHomePage() {
  const { page } = await getSitePage("home");
  const { settings: rawSettings } = await getCommerceSettings();
  const settings = localizeCommerceSettings(rawSettings, "en");

  return (
    <>
      {getEnabledByPlacement(settings.announcementBars, "home").map((item) => (
        <AnnouncementStrip key={item.id || item.text} item={item} locale="en" />
      ))}
      {getEnabledByPlacement(settings.banners, "home").map((item) => (
        <MarketingBanner key={item.id || item.title} item={item} locale="en" />
      ))}
      <DynamicHome page={page} locale="en" />
    </>
  );
}
