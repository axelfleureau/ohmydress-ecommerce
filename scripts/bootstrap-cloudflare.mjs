import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const WRANGLER_CONFIG = "wrangler.jsonc";
const LOCAL_DEV_VARS = ".dev.vars";

const args = new Set(process.argv.slice(2));
const shouldDeploy = !args.has("--no-deploy");
const requireSameday = args.has("--require-sameday");

const sleep = (ms) => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
};

const run = (command, commandArgs, options = {}) => {
  const attempts = options.attempts || 1;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const result = spawnSync(command, commandArgs, {
      stdio: options.input ? ["pipe", "inherit", "inherit"] : "inherit",
      input: options.input,
      encoding: "utf8",
      env: process.env,
    });

    if (result.status === 0) return;
    if (attempt < attempts) sleep(2000 * attempt);
  }

  throw new Error(`${command} ${commandArgs.join(" ")} failed`);
};

const getEnv = (name, fallback = "") => process.env[name] || fallback;
const parseDotEnv = (path) => {
  if (!existsSync(path)) return {};

  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1)];
      })
  );
};

const existingLocalVars = parseDotEnv(LOCAL_DEV_VARS);

const adminUsername = getEnv("ADMIN_USERNAME", "admin");
const generatedAdminPassword =
  !process.env.ADMIN_PASSWORD && !existingLocalVars.ADMIN_PASSWORD;
const adminPassword =
  process.env.ADMIN_PASSWORD ||
  existingLocalVars.ADMIN_PASSWORD ||
  randomBytes(24).toString("base64url");

const samedayClientId = getEnv("NEXT_PUBLIC_SAMEDAY_CLIENT_ID");
const samedayApiUsername = getEnv("NEXT_PUBLIC_SAMEDAY_API_USERNAME");
const samedayCountryCode = getEnv("NEXT_PUBLIC_SAMEDAY_COUNTRY_CODE", "RO");
const samedayLangCode = getEnv("NEXT_PUBLIC_SAMEDAY_LANG_CODE", "ro");
const siteUrl = getEnv("NEXT_PUBLIC_SITE_URL", "https://ohmydress.ro");

if (requireSameday && (!samedayClientId || !samedayApiUsername)) {
  throw new Error(
    "Missing NEXT_PUBLIC_SAMEDAY_CLIENT_ID or NEXT_PUBLIC_SAMEDAY_API_USERNAME"
  );
}

if (!existsSync(WRANGLER_CONFIG)) {
  throw new Error(`${WRANGLER_CONFIG} not found`);
}

const wranglerConfig = JSON.parse(readFileSync(WRANGLER_CONFIG, "utf8"));
wranglerConfig.workers_dev = true;
wranglerConfig.preview_urls = true;
wranglerConfig.vars = {
  ...wranglerConfig.vars,
  ENVIRONMENT: "production",
  ADMIN_USERNAME: adminUsername,
  NEXT_PUBLIC_SITE_URL: siteUrl,
  NEXT_PUBLIC_SAMEDAY_COUNTRY_CODE: samedayCountryCode,
  NEXT_PUBLIC_SAMEDAY_LANG_CODE: samedayLangCode,
};

if (samedayClientId && samedayApiUsername) {
  wranglerConfig.vars.NEXT_PUBLIC_SAMEDAY_CLIENT_ID = samedayClientId;
  wranglerConfig.vars.NEXT_PUBLIC_SAMEDAY_API_USERNAME = samedayApiUsername;
} else {
  delete wranglerConfig.vars.NEXT_PUBLIC_SAMEDAY_CLIENT_ID;
  delete wranglerConfig.vars.NEXT_PUBLIC_SAMEDAY_API_USERNAME;
}

writeFileSync(
  WRANGLER_CONFIG,
  `${JSON.stringify(wranglerConfig, null, 2)}\n`
);

const localVars = {
  NEXTJS_ENV: "development",
  ADMIN_USERNAME: adminUsername,
  ADMIN_PASSWORD: adminPassword,
  NEXT_PUBLIC_SITE_URL: siteUrl,
  NEXT_PUBLIC_SAMEDAY_COUNTRY_CODE: samedayCountryCode,
  NEXT_PUBLIC_SAMEDAY_LANG_CODE: samedayLangCode,
};

if (samedayClientId && samedayApiUsername) {
  localVars.NEXT_PUBLIC_SAMEDAY_CLIENT_ID = samedayClientId;
  localVars.NEXT_PUBLIC_SAMEDAY_API_USERNAME = samedayApiUsername;
}

writeFileSync(
  LOCAL_DEV_VARS,
  `${Object.entries(localVars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")}\n`
);

run("npx", ["wrangler", "whoami"], { attempts: 3 });
run("npx", ["wrangler", "secret", "put", "ADMIN_PASSWORD"], {
  input: `${adminPassword}\n`,
  attempts: 3,
});
run("npm", ["run", "cf-typegen"]);
run("npm", ["run", "db:migrate:remote"], { attempts: 3 });
run("npm", ["run", "seed:site-content"], { attempts: 3 });
run("npm", ["run", "import:products"], { attempts: 3 });

if (shouldDeploy) {
  run("npm", ["run", "deploy"], { attempts: 2 });
}

console.log("\nCloudflare bootstrap complete.");
console.log(`Admin username: ${adminUsername}`);

if (generatedAdminPassword) {
  console.log(`Generated admin password: ${adminPassword}`);
}

if (!samedayClientId || !samedayApiUsername) {
  console.log(
    "Sameday locker selector remains disabled until NEXT_PUBLIC_SAMEDAY_CLIENT_ID and NEXT_PUBLIC_SAMEDAY_API_USERNAME are provided."
  );
}
