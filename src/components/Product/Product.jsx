"use client";
import "./Product.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getPathLocale, localizePath, ui } from "@/lib/i18n";
import { useCartStore } from "@/store/cartStore";

const Product = ({
  product,
  productIndex,
  showAddToCart = true,
  className = "",
  innerRef,
  style,
}) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const pathname = usePathname();
  const locale = getPathLocale(pathname);
  const copy = ui(locale);

  const handleImageClick = () => {
    if (pathname?.startsWith("/products/")) {
      window.dispatchEvent(new CustomEvent("scrollToTop"));
    }
  };

  const imgSrc =
    product?.image || `/products/product_${productIndex}.png`;
  const hoverSrc = product?.hoverImage;
  const isAvailable = product?.available !== false;

  return (
    <div className={`product ${className}`} ref={innerRef} style={style}>
      <Link
        href={localizePath(`/products/${product.slug}`, locale)}
        className="product-img"
        onClick={handleImageClick}
      >
        <span className="product-img-frame">
          <img
            className="product-img-primary"
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            decoding="async"
          />
          {hoverSrc && (
            <img
              className="product-img-hover"
              src={hoverSrc}
              alt=""
              loading="lazy"
              aria-hidden="true"
            />
          )}
        </span>
      </Link>
      <div className="product-info">
        <div className="product-info-wrapper">
          <p>{product.name}</p>
          <p>{product.price} lei</p>
        </div>
        {showAddToCart && (
          <button
            className="add-to-cart-btn"
            disabled={!isAvailable}
            onClick={() => isAvailable && addToCart(product)}
          >
            {isAvailable ? copy.addToCart : copy.soldOut}
          </button>
        )}
      </div>
    </div>
  );
};

export default Product;
