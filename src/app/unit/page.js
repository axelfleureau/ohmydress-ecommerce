"use client";
import "./unit.css";
import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { products } from "../wardrobe/products";
import Copy from "@/components/Copy/Copy";
import Product from "@/components/Product/Product";
import { useCartStore } from "@/store/cartStore";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Unit() {
  const heroRef = useRef(null);
  const activeMinimapIndex = useRef(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const addToCart = useCartStore((state) => state.addToCart);
  const pathname = usePathname();

  const currentProduct =
    products.find((p) => p.name === "Halter Neck Ruched Red Gown") ||
    products[1];

  useEffect(() => {
    const others = products.filter((p) => p.name !== currentProduct.name);
    const shuffled = [...others].sort(() => 0.5 - Math.random());
    setRelatedProducts(shuffled.slice(0, 4));
  }, [currentProduct.name]);

  useEffect(() => {
    if (pathname === "/unit") {
      window.scrollTo(0, 0);

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo(0, 0);
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    };

    window.addEventListener("scrollToTop", handleScrollToTop);

    return () => {
      window.removeEventListener("scrollToTop", handleScrollToTop);
    };
  }, []);

  useGSAP(() => {
    const snapshots = document.querySelectorAll(".product-snapshot");
    const minimapImages = document.querySelectorAll(
      ".product-snapshot-minimap-img"
    );
    const totalImages = snapshots.length;

    gsap.set(snapshots[0], { y: "0%", scale: 1 });
    gsap.set(minimapImages[0], { scale: 1.25 });
    for (let i = 1; i < totalImages; i++) {
      gsap.set(snapshots[i], { y: "100%", scale: 1 });
      gsap.set(minimapImages[i], { scale: 1 });
    }

    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: `+=${window.innerHeight * 5}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        let currentActiveIndex = 0;

        for (let i = 1; i < totalImages; i++) {
          const imageStart = (i - 1) / (totalImages - 1);
          const imageEnd = i / (totalImages - 1);

          let localProgress = (progress - imageStart) / (imageEnd - imageStart);
          localProgress = Math.max(0, Math.min(1, localProgress));

          const yValue = 100 - localProgress * 100;
          gsap.set(snapshots[i], { y: `${yValue}%` });

          const scaleValue = 1 + localProgress * 0.5;
          gsap.set(snapshots[i - 1], { scale: scaleValue });

          if (localProgress >= 0.5) {
            currentActiveIndex = i;
          }
        }

        if (currentActiveIndex !== activeMinimapIndex.current) {
          gsap.to(minimapImages[currentActiveIndex], {
            scale: 1.25,
            duration: 0.3,
            ease: "power2.out",
          });

          for (let i = 0; i < currentActiveIndex; i++) {
            gsap.to(minimapImages[i], {
              scale: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          }

          for (let i = currentActiveIndex + 1; i < totalImages; i++) {
            gsap.to(minimapImages[i], {
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          }

          activeMinimapIndex.current = currentActiveIndex;
        }
      },
    });

    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, []);

  const heroShots = [
    "https://ohmydress.store/cdn/shop/files/IMG_2715.jpg?v=1765380874&width=1600",
    "https://ohmydress.store/cdn/shop/files/IMG_2711.jpg?v=1765380870&width=1600",
    "https://ohmydress.store/cdn/shop/files/IMG_1531.jpg?v=1764368658&width=1600",
    "https://ohmydress.store/cdn/shop/files/IMG_1623.jpg?v=1764369017&width=1600",
    "https://ohmydress.store/cdn/shop/files/IMG_0590.jpg?v=1775580806&width=1600",
  ];

  return (
    <>
      <section className="product-hero" ref={heroRef}>
        <div className="product-hero-col product-snapshots">
          {heroShots.map((src, i) => (
            <div className="product-snapshot" key={i}>
              <img src={src} alt={`${currentProduct.name} ${i + 1}`} />
            </div>
          ))}
          <div className="product-snapshot-minimap">
            {heroShots.map((src, i) => (
              <div className="product-snapshot-minimap-img" key={i}>
                <img src={src} alt="" />
              </div>
            ))}
          </div>
        </div>
        <div className="product-hero-col product-meta">
          <div className="product-meta-container">
            <div className="product-meta-header">
              <h3>{currentProduct.name}</h3>
              <h3>{currentProduct.price} lei</h3>
            </div>
            <div className="product-meta-header-divider"></div>
            <div className="product-color-container">
              <p className="md">Color</p>
              <div className="product-colors">
                <div className="product-color">
                  <span></span>
                </div>
              </div>
            </div>
            <div className="product-sizes-container">
              <p className="md">Size</p>
              <div className="product-sizes">
                {(currentProduct.sizes || ["S", "M", "L"]).map((s, i) => (
                  <p
                    key={s}
                    className={`md ${i === 0 ? "selected" : ""}`}
                  >
                    [ {s} ]
                  </p>
                ))}
              </div>
            </div>
            <div className="product-meta-buttons">
              <button
                className="primary"
                onClick={() => addToCart(currentProduct)}
              >
                Add To Bag
              </button>
              <button className="secondary">Save Item</button>
            </div>
          </div>
        </div>
      </section>

      <section className="product-details specifications">
        <div className="product-col product-col-copy">
          <div className="product-col-copy-wrapper">
            <Copy>
              <h4>Details</h4>
            </Copy>
            <Copy>
              <p className="bodyCopy lg">
                Crafted from premium fabrics with refined draping, this piece is
                designed to flatter and last. The construction balances
                structure and softness — built to move with you, made to be
                worn on the moments that matter.
              </p>
              <p className="bodyCopy lg">
                Finished with hand-applied details and reinforced seams, every
                garment is checked individually before it leaves our atelier. A
                limited edition piece, never restocked once sold out.
              </p>
            </Copy>
          </div>
        </div>
        <div className="product-col product-col-img">
          <img
            src="https://ohmydress.store/cdn/shop/files/IMG_2711.jpg?v=1765380870&width=1600"
            alt=""
          />
        </div>
      </section>

      <section className="product-details shipping-details">
        <div className="product-col product-col-img">
          <img
            src="https://ohmydress.store/cdn/shop/files/IMG_1531.jpg?v=1764368658&width=1600"
            alt=""
          />
        </div>
        <div className="product-col product-col-copy">
          <div className="product-col-copy-wrapper">
            <Copy>
              <h4>Shipping & Returns</h4>
            </Copy>
            <Copy>
              <p className="bodyCopy lg">
                Orders are processed within 2 business days and shipped via
                tracked courier across Romania and the EU. You'll receive a
                tracking link as soon as your order leaves our warehouse.
              </p>
              <p className="bodyCopy lg">
                We accept returns on unworn items within 14 days of delivery.
                To start a return, contact our team with your order number —
                refunds are issued to the original payment method once the
                item is received and checked.
              </p>
            </Copy>
          </div>
        </div>
      </section>

      <section className="related-products">
        <div className="container">
          <div className="related-products-header">
            <h3>You may also love</h3>
          </div>
          <div className="related-products-container">
            <div className="container">
              {relatedProducts.map((product) => (
                <Product
                  key={product.name}
                  product={product}
                  productIndex={products.indexOf(product) + 1}
                  showAddToCart={true}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
