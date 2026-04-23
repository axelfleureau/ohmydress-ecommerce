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

    let st = null;

    const timer = setTimeout(() => {
      const leftImage = container.querySelector(
        ".cta-col:nth-child(1) .cta-side-img"
      );
      const rightImage = container.querySelector(
        ".cta-col:nth-child(3) .cta-side-img"
      );

      st = ScrollTrigger.create({
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
    }, 500);

    return () => {
      clearTimeout(timer);
      if (st) st.kill();
    };
  }, []);

  return (
    <section className="cta" ref={ctaRef}>
      <div className="container">
        <div className="cta-col">
          <div className="cta-side-img cta-side-silhouette">
            <img
              src="/silhouettes/seraphine.png"
              alt="OhMyDress silhouette"
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
              src="/lookbook-grid/lb_07.jpg"
              alt="OhMyDress collection"
            />
          </div>
        </div>
        <div className="cta-col">
          <div className="cta-side-img cta-side-silhouette">
            <img
              src="/silhouettes/signature.png"
              alt="OhMyDress silhouette"
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
