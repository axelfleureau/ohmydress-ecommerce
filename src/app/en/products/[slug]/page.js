import { notFound } from "next/navigation";

import ProductDetail from "@/components/ProductDetail/ProductDetail";
import { getProductBySlug, products } from "@/app/wardrobe/products";
import {
  getCommerceSettings,
  getProductCtas,
  localizeCommerceSettings,
} from "@/lib/commerceContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/en/products/${product.slug}`,
      languages: {
        ro: `/products/${product.slug}`,
        en: `/en/products/${product.slug}`,
      },
    },
    openGraph: {
      title: product.name,
      description: product.description,
      url: `/en/products/${product.slug}`,
      images: [{ url: product.image, alt: product.name }],
      type: "website",
      locale: "en_US",
    },
  };
}

export default async function EnglishProductPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const relatedProducts = products
    .filter((item) => item.slug !== product.slug && item.tag === product.tag)
    .slice(0, 3);
  const { settings: rawSettings } = await getCommerceSettings();
  const settings = localizeCommerceSettings(rawSettings, "en");
  const productCtas = getProductCtas(settings, product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [product.image],
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "OhMyDress",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "RON",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `/en/products/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail
        product={product}
        relatedProducts={relatedProducts}
        productCtas={productCtas}
      />
    </>
  );
}
