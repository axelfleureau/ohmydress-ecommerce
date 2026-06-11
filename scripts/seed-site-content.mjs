import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

import { defaultCommerceSettings } from "../src/content/commerce-settings.default.js";
import {
  shopifyHomePage,
  shopifyPageTemplates,
  shopifyTheme,
} from "../src/content/shopify-theme.generated.js";

const isLocal = process.argv.includes("--local");
const databaseName = process.env.D1_DATABASE_NAME || "ohmydress-ecommerce";
const updatedAt = new Date().toISOString();

const escapeSql = (value) => String(value).replaceAll("'", "''");
const upsertSql = (pageKey, data) => `INSERT INTO site_pages (page_key, data_json, updated_at)
VALUES ('${escapeSql(pageKey)}', '${escapeSql(JSON.stringify(data))}', '${updatedAt}')
ON CONFLICT(page_key) DO UPDATE SET
  data_json = excluded.data_json,
  updated_at = excluded.updated_at;
`;

const insertOnceSql = (pageKey, data) => `INSERT INTO site_pages (page_key, data_json, updated_at)
VALUES ('${escapeSql(pageKey)}', '${escapeSql(JSON.stringify(data))}', '${updatedAt}')
ON CONFLICT(page_key) DO NOTHING;
`;

const homeSql = upsertSql("home", shopifyHomePage);
const themeSql = upsertSql("theme_manifest", shopifyTheme);
const pageSql = Object.entries(shopifyPageTemplates)
  .map(([handle, page]) => insertOnceSql(`page.${handle}`, page))
  .join("\n");
const commerceSql = `INSERT INTO site_pages (page_key, data_json, updated_at)
VALUES ('commerce_settings', '${escapeSql(JSON.stringify(defaultCommerceSettings))}', '${updatedAt}')
ON CONFLICT(page_key) DO NOTHING;
`;
const sql = `${homeSql}\n${themeSql}\n${pageSql}\n${commerceSql}`;

const tempDir = mkdtempSync(join(tmpdir(), "ohmydress-site-content-"));
const tempFile = join(tempDir, "seed-site-content.sql");
writeFileSync(tempFile, sql);

const args = [
  "wrangler",
  "d1",
  "execute",
  databaseName,
  isLocal ? "--local" : "--remote",
  "--file",
  tempFile,
];

const result = spawnSync("npx", args, {
  stdio: "inherit",
  encoding: "utf8",
});

if (result.status !== 0) {
  throw new Error(`npx ${args.join(" ")} failed`);
}

console.log(`Seeded ${isLocal ? "local" : "remote"} site content for home.`);
