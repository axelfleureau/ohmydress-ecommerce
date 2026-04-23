"use client";
import "./Product.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  const handleImageClick = () => {
    if (pathname === "/unit") {
      window.dispatchEvent(new CustomEvent("scrollToTop"));
    }
  };

  const imgSrc =
    product?.image || `/products/product_${productIndex}.png`;
  const hoverSrc = product?.hoverImage;

  return (
    <div className={`product ${className}`} ref={innerRef} style={style}>
      <Link href="/unit" className="product-img" onClick={handleImageClick}>
        <span className="product-img-frame">
          <img className="product-img-primary" src={imgSrc} alt={product.name} />
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
            onClick={() => addToCart(product)}
          >
            Add to Bag
          </button>
        )}
      </div>
    </div>
  );
};

export default Product;
