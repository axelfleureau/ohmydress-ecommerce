import { spawnSync } from "node:child_process";

const args = ["scripts/import-shopify-theme.mjs", ...process.argv.slice(2)];
const result = spawnSync("node", args, { stdio: "inherit" });

if (result.status !== 0) {
  process.exit(result.status || 1);
}
