import "./Marketing.css";
import Link from "next/link";

import { localizePath } from "@/lib/i18n";

export function AnnouncementStrip({ item, locale = "ro" }) {
  if (!item?.text) return null;

  const content = <span>{item.text}</span>;

  return (
    <div className="announcement-strip">
      {item.href ? <Link href={localizePath(item.href, locale)}>{content}</Link> : content}
    </div>
  );
}

export function MarketingBanner({ item, locale = "ro" }) {
  if (!item?.title && !item?.body) return null;

  return (
    <section className="marketing-banner">
      <div className="marketing-banner__inner">
        {item.eyebrow && <p className="marketing-banner__eyebrow">{item.eyebrow}</p>}
        {item.title && <h2>{item.title}</h2>}
        {item.body && <p className="bodyCopy marketing-banner__body">{item.body}</p>}
        {item.href && item.ctaLabel && (
          <Link className="marketing-banner__cta" href={localizePath(item.href, locale)}>
            {item.ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}

export function ProductCtaList({ items = [], locale = "ro" }) {
  const enabledItems = items.filter((item) => item?.enabled !== false);

  if (!enabledItems.length) return null;

  return (
    <div className="product-cta-list">
      {enabledItems.map((item) => (
        <div className="product-cta-card" key={item.id || item.title}>
          <p className="product-cta-card__eyebrow">Recomandare</p>
          {item.title && <h3>{item.title}</h3>}
          {item.body && <p className="bodyCopy product-cta-card__body">{item.body}</p>}
          {item.href && item.ctaLabel && (
            <Link className="product-cta-card__cta" href={localizePath(item.href, locale)}>
              {item.ctaLabel}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
