import "./globals.css";
import { Playfair_Display, Cormorant_Garamond, Pinyon_Script } from "next/font/google";

import ClientLayout from "@/client-layout";

import Menu from "@/components/Menu/Menu";
import Footer from "@/components/Footer/Footer";
import ShoppingCart from "@/components/ShoppingCart/ShoppingCart";
import TransitionProvider from "@/providers/TransitionProvider";

const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-playfair",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const pinyon = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pinyon",
});

export const metadata = {
  title: "OhMyDress | Dress it like you own it",
  description:
    "Limited-edition luxury dresses, gowns and Italian leather bags. Each drop is unique, designed to last a lifetime.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${cormorant.variable} ${pinyon.variable}`}
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
