import { getCloudflareContext } from "@opennextjs/cloudflare";

const serialize = (value) => JSON.stringify(value ?? null);
const deserialize = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getD1 = async () => {
  try {
    return getCloudflareContext().env.DB;
  } catch {
    try {
      const context = await getCloudflareContext({ async: true });
      return context.env.DB;
    } catch {
      return null;
    }
  }
};

const requireD1 = async () => {
  const db = await getD1();

  if (!db) {
    throw new Error("Cloudflare D1 binding DB is not available.");
  }

  return db;
};

const mapD1Order = (row) => ({
  id: row.id,
  orderNumber: row.order_number,
  createdAt: row.created_at,
  status: row.status,
  currency: row.currency,
  customer: deserialize(row.customer_json, {}),
  delivery: deserialize(row.delivery_json, {}),
  items: deserialize(row.items_json, []),
  totals: deserialize(row.totals_json, {}),
  payment: deserialize(row.payment_json, {}),
});

export const saveOrder = async (order) => {
  const db = await requireD1();

  await db
    .prepare(
      `INSERT INTO orders (
        id,
        order_number,
        created_at,
        status,
        currency,
        customer_json,
        delivery_json,
        items_json,
        totals_json,
        payment_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      order.id,
      order.orderNumber,
      order.createdAt,
      order.status,
      order.currency,
      serialize(order.customer),
      serialize(order.delivery),
      serialize(order.items),
      serialize(order.totals),
      serialize(order.payment)
    )
    .run();

  return { storage: "d1" };
};

export const listOrders = async () => {
  const db = await requireD1();

  const result = await db
    .prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 500")
    .all();

  return (result.results || []).map(mapD1Order);
};
