"use client";
import "./touchpoint.css";
import { useRef, useEffect } from "react";

import Copy from "@/components/Copy/Copy";
import BrandIcon from "@/components/BrandIcon/BrandIcon";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Touchpoint() {
  const calloutRef = useRef(null);
  const contactHeroImgRef = useRef(null);

  useGSAP(() => {
    if (!contactHeroImgRef.current) return;

    gsap.set(contactHeroImgRef.current, { y: 1000 });
    gsap.to(contactHeroImgRef.current, {
      y: 100,
      duration: 0.75,
      ease: "power3.out",
      delay: 0.75,
    });
  });

  useEffect(() => {
    const container = calloutRef.current;
    if (!container) return;

    let st = null;

    const timer = setTimeout(() => {
      const image = container.querySelector(".contact-callout-img");

      st = ScrollTrigger.create({
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          const translateY = -progress * 20;
          gsap.set(image, {
            y: `${translateY}rem`,
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
    <>
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-col contact-hero-copy">
            <div className="contact-header">
              <Copy animateOnScroll={false} delay={0.75}>
                <h3>Get in touch — we'd love to hear from you.</h3>
              </Copy>
            </div>
            <div className="contact-meta">
              <div className="contact-meta-block">
                <Copy animateOnScroll={false} delay={0.9}>
                  <p className="bodyCopy">Customer Care</p>
                </Copy>
                <Copy animateOnScroll={false} delay={1}>
                  <h4>hello@ohmydress.ro</h4>
                </Copy>
              </div>
              <div className="contact-meta-block">
                <Copy animateOnScroll={false} delay={1.1}>
                  <p className="bodyCopy">Press & Wholesale</p>
                </Copy>
                <Copy animateOnScroll={false} delay={1.2}>
                  <h4>press@ohmydress.ro</h4>
                </Copy>
              </div>
            </div>
          </div>
          <div className="contact-hero-col contact-hero-img-wrapper">
            <div className="contact-hero-img" ref={contactHeroImgRef}>
              <img src="/lookbook-grid/lb_06.jpg" alt="" />
            </div>
          </div>
        </div>
      </section>

      <section className="contact-callout" ref={calloutRef}>
        <div className="container">
          <div className="contact-callout-header">
            <div className="contact-callout-logo">
              <BrandIcon />
            </div>
            <Copy type="flicker">
              <p>
                Sign up for early access to new releases, private drops and
                seasonal previews. We only reach out when there's something
                worth seeing.
              </p>
            </Copy>
            <Copy>
              <h1>Stay close to the collection</h1>
            </Copy>
            <div className="contact-callout-img">
              <img
                src="/lookbook-grid/lb_07.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
