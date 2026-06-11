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

const mapD1Cart = (row) => ({
  id: row.id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  status: row.status,
  currency: row.currency,
  locale: row.locale,
  path: row.path,
  customer: deserialize(row.customer_json, {}),
  items: deserialize(row.items_json, []),
  totals: deserialize(row.totals_json, {}),
  metadata: deserialize(row.metadata_json, {}),
});

export const upsertCart = async (cart) => {
  const db = await requireD1();
  const now = new Date().toISOString();

  await db
    .prepare(
      `INSERT INTO carts (
        id,
        created_at,
        updated_at,
        status,
        currency,
        locale,
        path,
        customer_json,
        items_json,
        totals_json,
        metadata_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        updated_at = excluded.updated_at,
        status = CASE
          WHEN carts.status = 'converted' THEN carts.status
          ELSE excluded.status
        END,
        currency = excluded.currency,
        locale = excluded.locale,
        path = excluded.path,
        customer_json = excluded.customer_json,
        items_json = excluded.items_json,
        totals_json = excluded.totals_json,
        metadata_json = excluded.metadata_json`
    )
    .bind(
      cart.id,
      cart.createdAt || now,
      now,
      cart.status,
      cart.currency || "RON",
      cart.locale || null,
      cart.path || null,
      serialize(cart.customer || {}),
      serialize(cart.items || []),
      serialize(cart.totals || {}),
      serialize(cart.metadata || {})
    )
    .run();

  return { updatedAt: now };
};

export const updateCartStatus = async (id, status, metadata = {}) => {
  if (!id) return null;

  const db = await requireD1();
  const now = new Date().toISOString();

  await db
    .prepare(
      `UPDATE carts
       SET status = ?,
           updated_at = ?,
           metadata_json = ?
       WHERE id = ?`
    )
    .bind(status, now, serialize(metadata), id)
    .run();

  return { updatedAt: now };
};

export const listCarts = async () => {
  const db = await requireD1();
  const result = await db
    .prepare("SELECT * FROM carts ORDER BY updated_at DESC LIMIT 500")
    .all();

  return (result.results || []).map(mapD1Cart);
};
