import "./Footer.css";
import Link from "next/link";

import ContactForm from "../ContactForm/ContactForm";

const Footer = () => {
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
                <Link href="/">Home</Link>
                <Link href="/wardrobe">Dresses & Bags</Link>
                <Link href="/genesis">Our Story</Link>
                <Link href="/touchpoint">Contact</Link>
                <Link href="/lookbook">Lookbook</Link>
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
                <p>Bucharest, Romania</p>
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
