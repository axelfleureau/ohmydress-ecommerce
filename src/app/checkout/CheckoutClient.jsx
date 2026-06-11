"use client";

import "./checkout.css";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { AnnouncementStrip, MarketingBanner } from "@/components/Marketing/Marketing";
import useCartSync from "@/hooks/useCartSync";
import { localizePath, ui } from "@/lib/i18n";
import SamedayLockerSelector from "@/components/SamedayLockerSelector/SamedayLockerSelector";
import { useCartStore, useCartSubtotal } from "@/store/cartStore";

const initialCustomer = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  county: "",
  postalCode: "",
  notes: "",
};

export default function CheckoutClient({
  locale = "ro",
  checkoutSettings,
  announcements = [],
  banners = [],
}) {
  const copy = ui(locale);
  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartSubtotal();
  const [mounted, setMounted] = useState(false);
  const [customer, setCustomer] = useState(initialCustomer);
  const [deliveryType, setDeliveryType] = useState("address");
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const freeShippingThreshold = Number(checkoutSettings?.freeShippingThreshold || 0);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  useCartSync({
    email: customer.email,
    phone: customer.phone,
    firstName: customer.firstName,
    lastName: customer.lastName,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const payloadItems = useMemo(
    () =>
      cartItems.map((item) => ({
        slug: item.slug,
        name: item.name,
        size: item.size,
        quantity: item.quantity || 1,
      })),
    [cartItems]
  );

  const updateCustomer = (event) => {
    const { name, value } = event.target;
    setCustomer((current) => ({ ...current, [name]: value }));
  };

  const updateDeliveryType = (type) => {
    setDeliveryType(type);
    if (type === "address") setSelectedLocker(null);
  };

  const selectLocker = (locker) => {
    setSelectedLocker(locker);
    setCustomer((current) => ({
      ...current,
      city: locker.city || current.city,
      county: locker.county || current.county,
      postalCode: locker.postalCode || current.postalCode,
    }));
  };

  const submitOrder = async (event) => {
    event.preventDefault();
    setStatus({ state: "loading", message: copy.orderLoading });

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer,
        cartId: useCartStore.getState().cartId,
        items: payloadItems,
        delivery: {
          method: deliveryType,
          locker: deliveryType === "locker" ? selectedLocker : null,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus({
        state: "error",
        message: data.error || copy.orderError,
      });
      return;
    }

    clearCart();
    setCustomer(initialCustomer);
    setStatus({
      state: "success",
      message: copy.orderSuccess(data.orderNumber),
    });
  };

  return (
    <main className="checkout-page">
      {announcements.map((item) => (
        <AnnouncementStrip key={item.id || item.text} item={item} />
      ))}
      <div className="container">
        <section className="checkout-form-panel">
          <p>Checkout</p>
          <h1>{copy.checkoutTitle}</h1>
          {banners.map((item) => (
            <MarketingBanner key={item.id || item.title} item={item} />
          ))}
          <form onSubmit={submitOrder}>
            <div className="checkout-grid">
              <label>
                {copy.email}
                <input
                  name="email"
                  type="email"
                  value={customer.email}
                  onChange={updateCustomer}
                  required
                />
              </label>
              <label>
                {copy.phone}
                <input
                  name="phone"
                  value={customer.phone}
                  onChange={updateCustomer}
                  required
                />
              </label>
              <label>
                {copy.firstName}
                <input
                  name="firstName"
                  value={customer.firstName}
                  onChange={updateCustomer}
                  required
                />
              </label>
              <label>
                {copy.lastName}
                <input
                  name="lastName"
                  value={customer.lastName}
                  onChange={updateCustomer}
                  required
                />
              </label>
              <label className="checkout-wide">
                {copy.address}
                <input
                  name="address"
                  value={customer.address}
                  onChange={updateCustomer}
                  required={deliveryType === "address"}
                />
              </label>
              <label>
                {copy.city}
                <input
                  name="city"
                  value={customer.city}
                  onChange={updateCustomer}
                  required
                />
              </label>
              <label>
                {copy.county}
                <input
                  name="county"
                  value={customer.county}
                  onChange={updateCustomer}
                  required
                />
              </label>
              <label>
                {copy.postalCode}
                <input
                  name="postalCode"
                  value={customer.postalCode}
                  onChange={updateCustomer}
                />
              </label>
              <label className="checkout-wide">
                {copy.notes}
                <textarea
                  name="notes"
                  value={customer.notes}
                  onChange={updateCustomer}
                  rows="4"
                />
              </label>
            </div>

            <section className="checkout-delivery">
              <p>{copy.delivery}</p>
              <div className="checkout-delivery-options">
                <button
                  type="button"
                  className={deliveryType === "address" ? "active" : ""}
                  onClick={() => updateDeliveryType("address")}
                >
                  {copy.addressDelivery}
                </button>
                <button
                  type="button"
                  className={deliveryType === "locker" ? "active" : ""}
                  onClick={() => updateDeliveryType("locker")}
                >
                  {copy.lockerDelivery}
                </button>
              </div>
              {deliveryType === "locker" && (
                <SamedayLockerSelector
                  city={customer.city}
                  county={customer.county}
                  selectedLocker={selectedLocker}
                  onSelect={selectLocker}
                />
              )}
            </section>

            <button
              className="checkout-submit"
              disabled={
                !mounted ||
                cartItems.length === 0 ||
                status.state === "loading" ||
                (deliveryType === "locker" && !selectedLocker)
              }
            >
              {copy.sendOrder}
            </button>
            {status.message && (
              <p className={`checkout-status ${status.state}`}>
                {status.message}
              </p>
            )}
          </form>
        </section>

        <aside className="checkout-summary">
          <p>{copy.yourCart}</p>
          {!mounted || cartItems.length === 0 ? (
            <div className="checkout-empty">
              <p className="bodyCopy">{copy.emptyCart}</p>
              <Link href={localizePath("/wardrobe", locale)}>{copy.keepShopping}</Link>
            </div>
          ) : (
            <>
              <div className="checkout-items">
                {cartItems.map((item) => (
                  <div className="checkout-item" key={`${item.slug}-${item.size}`}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <span>
                        {item.size} / {item.quantity || 1} buc.
                      </span>
                      <span>{Number(item.price).toFixed(2)} lei</span>
                    </div>
                  </div>
                ))}
              </div>
              {freeShippingThreshold > 0 && (
                <div className="checkout-progress">
                  <p className="bodyCopy">
                    {remainingForFreeShipping > 0
                      ? checkoutSettings.freeShippingMessage.replace(
                          "{amount}",
                          remainingForFreeShipping.toFixed(2)
                        )
                      : checkoutSettings.freeShippingUnlockedMessage}
                  </p>
                  <div className="checkout-progress-track">
                    <span
                      style={{
                        width: `${Math.min(
                          100,
                          (subtotal / freeShippingThreshold) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
              <div className="checkout-total">
                <span>{copy.productTotal}</span>
                <span>{subtotal.toFixed(2)} lei</span>
              </div>
              <p className="bodyCopy checkout-note">
                {checkoutSettings?.note}
              </p>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
