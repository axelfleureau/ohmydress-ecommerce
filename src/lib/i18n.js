export const locales = ["ro", "en"];
export const defaultLocale = "ro";

export const isEnglishPath = (pathname = "") =>
  pathname === "/en" || pathname.startsWith("/en/");

export const getPathLocale = (pathname = "") =>
  isEnglishPath(pathname) ? "en" : "ro";

export const stripLocalePrefix = (pathname = "") => {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3) || "/";
  return pathname || "/";
};

export const localizePath = (href = "/", locale = defaultLocale) => {
  if (!href || href.startsWith("http") || href.startsWith("mailto:")) return href;
  const normalized = href.startsWith("/") ? href : `/${href}`;
  const withoutLocale = stripLocalePrefix(normalized);

  if (locale === "en") {
    return withoutLocale === "/" ? "/en" : `/en${withoutLocale}`;
  }

  return withoutLocale;
};

export const t = {
  ro: {
    home: "Acasa",
    shop: "Shop",
    dresses: "Rochii",
    clothing: "Imbracaminte",
    accessories: "Accesorii",
    leatherBags: "Posete din piele",
    brandStory: "Povestea Brandului",
    shopByLength: "Cumpara dupa lungime",
    shopByStyle: "Cumpara dupa stil",
    miniDresses: "Rochii Mini",
    midiDresses: "Rochii Midi",
    longDresses: "Rochii Lungi",
    longSleeveDresses: "Rochii Long Sleeve",
    backlessDresses: "Rochii Backless",
    sparkleDresses: "Rochii Sparkle",
    occasionDresses: "Rochii Occasion",
    coOrds: "Coordonate",
    belts: "Curele",
    cart: "Cos",
    close: "Inchide",
    emptyCart: "Cosul este gol",
    size: "Marime",
    remove: "Sterge",
    checkout: "Checkout",
    total: "Total",
    addToCart: "Adauga in cos",
    soldOut: "Stoc epuizat",
    collection: "Colectie",
    filters: "Filtre",
    all: "Toate",
    productAdded: "Produs adaugat in cos.",
    quantity: "Cantitate",
    currencyNote: "RON Lei",
    deliveryRomania: "Livrare in Romania",
    limitedStock: "Stoc limitat",
    completeLook: "Completeaza look-ul",
    viewCollection: "Vezi colectia",
    checkoutTitle: "Finalizeaza comanda",
    sendOrder: "Trimite comanda",
    keepShopping: "Continua cumparaturile",
    yourCart: "Cosul tau",
    productTotal: "Total produse",
    addressDelivery: "La adresa",
    lockerDelivery: "easybox / PUDO",
    delivery: "Livrare",
    email: "Email",
    phone: "Telefon",
    firstName: "Prenume",
    lastName: "Nume",
    address: "Adresa",
    city: "Oras",
    county: "Judet",
    postalCode: "Cod postal",
    notes: "Note",
    orderLoading: "Se trimite comanda...",
    orderError: "Comanda nu a putut fi trimisa.",
    orderSuccess: (orderNumber) =>
      `Comanda ${orderNumber} a fost inregistrata. Te contactam pentru confirmare si plata.`,
    sectionEmpty:
      "Sectiunea este pregatita. Adauga produse cu tagurile configurate in admin pentru a le afisa aici.",
  },
  en: {
    home: "Home",
    shop: "Shop",
    dresses: "Dresses",
    clothing: "Clothing",
    accessories: "Accessories",
    leatherBags: "Leather bags",
    brandStory: "Brand Story",
    shopByLength: "Shop by length",
    shopByStyle: "Shop by style",
    miniDresses: "Mini Dresses",
    midiDresses: "Midi Dresses",
    longDresses: "Long Dresses",
    longSleeveDresses: "Long Sleeve Dresses",
    backlessDresses: "Backless Dresses",
    sparkleDresses: "Sparkle Dresses",
    occasionDresses: "Occasion Dresses",
    coOrds: "Co-ords",
    belts: "Belts",
    cart: "Cart",
    close: "Close",
    emptyCart: "Your cart is empty",
    size: "Size",
    remove: "Remove",
    checkout: "Checkout",
    total: "Total",
    addToCart: "Add to cart",
    soldOut: "Sold out",
    collection: "Collection",
    filters: "Filters",
    all: "All",
    productAdded: "Product added to cart.",
    quantity: "Quantity",
    currencyNote: "RON Lei",
    deliveryRomania: "Delivery in Romania",
    limitedStock: "Limited stock",
    completeLook: "Complete the look",
    viewCollection: "View collection",
    checkoutTitle: "Complete your order",
    sendOrder: "Place order",
    keepShopping: "Keep shopping",
    yourCart: "Your cart",
    productTotal: "Product total",
    addressDelivery: "To address",
    lockerDelivery: "easybox / PUDO",
    delivery: "Delivery",
    email: "Email",
    phone: "Phone",
    firstName: "First name",
    lastName: "Last name",
    address: "Address",
    city: "City",
    county: "County",
    postalCode: "Postal code",
    notes: "Notes",
    orderLoading: "Sending order...",
    orderError: "The order could not be submitted.",
    orderSuccess: (orderNumber) =>
      `Order ${orderNumber} has been recorded. We will contact you for confirmation and payment.`,
    sectionEmpty:
      "This section is ready. Add products with the configured admin tags to show them here.",
  },
};

export const ui = (locale = defaultLocale) => t[locale] || t.ro;

const collectionText = {
  en: {
    "new-in": {
      title: "New In",
      eyebrow: "Current drop",
      description:
        "The latest OhMyDress dresses, outfits and accessories available now.",
    },
    dresses: {
      title: "Dresses",
      eyebrow: "Collection",
      description:
        "Mini, midi and long dresses for evenings, events and memorable entrances.",
    },
    clothing: {
      title: "Clothing",
      eyebrow: "Collection",
      description: "Tops, sets, jumpsuits, skirts, trousers and coordinated looks.",
    },
    accessories: {
      title: "Accessories",
      eyebrow: "Collection",
      description: "Bags, occasion clutches and belts to complete the look.",
    },
    cosmetics: {
      title: "Cosmetics",
      eyebrow: "New category",
      description:
        "A prepared section for future OhMyDress cosmetics and beauty drops.",
    },
  },
};

export const localizeCollection = (collection, locale = defaultLocale) => {
  if (!collection || locale !== "en") return collection;
  const override = collectionText.en[collection.canonicalHandle || collection.handle];
  return override ? { ...collection, ...override } : collection;
};
