import { collections, products } from "@/app/wardrobe/products";
import { shopifyPageTemplates } from "@/content/shopify-theme.generated";

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ohmydress.ro";
  const now = new Date();

  const staticRoutes = ["/", "/wardrobe", "/genesis", "/lookbook", "/touchpoint"];
  const pageRoutes = Object.keys(shopifyPageTemplates)
    .filter((handle) => handle !== "privacy-policy" && handle !== "terms-conditions")
    .map((handle) => `/pages/${handle}`);
  const productRoutes = products.map((product) => `/products/${product.slug}`);
  const collectionRoutes = collections
    .filter((collection) => !collection.isAlias && !collection.noindex)
    .map((collection) => `/collections/${collection.handle}`);
  const englishStaticRoutes = staticRoutes.map((route) =>
    route === "/" ? "/en" : `/en${route}`
  );
  const englishPageRoutes = pageRoutes.map((route) => `/en${route}`);
  const englishCollectionRoutes = collectionRoutes.map((route) => `/en${route}`);
  const englishProductRoutes = productRoutes.map((route) => `/en${route}`);

  return [
    ...staticRoutes,
    ...pageRoutes,
    ...collectionRoutes,
    ...productRoutes,
    ...englishStaticRoutes,
    ...englishPageRoutes,
    ...englishCollectionRoutes,
    ...englishProductRoutes,
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "/" || route === "/en" ? "daily" : "weekly",
    priority:
      route === "/" || route === "/en"
        ? 1
        : route.includes("/products")
          ? 0.8
          : 0.7,
  }));
}
