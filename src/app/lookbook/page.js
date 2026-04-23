import "./lookbook.css";

import Orb from "@/components/Orb/Orb";
import Copy from "@/components/Copy/Copy";

const editorialGrid = [
  { src: "/lookbook-grid/lb_01.jpg", label: "Look 01 / Halter Red" },
  { src: "/lookbook-grid/lb_06.jpg", label: "Look 02 / Ivory Muse" },
  { src: "/lookbook-grid/lb_09.jpg", label: "Look 03 / Signature" },
  { src: "/lookbook-grid/lb_04.jpg", label: "Look 04 / Black Stardust" },
  { src: "/lookbook-grid/lb_03.jpg", label: "Look 05 / Terracotta" },
  { src: "/lookbook-grid/lb_07.jpg", label: "Look 06 / Seraphine" },
  { src: "/lookbook-grid/lb_05.jpg", label: "Look 07 / Blue Stardust" },
  { src: "/lookbook-grid/lb_08.jpg", label: "Look 08 / Velvet Plunge" },
  { src: "/lookbook-grid/lb_10.jpg", label: "Look 09 / Sculpt Suit" },
  { src: "/lookbook-grid/lb_02.jpg", label: "Look 10 / Halter Red — Detail" },
];

export default function Lookbook() {
  return (
    <>
      <section className="lookbook">
        <div className="section-header">
          <Copy animateOnScroll={false} delay={0.5} type="flicker">
            <p>OhMyDress</p>
          </Copy>
          <Copy animateOnScroll={false} delay={0.5} type="flicker">
            <p>Est. 2024</p>
          </Copy>
        </div>
        <div className="section-footer">
          <Copy animateOnScroll={false} delay={0.65} type="flicker">
            <p>[ Lookbook ]</p>
          </Copy>
          <Copy animateOnScroll={false} delay={0.65} type="flicker">
            <p>[ Winter 2026 ]</p>
          </Copy>
        </div>

        <div className="lookbook-hero-fallback">
          <div className="lookbook-hero-strip">
            {[...editorialGrid, ...editorialGrid].map((item, i) => (
              <div key={i} className="lookbook-hero-strip-img">
                <img src={item.src} alt={item.label} />
              </div>
            ))}
          </div>
          <div className="lookbook-hero-title">
            <Copy animateOnScroll={false} delay={0.4}>
              <h1>Winter</h1>
            </Copy>
            <Copy animateOnScroll={false} delay={0.55} type="flicker">
              <p>2026 Collection</p>
            </Copy>
            <Copy animateOnScroll={false} delay={0.65}>
              <h1>2026</h1>
            </Copy>
          </div>
        </div>

        <Orb />
      </section>

      <section className="lookbook-editorial">
        <div className="container">
          <div className="lookbook-editorial-header">
            <Copy type="flicker">
              <p>[ OhMyDress / Editorial — Winter 2026 ]</p>
            </Copy>
            <Copy>
              <h2>Every dress, a story</h2>
            </Copy>
          </div>
          <div className="lookbook-editorial-grid">
            {editorialGrid.map((item, i) => (
              <figure
                key={item.src}
                className={`lookbook-tile lookbook-tile-${(i % 6) + 1}`}
              >
                <img src={item.src} alt={item.label} loading="lazy" />
                <figcaption>{item.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
