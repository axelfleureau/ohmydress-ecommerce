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
  matchesRules,
} from "@/lib/commerceContent";
import "@/app/wardrobe/wardrobe.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return collections.map((collection) => ({ handle: collection.handle }));
}

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const { settings } = await getCommerceSettings();
  const collection =
    getCollectionByHandle(handle) || getCustomCollection(settings, handle);

  if (!collection) return {};

  return {
    title: collection.title,
    description: collection.description,
    alternates: {
      canonical: `/collections/${collection.canonicalHandle || collection.handle}`,
    },
    openGraph: {
      title: `${collection.title} | OhMyDress`,
      description: collection.description,
      url: `/collections/${collection.canonicalHandle || collection.handle}`,
      locale: "ro_RO",
      type: "website",
    },
    robots: collection.noindex
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  };
}

export default async function CollectionPage({ params }) {
  const { handle } = await params;
  const { settings } = await getCommerceSettings();
  const baseCollection = getCollectionByHandle(handle);
  const collection = baseCollection || getCustomCollection(settings, handle);

  if (!collection) notFound();

  const collectionProducts = baseCollection
    ? getProductsByCollection(collection.handle)
    : products.filter((product) => matchesRules(product, collection.match));
  const announcements = getEnabledByPlacement(
    settings.announcementBars,
    "collection"
  );
  const banners = getEnabledByPlacement(settings.banners, "collection");

  return (
    <>
      {announcements.map((item) => (
        <AnnouncementStrip key={item.id || item.text} item={item} />
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
      {banners.map((item) => (
        <MarketingBanner key={item.id || item.title} item={item} />
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
            <p className="bodyCopy collection-empty">
              Sectiunea este pregatita. Adauga produse cu tagurile configurate
              in admin pentru a le afisa aici.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
