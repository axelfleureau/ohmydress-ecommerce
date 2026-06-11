import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const PRODUCTS_URL = "https://ohmydress.ro/products.json?limit=250";
const OUTPUT_PATH = path.join(
  process.cwd(),
  "src/app/wardrobe/shopify-products.generated.js"
);

const colorRules = [
  ["Bordeaux", ["bordeaux", "burgundy"], "#7d1528"],
  ["Black", ["negru", "neagra", "black", "noir", "nero"], "#121212"],
  ["Brown", ["maro", "brown"], "#6f4631"],
  ["Camel", ["camel"], "#b08a4a"],
  ["Taupe", ["taupe"], "#a08b78"],
  ["Beige", ["beige"], "#d8c3a5"],
  ["Cream", ["crem", "cream"], "#f3ead8"],
  ["Ivory", ["ivory"], "#f5ecd9"],
  ["White", ["alb", "alba", "white"], "#f8f5ee"],
  ["Red", ["rosu", "roșu", "red"], "#b81b2c"],
  ["Pink", ["roz", "pink"], "#e8a6b4"],
  ["Blue", ["blue", "albastra", "albastră", "sky"], "#7393c5"],
  ["Champagne", ["champagne"], "#d7bd84"],
  ["Gold", ["auriu", "gold", "golden"], "#c6a04d"],
  ["Silver", ["argintiu", "silver"], "#b8bbc1"],
  ["Grey", ["gri", "grey"], "#8f8f8f"],
  ["Khaki", ["khaki"], "#7c7653"],
  ["Terracotta", ["terracotta"], "#b25434"],
];

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const stripHtml = (html) =>
  String(html || "")
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\\s+/g, " ")
    .trim();

const inferColor = (title, tags) => {
  const source = normalize(`${title} ${(tags || []).join(" ")}`);
  const match = colorRules.find(([, keywords]) =>
    keywords.some((keyword) => source.includes(normalize(keyword)))
  );

  return {
    color: match?.[0] || "Neutral",
    colorHex: match?.[2] || "#d9cdb9",
  };
};

const hasTag = (tags, tag) => tags.includes(tag);

const inferTag = (title, tags) => {
  const normalizedTitle = normalize(title);

  if (hasTag(tags, "belt") || hasTag(tags, "curele")) return "Belts";
  if (hasTag(tags, "bag") || hasTag(tags, "pochette")) return "Bags";
  if (hasTag(tags, "tops") || hasTag(tags, "cashmere") || hasTag(tags, "corset")) {
    return "Tops";
  }
  if (hasTag(tags, "skirt")) return "Skirts";
  if (hasTag(tags, "trousers")) return "Trousers";
  if (hasTag(tags, "jumpsuit")) return "Jumpsuits";
  if (hasTag(tags, "co-ords") || hasTag(tags, "lounge set") || hasTag(tags, "suit")) {
    return "Co-Ords";
  }
  if (
    normalizedTitle.includes("rochie") ||
    hasTag(tags, "occasion") ||
    hasTag(tags, "mini") ||
    hasTag(tags, "midi") ||
    hasTag(tags, "long") ||
    hasTag(tags, "backless") ||
    hasTag(tags, "sparkle")
  ) {
    return "Dresses";
  }

  return "Clothing";
};

const getVariantSize = (variant) => {
  if (!variant || variant.title === "Default Title") return "One Size";
  return variant.option1 || variant.title || "One Size";
};

const toProduct = (product, index) => {
  const tags = (product.tags || []).map((tag) => String(tag).trim()).filter(Boolean);
  const variants = (product.variants || []).map((variant) => ({
    id: variant.id,
    title: variant.title,
    sku: variant.sku || `OMD-${String(index + 1).padStart(4, "0")}`,
    size: getVariantSize(variant),
    color: variant.option2 || null,
    available: Boolean(variant.available),
    price: variant.price,
    compareAtPrice: variant.compare_at_price || null,
  }));
  const sizes = [...new Set(variants.map((variant) => variant.size))];
  const images = (product.images || []).map((image) => image.src).filter(Boolean);
  const firstVariant = variants[0];
  const { color, colorHex } = inferColor(product.title, tags);

  return {
    id: product.id,
    name: product.title,
    slug: product.handle,
    shopifyHandle: product.handle,
    sku: firstVariant?.sku || `OMD-${String(index + 1).padStart(4, "0")}`,
    price: firstVariant?.price || "0.00",
    compareAtPrice: firstVariant?.compareAtPrice || null,
    currency: "RON",
    color,
    colorHex,
    tag: inferTag(product.title, tags),
    tags,
    sizes: sizes.length > 0 ? sizes : ["One Size"],
    variants,
    image: images[0] || "/products/product_1.png",
    hoverImage: images[1] || images[0] || "/products/product_1.png",
    images,
    description:
      stripHtml(product.body_html) ||
      "Piesa OhMyDress in editie limitata, disponibila pentru comanda online.",
    available: variants.some((variant) => variant.available),
    inventoryPolicy: "limited",
    publishedAt: product.published_at,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  };
};

const response = await fetch(PRODUCTS_URL, {
  headers: {
    accept: "application/json",
    "user-agent": "ohmydress-selfhost-import/1.0",
  },
});

if (!response.ok) {
  throw new Error(`Shopify import failed: ${response.status} ${response.statusText}`);
}

const payload = await response.json();
const products = (payload.products || []).map(toProduct);

if (products.length === 0) {
  throw new Error("Shopify import returned zero products.");
}

const source = `// Generated by scripts/import-shopify-products.mjs from ${PRODUCTS_URL}
// Do not edit manually; rerun npm run import:products.

export const shopifyProducts = ${JSON.stringify(products, null, 2)};
`;

await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
await writeFile(OUTPUT_PATH, source);

console.log(`Imported ${products.length} products into ${OUTPUT_PATH}`);
