import { shopifyProducts } from "./shopify-products.generated.js";

export const products = shopifyProducts.map((product) => ({
  ...product,
  collections: [],
}));

const hasTag = (product, tag) => product.tags.includes(tag);
const hasAnyTag = (product, tags) => tags.some((tag) => hasTag(product, tag));
const isDress = (product) => product.tag === "Dresses";
const isAccessory = (product) =>
  ["Bags", "Belts"].includes(product.tag) ||
  hasAnyTag(product, ["bag", "belt", "curele", "pochette", "genuine leather"]);
const isClothing = (product) => !isAccessory(product);

export const collections = [
  {
    handle: "new-in",
    title: "New In",
    eyebrow: "Drop curent",
    description:
      "Cele mai noi rochii, tinute si accesorii OhMyDress disponibile acum.",
    match: (product) => hasTag(product, "new"),
  },
  {
    handle: "dresses",
    title: "Rochii",
    eyebrow: "Colectie",
    description:
      "Rochii mini, midi si lungi pentru seri, evenimente si aparitii memorabile.",
    match: isDress,
  },
  {
    handle: "mini-dresses",
    title: "Rochii Mini",
    eyebrow: "Cumpara dupa lungime",
    description: "Siluete scurte, feminine si statement, in editie limitata.",
    match: (product) => isDress(product) && hasTag(product, "mini"),
  },
  {
    handle: "midi-dresses",
    title: "Rochii Midi",
    eyebrow: "Cumpara dupa lungime",
    description: "Rochii midi elegante pentru tinute de seara si evenimente.",
    match: (product) => isDress(product) && hasTag(product, "midi"),
  },
  {
    handle: "long-dresses",
    title: "Rochii Lungi",
    eyebrow: "Cumpara dupa lungime",
    description: "Rochii lungi si gowns pentru aparitii cu prezenta.",
    match: (product) => isDress(product) && hasTag(product, "long"),
  },
  {
    handle: "backless-dresses",
    title: "Rochii Backless",
    eyebrow: "Cumpara dupa stil",
    description: "Rochii cu decupaje si linii senzuale, gandite pentru impact.",
    match: (product) => isDress(product) && hasTag(product, "backless"),
  },
  {
    handle: "sparkle-dresses",
    title: "Rochii Sparkle",
    eyebrow: "Cumpara dupa stil",
    description:
      "Piese cu cristale, paiete si texturi care prind lumina la fiecare pas.",
    match: (product) => isDress(product) && hasTag(product, "sparkle"),
  },
  {
    handle: "occasion-dresses",
    title: "Rochii de ocazie",
    eyebrow: "Cumpara dupa stil",
    description: "Rochii pentru evenimente, seri speciale si ocazii elegante.",
    match: (product) => isDress(product) && hasTag(product, "occasion"),
  },
  {
    handle: "long-sleeve-dresses",
    title: "Rochii Long Sleeve",
    eyebrow: "Cumpara dupa stil",
    description: "Rochii cu maneca lunga pentru tinute elegante de seara.",
    match: (product) => isDress(product) && hasTag(product, "long sleeve"),
  },
  {
    handle: "clothing",
    title: "Imbracaminte",
    eyebrow: "Colectie",
    description:
      "Tops, seturi, salopete, fuste, pantaloni si piese coordonate.",
    match: isClothing,
  },
  {
    handle: "tops",
    title: "Tops",
    eyebrow: "Imbracaminte",
    description: "Tops, corsete si bluze fine pentru tinute complete.",
    match: (product) => product.tag === "Tops" || hasTag(product, "tops"),
  },
  {
    handle: "cashmere-tops",
    title: "Cashmere Tops",
    eyebrow: "Tops",
    description: "Bluze fine din cashmere, usoare si rafinate.",
    match: (product) => hasTag(product, "cashmere"),
  },
  {
    handle: "corsets",
    title: "Corsete",
    eyebrow: "Tops",
    description: "Corsete feminine cu structura si detalii delicate.",
    match: (product) => hasTag(product, "corset"),
  },
  {
    handle: "co-ords",
    title: "Coordonate",
    eyebrow: "Imbracaminte",
    description: "Seturi coordonate si tinute complete in editie limitata.",
    match: (product) => hasTag(product, "co-ords"),
  },
  {
    handle: "lounge-sets",
    title: "Lounge Sets",
    eyebrow: "Imbracaminte",
    description: "Seturi lounge tricotate, confortabile si elegante.",
    match: (product) => hasTag(product, "lounge set"),
  },
  {
    handle: "suits",
    title: "Costume",
    eyebrow: "Imbracaminte",
    description: "Costume elegante cu linii structurate.",
    match: (product) => hasTag(product, "suit"),
  },
  {
    handle: "jumpsuits",
    title: "Salopete",
    eyebrow: "Imbracaminte",
    description: "Salopete si piese statement pentru seri speciale.",
    match: (product) => hasTag(product, "jumpsuit"),
  },
  {
    handle: "skirts",
    title: "Fuste",
    eyebrow: "Imbracaminte",
    description: "Fuste mini si piese feminine pentru styling rapid.",
    match: (product) => hasTag(product, "skirt"),
  },
  {
    handle: "trousers",
    title: "Pantaloni",
    eyebrow: "Imbracaminte",
    description: "Pantaloni usori pentru tinute fluide si elegante.",
    match: (product) => hasTag(product, "trousers"),
  },
  {
    handle: "accessories",
    title: "Accesorii",
    eyebrow: "Colectie",
    description: "Genti, posete de ocazie si curele pentru completarea tinutei.",
    match: isAccessory,
  },
  {
    handle: "genti",
    title: "Genti",
    eyebrow: "Accesorii",
    description: "Genti si posete in serii mici, fabricate in Italia.",
    match: (product) => product.tag === "Bags" || hasTag(product, "bag"),
  },
  {
    handle: "posete-din-piele-naturala",
    title: "Posete din piele naturala",
    eyebrow: "Made in Italy",
    description:
      "Posete din piele naturala italiana, cu linii atemporale si detalii rafinate.",
    match: (product) => hasTag(product, "genuine leather"),
  },
  {
    handle: "posete-de-ocazie",
    title: "Posete de ocazie",
    eyebrow: "Accesorii",
    description: "Clutch-uri si posete pentru seri, evenimente si ocazii.",
    match: (product) => hasTag(product, "pochette"),
  },
  {
    handle: "curele",
    title: "Curele",
    eyebrow: "Accesorii",
    description: "Curele din piele pentru styling elegant si precis.",
    match: (product) => product.tag === "Belts" || hasAnyTag(product, ["belt", "curele"]),
  },
  {
    handle: "frontpage",
    title: "Pagina principala",
    eyebrow: "OhMyDress",
    description: "Selectie curenta OhMyDress.",
    match: (product) => hasTag(product, "new") || isDress(product),
    noindex: true,
  },
  {
    handle: "rochii",
    canonicalHandle: "dresses",
    isAlias: true,
  },
  {
    handle: "rochii-mini",
    canonicalHandle: "mini-dresses",
    isAlias: true,
  },
  {
    handle: "rochii-midi",
    canonicalHandle: "midi-dresses",
    isAlias: true,
  },
  {
    handle: "rochii-long",
    canonicalHandle: "long-dresses",
    isAlias: true,
  },
  {
    handle: "rochii-backless",
    canonicalHandle: "backless-dresses",
    isAlias: true,
  },
  {
    handle: "rochii-sparkle",
    canonicalHandle: "sparkle-dresses",
    isAlias: true,
  },
  {
    handle: "rochii-occasion",
    canonicalHandle: "occasion-dresses",
    isAlias: true,
  },
  {
    handle: "genti-din-piele-naturala",
    canonicalHandle: "posete-din-piele-naturala",
    isAlias: true,
  },
];

const canonicalCollections = collections.filter((collection) => !collection.isAlias);

const resolveCollection = (collection) => {
  if (!collection?.isAlias) return collection;
  return collections.find((item) => item.handle === collection.canonicalHandle);
};

const productMatchesCollection = (product, collection) => {
  const resolvedCollection = resolveCollection(collection);
  return Boolean(resolvedCollection?.match?.(product));
};

products.forEach((product) => {
  product.collections = canonicalCollections
    .filter((collection) => productMatchesCollection(product, collection))
    .map((collection) => collection.handle);
});

export const productTags = [
  { value: "All", label: "Toate" },
  ...[...new Set(products.map((product) => product.tag))]
    .sort()
    .map((tag) => ({
      value: tag,
      label:
        {
          Bags: "Genti",
          Belts: "Curele",
          Clothing: "Imbracaminte",
          "Co-Ords": "Coordonate",
          Dresses: "Rochii",
          Jumpsuits: "Salopete",
          Skirts: "Fuste",
          Tops: "Tops",
          Trousers: "Pantaloni",
        }[tag] || tag,
    })),
];

export const productColors = [...new Map(
  products.map((product) => [product.color, { name: product.color, hex: product.colorHex }])
).values()].sort((a, b) => a.name.localeCompare(b.name));

export const getProductBySlug = (slug) =>
  products.find((product) => product.slug === decodeURIComponent(slug));

export const getCollectionByHandle = (handle) => {
  const collection = collections.find((item) => item.handle === handle);
  const resolvedCollection = resolveCollection(collection);

  if (!collection || !resolvedCollection) return undefined;

  return {
    ...resolvedCollection,
    handle: collection.handle,
    canonicalHandle: resolvedCollection.handle,
    isAlias: collection.isAlias,
  };
};

export const getProductsByCollection = (handle) => {
  const collection = collections.find((item) => item.handle === handle);
  if (!collection) return [];

  return products.filter((product) => productMatchesCollection(product, collection));
};
