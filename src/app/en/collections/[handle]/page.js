import { notFound } from "next/navigation";

import Product from "@/components/Product/Product";
import { AnnouncementStrip, MarketingBanner } from "@/components/Marketing/Marketing";
import {
  collections,
  getCollectionByHandle,
  getProductsByCollection,
  products,
} from "@/app/wardrobe/products";
import {
  getCommerceSettings,
  getCustomCollection,
  getEnabledByPlacement,
  localizeCommerceSettings,
  matchesRules,
} from "@/lib/commerceContent";
import { localizeCollection, ui } from "@/lib/i18n";
import "@/app/wardrobe/wardrobe.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return collections.map((collection) => ({ handle: collection.handle }));
}

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const { settings: rawSettings } = await getCommerceSettings();
  const settings = localizeCommerceSettings(rawSettings, "en");
  const collection = localizeCollection(
    getCollectionByHandle(handle) || getCustomCollection(settings, handle),
    "en"
  );

  if (!collection) return {};

  return {
    title: collection.title,
    description: collection.description,
    alternates: {
      canonical: `/en/collections/${collection.canonicalHandle || collection.handle}`,
      languages: {
        ro: `/collections/${collection.canonicalHandle || collection.handle}`,
        en: `/en/collections/${collection.canonicalHandle || collection.handle}`,
      },
    },
    openGraph: {
      title: `${collection.title} | OhMyDress`,
      description: collection.description,
      url: `/en/collections/${collection.canonicalHandle || collection.handle}`,
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function EnglishCollectionPage({ params }) {
  const { handle } = await params;
  const { settings: rawSettings } = await getCommerceSettings();
  const settings = localizeCommerceSettings(rawSettings, "en");
  const baseCollection = getCollectionByHandle(handle);
  const collection = localizeCollection(
    baseCollection || getCustomCollection(settings, handle),
    "en"
  );
  const copy = ui("en");

  if (!collection) notFound();

  const collectionProducts = baseCollection
    ? getProductsByCollection(collection.handle)
    : products.filter((product) => matchesRules(product, collection.match));

  return (
    <>
      {getEnabledByPlacement(settings.announcementBars, "collection").map((item) => (
        <AnnouncementStrip key={item.id || item.text} item={item} locale="en" />
      ))}
      <section className="products-header collection-header">
        <div className="container">
          <p>{collection.eyebrow}</p>
          <h1>{collection.title}</h1>
          <p className="bodyCopy collection-description">
            {collection.description}
          </p>
          <div className="products-header-divider"></div>
        </div>
      </section>
      {getEnabledByPlacement(settings.banners, "collection").map((item) => (
        <MarketingBanner key={item.id || item.title} item={item} locale="en" />
      ))}
      <section className="product-list">
        <div className="container">
          {collectionProducts.length > 0 ? (
            collectionProducts.map((product) => (
              <Product
                key={product.slug}
                product={product}
                showAddToCart={true}
              />
            ))
          ) : (
            <p className="bodyCopy collection-empty">{copy.sectionEmpty}</p>
          )}
        </div>
      </section>
    </>
  );
}
