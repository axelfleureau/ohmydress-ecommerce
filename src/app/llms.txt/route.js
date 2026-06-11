export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ohmydress.ro";
  const body = [
    "# OhMyDress",
    "",
    "OhMyDress is a Romanian online fashion store for limited-edition dresses, occasionwear, and Italian leather bags.",
    "",
    "Important pages:",
    `- Home: ${baseUrl}/`,
    `- Collection: ${baseUrl}/wardrobe`,
    `- New In: ${baseUrl}/collections/new-in`,
    `- Dresses: ${baseUrl}/collections/dresses`,
    `- Clothing: ${baseUrl}/collections/clothing`,
    `- Accessories: ${baseUrl}/collections/accessories`,
    `- Leather bags: ${baseUrl}/collections/posete-din-piele-naturala`,
    `- Contact: ${baseUrl}/touchpoint`,
    "",
    "Currency: RON.",
    "Primary locale: ro-RO.",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
