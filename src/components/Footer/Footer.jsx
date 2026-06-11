"use client";
import "./Footer.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

import ContactForm from "../ContactForm/ContactForm";
import { getPathLocale, localizePath, ui } from "@/lib/i18n";

const Footer = () => {
  const pathname = usePathname();
  const locale = getPathLocale(pathname);
  const copy = ui(locale);
  const href = (path) => localizePath(path, locale);

  return (
    <>
      <ContactForm />

      <footer>
        <div className="container">
          <div className="footer-row">
            <div className="footer-col">
              <div className="footer-col-header">
                <p className="bodyCopy">Shop</p>
              </div>
              <div className="footer-col-links">
                <Link href={href("/")}>{copy.home}</Link>
                <Link href={href("/collections/new-in")}>New In</Link>
                <Link href={href("/collections/dresses")}>{copy.dresses}</Link>
                <Link href={href("/collections/clothing")}>{copy.clothing}</Link>
                <Link href={href("/collections/accessories")}>{copy.accessories}</Link>
                <Link href={href("/collections/posete-din-piele-naturala")}>
                  {copy.leatherBags}
                </Link>
                <Link href={href("/genesis")}>{copy.brandStory}</Link>
                <Link href={href("/pages/about")}>About</Link>
                <Link href={href("/pages/faq-s")}>FAQ</Link>
                <Link href={href("/pages/contact")}>Contact</Link>
                <Link href={href("/pages/privacy-policy")}>Privacy</Link>
                <Link href={href("/pages/terms-conditions")}>Terms</Link>
              </div>
            </div>
            <div className="footer-col">
              <div className="footer-col-header">
                <p className="bodyCopy">Follow</p>
              </div>
              <div className="footer-col-links">
                <a
                  href="https://www.instagram.com/ohmydress.store/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@ohmydress"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TikTok
                </a>
              </div>
            </div>
            <div className="footer-col">
              <div className="footer-col-header">
                <p className="bodyCopy">Contact</p>
              </div>
              <div className="footer-col-links">
                <p>hello@ohmydress.ro</p>
                <p>Bucuresti, Romania</p>
                <p>Made in Italy</p>
              </div>
            </div>
          </div>
          <div className="footer-row">
            <div className="footer-copyright">
              <h5>OhMyDress</h5>
              <p className="bodyCopy">&copy;2026 All rights reserved.</p>
              <p className="bodyCopy" id="copyright-text">
                Dress it like you own it.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
