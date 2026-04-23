"use client";
import "./home.css";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import { products } from "./wardrobe/products";
import Preloader, { isInitialLoad } from "@/components/Preloader/Preloader";
import DotMatrix from "@/components/DotMatrix/DotMatrix";
import BrandIcon from "@/components/BrandIcon/BrandIcon";
import MarqueeBanner from "@/components/MarqueeBanner/MarqueeBanner";
import TextBlock from "@/components/TextBlock/TextBlock";
import PeelReveal from "@/components/PeelReveal/PeelReveal";
import CTA from "@/components/CTA/CTA";

import Copy from "@/components/Copy/Copy";
import Product from "@/components/Product/Product";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Index() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const heroImgRef = useRef(null);
  const heroHeaderRef = useRef(null);
  const heroSectionRef = useRef(null);

  useEffect(() => {
    const dresses = products.filter((p) => p.tag === "Dresses");
    const shuffled = [...dresses].sort(() => 0.5 - Math.random());
    setFeaturedProducts(shuffled.slice(0, 4));
  }, []);

  useGSAP(() => {
    if (!heroImgRef.current || !heroHeaderRef.current) return;

    gsap.fromTo(
      heroImgRef.current,
      { y: 200, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        delay: isInitialLoad ? 5.75 : 0.4,
      }
    );

    gsap.fromTo(
      heroHeaderRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: "power3.out",
        delay: isInitialLoad ? 5.4 : 0,
      }
    );

    gsap.to(heroHeaderRef.current, {
      y: 150,
      ease: "none",
      scrollTrigger: {
        trigger: heroSectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  return (
    <>
      <Preloader />

      <section className="hero" ref={heroSectionRef}>
        <DotMatrix
          color="#a89884"
          dotSize={2}
          spacing={5}
          opacity={0.6}
          delay={isInitialLoad ? 6 : 1.125}
        />
        <div className="container">
          <div className="hero-header" ref={heroHeaderRef}>
            <div className="hero-title" role="heading" aria-level="1">
              <span className="hero-line-serif">Dress it</span>
              <span className="hero-line-sans">like you</span>
              <span className="hero-line-serif">own it</span>
            </div>
          </div>
        </div>
        <div className="hero-img" ref={heroImgRef}>
          <img
            src="/home/hero.png"
            alt="OhMyDress hero"
          />
        </div>
        <div className="section-footer">
          <p>New Releases</p>
          <p>Winter 2026</p>
        </div>
      </section>

      <section className="about">
        <div className="container">
          <div className="about-copy">
            <Copy type="flicker">
              <p>Limited-edition luxury</p>
            </Copy>
            <Copy>
              <h3>
                Each drop is unique — designed to last a lifetime, made for
                women who choose to stand out.
              </h3>
            </Copy>
            <div className="about-icon">
              <BrandIcon />
            </div>
          </div>
        </div>
        <div className="section-footer light">
          <Copy type="flicker">
            <p>/ Made in Italy /</p>
          </Copy>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <div className="featured-products-header">
            <Copy type="flicker">
              <p>Featured Pieces</p>
            </Copy>
            <Copy>
              <h3>
                Selected <br /> Dresses
              </h3>
            </Copy>
          </div>
          <div className="featured-products-separator">
            <div className="featured-products-divider"></div>
            <div className="featured-products-labels">
              <Copy type="flicker">
                <p>New Releases</p>
              </Copy>
              <Copy type="flicker">
                <Link href="/wardrobe">Shop the Collection</Link>
              </Copy>
            </div>
          </div>
          <div className="featured-products-list">
            {featuredProducts.map((product) => (
              <Product
                key={product.name}
                product={product}
                productIndex={products.indexOf(product) + 1}
                showAddToCart={true}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="silhouette-feature">
        <div className="container">
          <div className="silhouette-copy">
            <Copy type="flicker">
              <p>The Silhouette</p>
            </Copy>
            <Copy>
              <h3>
                Crafted to move <br /> with you
              </h3>
            </Copy>
            <Copy>
              <p>
                Every OhMyDress silhouette is born from Italian ateliers — hand-finished,
                limited-edition, made to be worn and remembered.
              </p>
            </Copy>
            <div className="silhouette-meta">
              <div>
                <Copy type="flicker"><p>Collection</p></Copy>
                <Copy><p>Winter 2026</p></Copy>
              </div>
              <div>
                <Copy type="flicker"><p>Made in</p></Copy>
                <Copy><p>Italy</p></Copy>
              </div>
              <div>
                <Copy type="flicker"><p>Edition</p></Copy>
                <Copy><p>Limited</p></Copy>
              </div>
            </div>
          </div>
          <div className="silhouette-stage">
            <div className="silhouette-img">
              <img src="/home/hero.png" alt="OhMyDress silhouette — burgundy satin gown" />
            </div>
          </div>
        </div>
      </section>

      <MarqueeBanner />

      <TextBlock />

      <PeelReveal />

      <CTA />
    </>
  );
}
