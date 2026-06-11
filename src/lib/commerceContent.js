import { defaultCommerceSettings } from "@/content/commerce-settings.default";
import { getSitePage, saveSitePage } from "@/lib/siteContent";

export const commerceSettingsKey = "commerce_settings";

const asArray = (value) => (Array.isArray(value) ? value : []);
const lower = (value) => String(value || "").toLowerCase();

export const normalizeCommerceSettings = (settings = {}) => ({
  announcementBars: asArray(settings.announcementBars),
  banners: asArray(settings.banners),
  productCtas: asArray(settings.productCtas),
  checkout: {
    ...defaultCommerceSettings.checkout,
    ...(settings.checkout || {}),
  },
  customCollections: asArray(settings.customCollections),
});

export const getCommerceSettings = async () => {
  const { page, source, updatedAt } = await getSitePage(commerceSettingsKey);

  return {
    settings: normalizeCommerceSettings(page || defaultCommerceSettings),
    source,
    updatedAt,
  };
};

export const saveCommerceSettings = async (settings) =>
  saveSitePage(commerceSettingsKey, normalizeCommerceSettings(settings));

export const resetCommerceSettings = async () =>
  saveCommerceSettings(defaultCommerceSettings);

export const getEnabledByPlacement = (items, placement) =>
  asArray(items).filter(
    (item) =>
      item?.enabled !== false &&
      (item.placement === placement || item.placement === "all")
  );

export const matchesRules = (product, match = {}) => {
  const tags = asArray(product?.tags).map(lower);
  const category = lower(product?.tag);
  const name = lower(product?.name);
  const description = lower(product?.description);
  const collections = asArray(product?.collections).map(lower);

  const wantedProducts = asArray(match.products).map(lower);
  if (wantedProducts.includes(lower(product?.slug))) return true;

  const wantedCollections = asArray(match.collections).map(lower);
  if (wantedCollections.some((value) => collections.includes(value))) return true;

  const wantedCategories = asArray(match.categories).map(lower);
  if (wantedCategories.includes(category)) return true;

  const wantedTags = asArray(match.tags).map(lower);
  if (wantedTags.some((value) => tags.includes(value))) return true;

  const wantedKeywords = asArray(match.keywords).map(lower);
  if (
    wantedKeywords.some(
      (value) => name.includes(value) || description.includes(value)
    )
  ) {
    return true;
  }

  return (
    !wantedProducts.length &&
    !wantedCollections.length &&
    !wantedCategories.length &&
    !wantedTags.length &&
    !wantedKeywords.length
  );
};

export const getProductCtas = (settings, product) =>
  asArray(settings?.productCtas).filter(
    (cta) => cta?.enabled !== false && matchesRules(product, cta.match)
  );

export const getCustomCollection = (settings, handle) =>
  asArray(settings?.customCollections).find(
    (collection) => collection?.enabled !== false && collection.handle === handle
  );

const englishById = {
  "free-shipping-bar": {
    text: "Free shipping on orders over 350 lei",
  },
  "checkout-care": {
    eyebrow: "Active benefit",
    title: "Add more items for free shipping",
    body: "Orders over 350 lei get free shipping in Romania.",
    ctaLabel: "Keep shopping",
  },
  "occasion-accessories": {
    title: "Complete the outfit",
    body: "Add an occasion bag or belt for a complete look.",
    ctaLabel: "View accessories",
  },
};

export const localizeCommerceSettings = (settings, locale = "ro") => {
  if (locale !== "en") return settings;

  return {
    ...settings,
    announcementBars: asArray(settings.announcementBars).map((item) => ({
      ...item,
      ...(englishById[item.id] || {}),
    })),
    banners: asArray(settings.banners).map((item) => ({
      ...item,
      ...(englishById[item.id] || {}),
    })),
    productCtas: asArray(settings.productCtas).map((item) => ({
      ...item,
      ...(englishById[item.id] || {}),
    })),
    checkout: {
      ...settings.checkout,
      freeShippingMessage: "Add {amount} lei more for free shipping in Romania.",
      freeShippingUnlockedMessage:
        "Free shipping is active for this order.",
      note:
        "Payment is confirmed manually after stock verification. The order is stored by the self-hosted API.",
    },
    customCollections: asArray(settings.customCollections).map((collection) =>
      collection.handle === "cosmetics"
        ? {
            ...collection,
            title: "Cosmetics",
            eyebrow: "New category",
            description:
              "A prepared section for future OhMyDress cosmetics and beauty drops.",
          }
        : collection
    ),
  };
};
