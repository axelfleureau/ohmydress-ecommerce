"use client";

import "./ProductDetail.css";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ProductCtaList } from "@/components/Marketing/Marketing";
import { getPathLocale, localizePath, ui } from "@/lib/i18n";
import { useCartStore } from "@/store/cartStore";

export default function ProductDetail({
  product,
  relatedProducts = [],
  productCtas = [],
}) {
  const addToCart = useCartStore((state) => state.addToCart);
  const pathname = usePathname();
  const locale = getPathLocale(pathname);
  const copy = ui(locale);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const selectedVariant = product.variants?.find(
    (variant) => variant.size === selectedSize
  );
  const isAvailable = product.available !== false && selectedVariant?.available !== false;

  const handleAdd = () => {
    if (!isAvailable) return;
    addToCart(product, { size: selectedSize, quantity });
    setMessage(copy.productAdded);
  };

  return (
    <>
      <section className="product-detail">
        <div className="container">
          <div className="product-detail-media">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-detail-panel">
            <p className="product-detail-eyebrow">{product.tag}</p>
            <h1>{product.name}</h1>
            <div className="product-detail-price-row">
              <span>{product.price} lei</span>
              {product.compareAtPrice && (
                <span className="product-detail-compare">
                  {product.compareAtPrice} lei
                </span>
              )}
            </div>
            <p className="bodyCopy product-detail-description">
              {product.description}
            </p>

            <div className="product-detail-options">
              <div>
                <p>{copy.size}</p>
                <div className="product-detail-sizes">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={selectedSize === size ? "active" : ""}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p>{copy.quantity}</p>
                <div className="product-detail-quantity">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    -
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
            </div>

            <button
              className="product-detail-add"
              disabled={!isAvailable}
              onClick={handleAdd}
            >
              {isAvailable ? copy.addToCart : copy.soldOut}
            </button>
            {message && <p className="product-detail-message">{message}</p>}

            <div className="product-detail-notes">
              <p>{copy.currencyNote}</p>
              <p>{copy.deliveryRomania}</p>
              <p>{copy.limitedStock}</p>
            </div>

            <ProductCtaList items={productCtas} locale={locale} />
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="product-related">
          <div className="container">
            <div className="product-related-header">
              <p>{copy.completeLook}</p>
              <Link href={localizePath("/wardrobe", locale)}>{copy.viewCollection}</Link>
            </div>
            <div className="product-related-grid">
              {relatedProducts.map((item) => (
                <Link
                  href={localizePath(`/products/${item.slug}`, locale)}
                  className="product-related-card"
                  key={item.slug}
                >
                  <img src={item.image} alt={item.name} />
                  <span>{item.name}</span>
                  <span>{item.price} lei</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
