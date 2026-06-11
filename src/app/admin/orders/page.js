import "./orders.css";

import { listOrders } from "@/lib/orderStorage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Orders",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OrdersAdminPage() {
  const orders = await listOrders();
  const isProtected = Boolean(process.env.ADMIN_PASSWORD);

  return (
    <main className="orders-admin">
      <div className="container">
        <section className="orders-admin-header">
          <p>Admin</p>
          <h1>Comenzi</h1>
          {!isProtected && (
            <p className="bodyCopy orders-admin-warning">
              Seteaza ADMIN_PASSWORD in productie pentru a proteja aceasta
              pagina.
            </p>
          )}
        </section>

        <section className="orders-admin-list">
          {orders.length === 0 ? (
            <div className="orders-admin-empty">
              <p className="bodyCopy">Nu exista comenzi inca.</p>
            </div>
          ) : (
            orders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-card-header">
                  <div>
                    <p>{order.orderNumber}</p>
                    <span>{new Date(order.createdAt).toLocaleString("ro-RO")}</span>
                  </div>
                  <span>{order.status}</span>
                </div>
                <div className="order-card-customer">
                  <p>
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <span>{order.customer.email}</span>
                  <span>{order.customer.phone}</span>
                  {order.delivery?.method === "locker" ? (
                    <>
                      <span>Livrare Sameday easybox / PUDO</span>
                      <span>
                        {order.delivery.locker.name} #{order.delivery.locker.lockerId}
                      </span>
                      <span>
                        {order.delivery.locker.address},{" "}
                        {order.delivery.locker.city},{" "}
                        {order.delivery.locker.county}
                      </span>
                    </>
                  ) : (
                    <span>
                      {order.customer.address}, {order.customer.city},{" "}
                      {order.customer.county}
                    </span>
                  )}
                </div>
                <div className="order-card-items">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.sku}-${item.size}`}>
                      <span>
                        {item.quantity} x {item.name} / {item.size}
                      </span>
                      <span>{item.lineTotal.toFixed(2)} lei</span>
                    </div>
                  ))}
                </div>
                <div className="order-card-total">
                  <span>Total</span>
                  <span>{order.totals.grandTotal.toFixed(2)} lei</span>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
