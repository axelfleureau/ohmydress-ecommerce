import "./DynamicHome.css";
import Link from "next/link";

import ContactForm from "@/components/ContactForm/ContactForm";
import Product from "@/components/Product/Product";
import { getProductsByCollection } from "@/app/wardrobe/products";
import { localizePath } from "@/lib/i18n";

const shopifyFileCdn = "https://ohmydress.ro/cdn/shop/files";

const sanitizeHtml = (html = "") =>
  String(html)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");

const Html = ({ value, className }) => (
  <div
    className={className}
    dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }}
  />
);

const resolveImage = (value) => {
  if (!value) return "";
  if (value.startsWith("shopify://shop_images/")) {
    return `${shopifyFileCdn}/${encodeURIComponent(
      value.replace("shopify://shop_images/", "")
    )}`;
  }

  return value;
};

const resolveLink = (value) => {
  if (!value) return "";
  if (value === "shopify://collections/all") return "/wardrobe";
  if (value.startsWith("shopify://collections/")) {
    return `/collections/${value.replace("shopify://collections/", "")}`;
  }
  if (value.startsWith("shopify://products/")) {
    return `/products/${value.replace("shopify://products/", "")}`;
  }

  return value;
};

const getFirstValue = (...values) => values.find((value) => value != null && value !== "");

const getOrderedBlocks = (section) =>
  (section.block_order || [])
    .map((blockId) => section.blocks?.[blockId])
    .filter(Boolean);

const colorSchemeClass = (section) => {
  const scheme = section.settings?.color_scheme;
  if (scheme === "background-2") return "dynamic-section--burgundy";
  if (scheme === "inverse") return "dynamic-section--inverse";
  return "dynamic-section--light";
};

function ImageBanner({ section, priority = false, locale = "ro" }) {
  const settings = section.settings || {};
  const blocks = getOrderedBlocks(section);
  const image = resolveImage(settings.image);
  const imageTwo = resolveImage(settings.image_2);
  const overlayOpacity = Math.max(
    0,
    Math.min(Number(settings.image_overlay_opacity || 0), 80)
  );

  return (
    <section
      className={`dynamic-image-banner dynamic-image-banner--${settings.image_height || "medium"} ${colorSchemeClass(section)}`}
      style={{ "--overlay-opacity": overlayOpacity / 100 }}
    >
      <div className="dynamic-image-banner__media">
        {image && (
          <img
            src={image}
            alt=""
            fetchPriority={priority ? "high" : undefined}
            loading={priority ? "eager" : "lazy"}
          />
        )}
        {imageTwo && <img src={imageTwo} alt="" loading="lazy" />}
      </div>
      <div className="dynamic-image-banner__overlay" />
      {blocks.length > 0 && (
        <div className="dynamic-image-banner__content">
          {blocks.map((block, index) => {
            if (block.type === "heading") {
              return (
                <Html
                  key={index}
                  className={`dynamic-image-banner__heading dynamic-heading--${block.settings?.heading_size || "h1"}`}
                  value={block.settings?.heading}
                />
              );
            }

            if (block.type === "text") {
              return (
                <Html
                  key={index}
                  className="dynamic-image-banner__text"
                  value={block.settings?.text}
                />
              );
            }

            if (block.type === "buttons") {
              const label = block.settings?.button_label_1;
              const href = localizePath(resolveLink(block.settings?.button_link_1), locale);

              if (!label || !href) return null;

              return (
                <Link key={index} href={href} className="dynamic-button">
                  {label}
                </Link>
              );
            }

            return null;
          })}
        </div>
      )}
    </section>
  );
}

function Marquee({ section }) {
  const blocks = getOrderedBlocks(section);
  const repeatedBlocks = blocks.length < 8 ? [...blocks, ...blocks] : blocks;

  return (
    <section className="dynamic-marquee" style={{ color: section.settings?.text_colour }}>
      <div className="dynamic-marquee__track">
        {[...repeatedBlocks, ...repeatedBlocks].map((block, index) => (
          <Html
            key={index}
            className="dynamic-marquee__item"
            value={block.settings?.text}
          />
        ))}
      </div>
    </section>
  );
}

function RichText({ section, locale = "ro" }) {
  const blocks = getOrderedBlocks(section);

  return (
    <section className={`dynamic-rich-text ${colorSchemeClass(section)}`}>
      <div className="dynamic-rich-text__inner">
        {blocks.map((block, index) => {
          if (block.type === "caption") {
            return (
              <Html
                key={index}
                className="dynamic-rich-text__caption"
                value={block.settings?.caption}
              />
            );
          }

          if (block.type === "heading") {
            return (
              <Html
                key={index}
                className={`dynamic-rich-text__heading dynamic-heading--${block.settings?.heading_size || "h1"}`}
                value={block.settings?.heading}
              />
            );
          }

          if (block.type === "button") {
            const label = block.settings?.button_label;
            const href = localizePath(resolveLink(block.settings?.button_link), locale);

            if (!label || !href) return null;

            return (
              <Link key={index} href={href} className="dynamic-button">
                {label}
              </Link>
            );
          }

          return (
            <Html
              key={index}
              className="dynamic-rich-text__body"
              value={block.settings?.text}
            />
          );
        })}
      </div>
    </section>
  );
}

function ImageWithText({ section, locale = "ro" }) {
  const settings = section.settings || {};
  const blocks = getOrderedBlocks(section);
  const image = resolveImage(settings.image);
  const reverse = settings.layout === "text_first";

  return (
    <section className={`dynamic-image-text ${colorSchemeClass(section)}`}>
      <div className={`dynamic-image-text__inner ${reverse ? "dynamic-image-text__inner--reverse" : ""}`}>
        <div className="dynamic-image-text__media">
          {image && <img src={image} alt="" loading="lazy" decoding="async" />}
        </div>
        <div className="dynamic-image-text__content">
          {blocks.map((block, index) => {
            if (block.type === "caption") {
              return (
                <Html
                  key={index}
                  className="dynamic-section-caption"
                  value={block.settings?.caption}
                />
              );
            }

            if (block.type === "heading") {
              return (
                <Html
                  key={index}
                  className="dynamic-image-text__heading"
                  value={block.settings?.heading}
                />
              );
            }

            if (block.type === "button") {
              const label = block.settings?.button_label;
              const href = localizePath(resolveLink(block.settings?.button_link), locale);

              if (!label || !href) return null;

              return (
                <Link key={index} href={href} className="dynamic-button">
                  {label}
                </Link>
              );
            }

            return (
              <Html
                key={index}
                className="dynamic-image-text__body"
                value={block.settings?.text}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MultiColumn({ section, locale = "ro" }) {
  const settings = section.settings || {};
  const blocks = getOrderedBlocks(section);

  return (
    <section className={`dynamic-multicolumn ${colorSchemeClass(section)}`}>
      <div className="dynamic-multicolumn__inner">
        {settings.title && (
          <Html className="dynamic-multicolumn__title" value={settings.title} />
        )}
        <div
          className="dynamic-multicolumn__grid"
          style={{ "--columns": settings.columns_desktop || 3 }}
        >
          {blocks.map((block, index) => {
            const image = resolveImage(block.settings?.image);
            const label = block.settings?.link_label;
            const href = localizePath(resolveLink(block.settings?.link), locale);

            return (
              <article className="dynamic-multicolumn__item" key={index}>
                {image && <img src={image} alt="" loading="lazy" decoding="async" />}
                <Html
                  className="dynamic-multicolumn__heading"
                  value={block.settings?.title}
                />
                <Html
                  className="dynamic-multicolumn__body"
                  value={block.settings?.text}
                />
                {label && href && (
                  <Link className="dynamic-link" href={href}>
                    {label}
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MultiRow({ section, locale = "ro" }) {
  const blocks = getOrderedBlocks(section);

  return (
    <section className={`dynamic-multirow ${colorSchemeClass(section)}`}>
      <div className="dynamic-multirow__inner">
        {blocks.map((block, index) => {
          const settings = block.settings || {};
          const image = resolveImage(settings.image);
          const label = settings.button_label;
          const href = localizePath(resolveLink(settings.button_link), locale);

          return (
            <article
              className={`dynamic-multirow__item ${index % 2 ? "dynamic-multirow__item--reverse" : ""}`}
              key={index}
            >
              <div className="dynamic-multirow__media">
                {image && <img src={image} alt="" loading="lazy" decoding="async" />}
              </div>
              <div className="dynamic-multirow__content">
                {settings.caption && (
                  <Html className="dynamic-section-caption" value={settings.caption} />
                )}
                <Html className="dynamic-multirow__heading" value={settings.heading} />
                <Html className="dynamic-multirow__body" value={settings.text} />
                {label && href && (
                  <Link className="dynamic-button" href={href}>
                    {label}
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function CollapsibleContent({ section }) {
  const settings = section.settings || {};
  const blocks = getOrderedBlocks(section);

  return (
    <section className={`dynamic-collapsible ${colorSchemeClass(section)}`}>
      <div className="dynamic-collapsible__inner">
        {settings.caption && (
          <Html className="dynamic-section-caption" value={settings.caption} />
        )}
        {settings.heading && (
          <Html className="dynamic-collapsible__heading" value={settings.heading} />
        )}
        <div className="dynamic-collapsible__items">
          {blocks.map((block, index) => (
            <details
              className="dynamic-collapsible__item"
              key={index}
              open={settings.open_first_collapsible_row && index === 0}
            >
              <summary>{block.settings?.heading}</summary>
              <Html
                className="dynamic-collapsible__body"
                value={block.settings?.row_content}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function EmailSignupBanner({ section, priority = false }) {
  const settings = section.settings || {};
  const blocks = getOrderedBlocks(section);
  const image = resolveImage(settings.image);

  return (
    <section
      className={`dynamic-email-banner dynamic-email-banner--${settings.image_height || "medium"} ${colorSchemeClass(section)}`}
    >
      {image && (
        <img
          className="dynamic-email-banner__image"
          src={image}
          alt=""
          fetchPriority={priority ? "high" : undefined}
          loading={priority ? "eager" : "lazy"}
        />
      )}
      <div className="dynamic-email-banner__content">
        {blocks.map((block, index) => {
          if (block.type === "heading") {
            return (
              <Html
                key={index}
                className="dynamic-email-banner__heading"
                value={block.settings?.heading}
              />
            );
          }

          if (block.type === "email_form") {
            return (
              <form key={index} className="dynamic-newsletter__form">
                <input type="email" placeholder="Email" aria-label="Email" />
                <button type="button">Subscribe</button>
              </form>
            );
          }

          return (
            <Html
              key={index}
              className="dynamic-email-banner__body"
              value={getFirstValue(block.settings?.text, block.settings?.paragraph)}
            />
          );
        })}
      </div>
    </section>
  );
}

function FeaturedCollection({ section, locale = "ro" }) {
  const settings = section.settings || {};
  const products = getProductsByCollection(settings.collection).slice(
    0,
    Number(settings.products_to_show || 8)
  );
  const title = settings.title;

  return (
    <section className={`dynamic-featured-collection ${colorSchemeClass(section)}`}>
      <div
        className={
          settings.full_width
            ? "dynamic-featured-collection__inner dynamic-featured-collection__inner--full"
            : "dynamic-featured-collection__inner"
        }
      >
        {title && (
          <Html className="dynamic-featured-collection__title" value={title} />
        )}
        <div
          className="dynamic-featured-collection__grid"
          style={{ "--columns": settings.columns_desktop || 4 }}
        >
          {products.map((product, index) => (
            <Product
              key={product.slug}
              product={product}
              productIndex={index + 1}
              showAddToCart={false}
              className="dynamic-featured-collection__product"
            />
          ))}
        </div>
        {settings.show_view_all && (
          <Link
            href={localizePath(`/collections/${settings.collection}`, locale)}
            className="dynamic-link"
          >
            Vezi colectia
          </Link>
        )}
      </div>
    </section>
  );
}

function Newsletter({ section }) {
  const blocks = getOrderedBlocks(section);

  return (
    <section className={`dynamic-newsletter ${colorSchemeClass(section)}`}>
      <div className="dynamic-newsletter__inner">
        {blocks.map((block, index) => {
          if (block.type === "heading") {
            return (
              <Html
                key={index}
                className="dynamic-newsletter__heading"
                value={block.settings?.heading}
              />
            );
          }

          if (block.type === "paragraph") {
            return (
              <Html
                key={index}
                className="dynamic-newsletter__body"
                value={block.settings?.text}
              />
            );
          }

          if (block.type === "email_form") {
            return (
              <form key={index} className="dynamic-newsletter__form">
                <input type="email" placeholder="Email" aria-label="Email" />
                <button type="button">Subscribe</button>
              </form>
            );
          }

          return null;
        })}
      </div>
    </section>
  );
}

const sectionComponents = {
  "image-banner": ImageBanner,
  "image-with-text": ImageWithText,
  "email-signup-banner": EmailSignupBanner,
  marquee: Marquee,
  "rich-text": RichText,
  "featured-collection": FeaturedCollection,
  multicolumn: MultiColumn,
  multirow: MultiRow,
  "collapsible-content": CollapsibleContent,
  newsletter: Newsletter,
  "contact-form": ContactForm,
};

export default function DynamicHome({ page, locale = "ro" }) {
  return (
    <main className="dynamic-home">
      {(page?.order || []).map((sectionId, index) => {
        const section = page.sections?.[sectionId];
        const Section = sectionComponents[section?.type];

        if (!section || section.disabled) return null;
        if (!Section) return null;

        return (
          <Section
            key={sectionId}
            section={section}
            priority={index === 0}
            locale={locale}
          />
        );
      })}
    </main>
  );
}
