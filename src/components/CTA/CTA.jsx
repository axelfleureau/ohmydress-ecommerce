"use client";
import "./CTA.css";
import { useRef, useEffect } from "react";
import Link from "next/link";

import Copy from "../Copy/Copy";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CTA = () => {
  const ctaRef = useRef(null);

  useEffect(() => {
    const container = ctaRef.current;
    if (!container) return;

    const timer = setTimeout(() => {
      const leftImage = container.querySelector(
        ".cta-col:nth-child(1) .cta-side-img"
      );
      const rightImage = container.querySelector(
        ".cta-col:nth-child(3) .cta-side-img"
      );

      const st = ScrollTrigger.create({
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          const leftTranslateY = 20 - progress * 30;
          gsap.set(leftImage, {
            y: `${leftTranslateY}rem`,
          });

          const rightTranslateY = -progress * 30;
          gsap.set(rightImage, {
            y: `${rightTranslateY}rem`,
          });
        },
      });

      return () => {
        st.kill();
      };
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="cta" ref={ctaRef}>
      <div className="container">
        <div className="cta-col">
          <div className="cta-side-img">
            <img
              src="https://ohmydress.store/cdn/shop/files/IMG_2715.jpg?v=1765380874&width=900"
              alt=""
            />
          </div>
          <div className="cta-col-copy">
            <Copy>
              <p className="bodyCopy sm">
                Each drop is limited and unique — designed for those who choose
                to stand out, not blend in.
              </p>
            </Copy>
          </div>
        </div>
        <div className="cta-col">
          <div className="cta-header">
            <Copy>
              <h3>Discover the new releases</h3>
            </Copy>
          </div>
          <div className="cta-main-img">
            <img
              src="https://ohmydress.store/cdn/shop/files/IMG_2827.jpg?v=1765537119&width=1200"
              alt=""
            />
          </div>
        </div>
        <div className="cta-col">
          <div className="cta-side-img">
            <img
              src="https://ohmydress.store/cdn/shop/files/IMG_1623.jpg?v=1764369017&width=900"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="cta-main-copy">
          <div className="btn">
            <Copy type="flicker">
              <Link href="/wardrobe">Shop the collection</Link>
            </Copy>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
