import "./globals.css";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";

import ClientLayout from "@/client-layout";

import Menu from "@/components/Menu/Menu";
import Footer from "@/components/Footer/Footer";
import ShoppingCart from "@/components/ShoppingCart/ShoppingCart";
import TransitionProvider from "@/providers/TransitionProvider";

const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://ohmydress.ro"
  ),
  title: {
    default: "OhMyDress | Rochii si accesorii in editie limitata",
    template: "%s | OhMyDress",
  },
  description:
    "Rochii, tinute de ocazie si genti din piele italiana in editie limitata. Comanda online in Romania, in lei.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "OhMyDress",
    description:
      "Rochii, tinute de ocazie si genti din piele italiana in editie limitata.",
    url: "/",
    siteName: "OhMyDress",
    locale: "ro_RO",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body
        className={`${playfair.variable} ${cormorant.variable}`}
      >
        <TransitionProvider>
          <ClientLayout footer={<Footer />}>
            <Menu />
            {children}
          </ClientLayout>
          <ShoppingCart />
        </TransitionProvider>
      </body>
    </html>
  );
}
