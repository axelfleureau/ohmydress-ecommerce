import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { shopifyProducts } from "../src/app/wardrobe/shopify-products.generated.js";

const outputPath = resolve(
  import.meta.dirname,
  "../apps/commerce/apps/backend/src/data/ohmydress-products.json"
);

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function fallbackSku(product, index) {
  const source = product.sku || product.shopifyHandle || product.slug || product.name;
  return String(source)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase()
    .slice(0, 48) || `OMD-${String(index + 1).padStart(4, "0")}`;
}

function slugify(value, fallback) {
  const slug = String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ș/g, "s")
    .replace(/Ș/g, "s")
    .replace(/ț/g, "t")
    .replace(/Ț/g, "t")
    .replace(/ă/g, "a")
    .replace(/Ă/g, "a")
    .replace(/î/g, "i")
    .replace(/Î/g, "i")
    .replace(/â/g, "a")
    .replace(/Â/g, "a")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
}

const medusaProducts = shopifyProducts.map((product, productIndex) => {
  const sizes = unique(
    (product.variants?.length ? product.variants : [{ size: "One Size" }]).map(
      (variant) => variant.size || variant.title || "One Size"
    )
  );
  const colors = unique([product.color, ...((product.variants ?? []).map((variant) => variant.color))]);
  const hasColorOption = colors.length > 0;
  const currencyCode = (product.currency || "RON").toLowerCase();

  const handle = slugify(
    product.shopifyHandle || product.slug || product.name,
    `ohmydress-${productIndex + 1}`
  );

  return {
    title: product.name,
    handle,
    description: product.description || "",
    status: product.available ? "published" : "draft",
    category: product.tag || "OhMyDress",
    tags: product.tags || [],
    thumbnail: product.image || product.images?.[0] || null,
    images: unique(product.images || [product.image, product.hoverImage]),
    metadata: {
      shopify_id: product.id,
      shopify_handle: product.shopifyHandle || product.slug || null,
      source: "shopify-products.generated.js",
      color_hex: product.colorHex || null,
      compare_at_price: product.compareAtPrice || null,
      published_at: product.publishedAt || null,
    },
    options: [
      {
        title: "Size",
        values: sizes.length ? sizes : ["One Size"],
      },
      ...(hasColorOption
        ? [
            {
              title: "Color",
              values: colors,
            },
          ]
        : []),
    ],
    variants: (product.variants?.length ? product.variants : [{ title: "Default", size: "One Size" }]).map(
      (variant, variantIndex) => {
        const size = variant.size || variant.title || "One Size";
        const color = variant.color || product.color || null;
        const sku = variant.sku || fallbackSku(product, productIndex);
        const optionValues = {
          Size: size,
          ...(hasColorOption ? { Color: color || colors[0] } : {}),
        };

        return {
          title: variant.title && variant.title !== "Default Title" ? variant.title : unique([size, color]).join(" / "),
          sku: variantIndex === 0 ? sku : `${sku}-${variantIndex + 1}`,
          manage_inventory: false,
          allow_backorder: false,
          options: optionValues,
          prices: [
            {
              amount: Number.parseFloat(variant.price || product.price || "0"),
              currency_code: currencyCode,
            },
          ],
          metadata: {
            shopify_variant_id: variant.id || null,
            available: variant.available ?? product.available ?? true,
            compare_at_price: variant.compareAtPrice || product.compareAtPrice || null,
          },
        };
      }
    ),
  };
});

mkdirSync(resolve(outputPath, ".."), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(medusaProducts, null, 2)}\n`);

console.log(`Exported ${medusaProducts.length} products to ${outputPath}`);
