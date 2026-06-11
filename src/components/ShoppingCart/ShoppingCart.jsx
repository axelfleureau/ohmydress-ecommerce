"use client";
import "./ShoppingCart.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { products } from "@/app/wardrobe/products";
import useCartSync from "@/hooks/useCartSync";
import { getPathLocale, localizePath, ui } from "@/lib/i18n";
import {
  getCartItemKey,
  useCartStore,
  useCartCount,
  useCartSubtotal,
} from "@/store/cartStore";

const ShoppingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useCartStore((state) => state.cartItems);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const cartCount = useCartCount();
  const subtotal = useCartSubtotal();
  const pathname = usePathname();
  const locale = getPathLocale(pathname);
  const copy = ui(locale);
  useCartSync();

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="shopping-cart-container">
      <button className="cart-button" onClick={toggleCart}>
        <span className="cart-icon">{copy.cart}</span>
        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
      </button>

      <div
        className={`cart-sidebar ${isOpen ? "open" : ""}`}
        onWheel={(e) => {
          const target = e.currentTarget;
          const cartItems = target.querySelector(".cart-items");
          if (cartItems) {
            const { scrollTop, scrollHeight, clientHeight } = cartItems;
            const isAtTop = scrollTop === 0;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

            if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
              e.stopPropagation();
            }
          }
        }}
      >
        <div className="cart-sidebar-content">
          <div className="cart-header">
            <h2>{copy.cart}</h2>
            <button className="cart-close" onClick={toggleCart}>
              {copy.close}
            </button>
          </div>
          <div
            className="cart-items"
            onWheel={(e) => {
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
            }}
          >
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <p>{copy.emptyCart}</p>
              </div>
            ) : (
              cartItems.map((item, index) => {
                const matchingProduct = products.find(
                  (p) => p.name === item.name
                );
                const productIndex =
                  products.findIndex((p) => p.name === item.name) + 1;
                const imgSrc =
                  item.image ||
                  matchingProduct?.image ||
                  `/products/product_${productIndex}.png`;
                const quantity = Number(item.quantity) || 1;
                const productKey = getCartItemKey(item);
                return (
                  <div key={`${productKey}-${index}`} className="cart-item">
                    <div className="cart-item-image">
                      <img src={imgSrc} alt={item.name} />
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-name-row">
                        <p className="cart-item-name">{item.name}</p>
                        {quantity > 1 && (
                          <span className="cart-item-quantity">{quantity}</span>
                        )}
                      </div>
                      {item.size && (
                        <p className="cart-item-size">{copy.size}: {item.size}</p>
                      )}
                      <p className="cart-item-price">{item.price} lei</p>
                      <button
                        className="cart-item-remove"
                        onClick={() => removeFromCart(productKey)}
                      >
                        {copy.remove}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="cart-footer">
              <div className="cart-summary-row">
                <span>{copy.total}</span>
                <span>{subtotal.toFixed(2)} lei</span>
              </div>
              <Link
                className="cart-checkout"
                href={localizePath("/checkout", locale)}
                onClick={toggleCart}
              >
                {copy.checkout}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
