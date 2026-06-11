import "../orders/orders.css";

import { listCarts } from "@/lib/cartStorage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Carts",
  robots: {
    index: false,
    follow: false,
  },
};

const getCartStatus = (cart) => {
  if (cart.status !== "active") return cart.status;

  const updatedAt = new Date(cart.updatedAt).getTime();
  const minutes = (Date.now() - updatedAt) / 1000 / 60;

  return minutes >= 30 ? "abandoned" : "active";
};

export default async function CartsAdminPage() {
  const carts = await listCarts();
  const isProtected = Boolean(process.env.ADMIN_PASSWORD);

  return (
    <main className="orders-admin">
      <div className="container">
        <section className="orders-admin-header">
          <p>Admin</p>
          <h1>Carts</h1>
          {!isProtected && (
            <p className="bodyCopy orders-admin-warning">
              Set ADMIN_PASSWORD in production to protect this page.
            </p>
          )}
        </section>

        <section className="orders-admin-list">
          {carts.length === 0 ? (
            <div className="orders-admin-empty">
              <p className="bodyCopy">No tracked carts yet.</p>
            </div>
          ) : (
            carts.map((cart) => {
              const status = getCartStatus(cart);
              const customerName = [cart.customer.firstName, cart.customer.lastName]
                .filter(Boolean)
                .join(" ");

              return (
                <article className="order-card" key={cart.id}>
                  <div className="order-card-header">
                    <div>
                      <p>{cart.id}</p>
                      <span>
                        Updated {new Date(cart.updatedAt).toLocaleString("ro-RO")}
                      </span>
                      <span>Created {new Date(cart.createdAt).toLocaleString("ro-RO")}</span>
                    </div>
                    <span>{status}</span>
                  </div>

                  <div className="order-card-customer">
                    <p>{customerName || "Anonymous visitor"}</p>
                    {cart.customer.email && <span>{cart.customer.email}</span>}
                    {cart.customer.phone && <span>{cart.customer.phone}</span>}
                    {cart.locale && <span>Locale: {cart.locale}</span>}
                    {cart.path && <span>Last page: {cart.path}</span>}
                    {cart.metadata?.orderNumber && (
                      <span>Converted to order: {cart.metadata.orderNumber}</span>
                    )}
                  </div>

                  <div className="order-card-items">
                    {cart.items.length === 0 ? (
                      <div>
                        <span>No items</span>
                      </div>
                    ) : (
                      cart.items.map((item) => (
                        <div key={`${cart.id}-${item.sku}-${item.size}`}>
                          <span>
                            {item.quantity} x {item.name} / {item.size}
                          </span>
                          <span>{item.lineTotal.toFixed(2)} lei</span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="order-card-total">
                    <span>Total</span>
                    <span>{Number(cart.totals.subtotal || 0).toFixed(2)} lei</span>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
