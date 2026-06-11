CREATE TABLE IF NOT EXISTS carts (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  status TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'RON',
  locale TEXT,
  path TEXT,
  customer_json TEXT,
  items_json TEXT NOT NULL,
  totals_json TEXT NOT NULL,
  metadata_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_carts_updated_at ON carts (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_carts_status ON carts (status);
