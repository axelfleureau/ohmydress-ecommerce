export const defaultCommerceSettings = {
  announcementBars: [
    {
      id: "free-shipping-bar",
      enabled: true,
      placement: "all",
      text: "Livrare gratuita pentru comenzi peste 350 lei",
      href: "/checkout",
    },
  ],
  banners: [
    {
      id: "checkout-care",
      enabled: true,
      placement: "checkout",
      eyebrow: "Beneficiu activ",
      title: "Adauga produse pentru livrare gratuita",
      body: "Comenzile peste 350 lei primesc livrare gratuita in Romania.",
      ctaLabel: "Continua cumparaturile",
      href: "/wardrobe",
    },
  ],
  productCtas: [
    {
      id: "occasion-accessories",
      enabled: true,
      title: "Completeaza tinuta",
      body: "Adauga o poseta de ocazie sau o curea pentru un look complet.",
      ctaLabel: "Vezi accesorii",
      href: "/collections/accessories",
      match: {
        categories: ["Dresses"],
        tags: ["occasion", "sparkle"],
      },
    },
  ],
  checkout: {
    freeShippingThreshold: 350,
    freeShippingMessage:
      "Mai adauga {amount} lei pentru livrare gratuita in Romania.",
    freeShippingUnlockedMessage: "Livrarea gratuita este activa pentru aceasta comanda.",
    note:
      "Plata este confirmata manual dupa verificarea stocului. API-ul salveaza comanda local pentru self-hosting.",
  },
  customCollections: [
    {
      handle: "cosmetics",
      enabled: true,
      title: "Cosmetice",
      eyebrow: "Categorie noua",
      description:
        "Sectiune pregatita pentru produse cosmetice si beauty drops OhMyDress.",
      match: {
        tags: ["cosmetics", "beauty", "makeup"],
        categories: ["Cosmetics", "Beauty"],
        keywords: ["cosmetic", "beauty", "makeup"],
      },
    },
  ],
};
