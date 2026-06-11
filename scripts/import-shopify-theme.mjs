import {
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { basename, join } from "node:path";

const themePath =
  process.env.THEME_EXPORT_PATH ||
  process.argv[2] ||
  "/Users/axel/Downloads/theme_export__ohmydress-it-ohmydress__04JUN2026-1259pm";

const outputPath = "src/content/shopify-theme.generated.js";
const homeOutputPath = "src/content/shopify-home.generated.js";

const readJson = (filePath, fallback = null) => {
  if (!existsSync(filePath)) return fallback;
  return JSON.parse(readFileSync(filePath, "utf8"));
};

const getDeepValue = (source, dottedPath) =>
  dottedPath
    .split(".")
    .reduce((value, key) => (value && value[key] != null ? value[key] : null), source);

const resolveLocaleToken = (value, locale) => {
  if (typeof value !== "string" || !value.startsWith("t:")) return value;
  return getDeepValue(locale, value.slice(2)) || value;
};

const parseLiquidSchema = (filePath, locale) => {
  const source = readFileSync(filePath, "utf8");
  const match = source.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);

  if (!match) return null;

  const schema = JSON.parse(match[1]);
  return {
    ...schema,
    name: resolveLocaleToken(schema.name, locale),
    settings: (schema.settings || []).map((setting) => ({
      ...setting,
      label: resolveLocaleToken(setting.label, locale),
      info: resolveLocaleToken(setting.info, locale),
    })),
    blocks: (schema.blocks || []).map((block) => ({
      ...block,
      name: resolveLocaleToken(block.name, locale),
      settings: (block.settings || []).map((setting) => ({
        ...setting,
        label: resolveLocaleToken(setting.label, locale),
        info: resolveLocaleToken(setting.info, locale),
      })),
    })),
  };
};

const getTemplateKey = (fileName) => {
  const base = fileName.replace(/\.json$/, "");
  if (base === "index") return "home";
  if (base.startsWith("page.")) return `page.${base.replace("page.", "")}`;
  return base;
};

const getPageHandle = (templateKey) => {
  if (!templateKey.startsWith("page.")) return null;
  const handle = templateKey.replace("page.", "");
  return handle === "json" || handle === "page" ? "terms-of-service" : handle;
};

const toTitle = (value) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const normalizeTemplate = (templateKey, fileName, template) => {
  const handle = getPageHandle(templateKey);

  return {
    source: `${basename(themePath)}/templates/${fileName}`,
    template: templateKey,
    handle,
    title: handle ? toTitle(handle) : templateKey === "home" ? "OhMyDress" : toTitle(templateKey),
    sections: template.sections || {},
    order: template.order || [],
  };
};

const readLocales = () => {
  const localeDir = join(themePath, "locales");
  const localeFiles = {
    en: "en.default.json",
    ro: "ro.json",
    roRO: "ro-RO.json",
    it: "it.json",
  };

  return Object.fromEntries(
    Object.entries(localeFiles).map(([key, fileName]) => [
      key,
      readJson(join(localeDir, fileName), {}),
    ])
  );
};

if (!existsSync(themePath)) {
  throw new Error(`Shopify theme export not found: ${themePath}`);
}

const locales = readLocales();
const templatesDir = join(themePath, "templates");
const sectionsDir = join(themePath, "sections");

const templates = {};
const pages = {};

for (const fileName of readdirSync(templatesDir).filter((file) => file.endsWith(".json")).sort()) {
  const templateKey = getTemplateKey(fileName);
  const template = normalizeTemplate(
    templateKey,
    fileName,
    readJson(join(templatesDir, fileName), {})
  );

  templates[templateKey] = template;

  if (template.handle) {
    pages[template.handle] = template;
  }
}

const sectionSchemas = {};

for (const fileName of readdirSync(sectionsDir).filter((file) => file.endsWith(".liquid")).sort()) {
  try {
    const type = fileName.replace(/\.liquid$/, "");
    const schema = parseLiquidSchema(join(sectionsDir, fileName), locales.en);

    if (schema) {
      sectionSchemas[type] = schema;
    }
  } catch (error) {
    console.warn(`Could not parse schema for ${fileName}: ${error.message}`);
  }
}

const theme = {
  generatedAt: new Date().toISOString(),
  source: basename(themePath),
  templates,
  pages,
  groups: {
    header: readJson(join(sectionsDir, "header-group.json"), null),
    footer: readJson(join(sectionsDir, "footer-group.json"), null),
  },
  settings: {
    schema: readJson(join(themePath, "config", "settings_schema.json"), []),
    data: readJson(join(themePath, "config", "settings_data.json"), {}),
    markets: readJson(join(themePath, "config", "markets.json"), {}),
  },
  locales,
  sectionSchemas,
  supportedSectionTypes: Object.keys(sectionSchemas).sort(),
};

writeFileSync(
  outputPath,
  `export const shopifyTheme = ${JSON.stringify(theme, null, 2)};\n\n` +
    "export const shopifyHomePage = shopifyTheme.templates.home;\n" +
    "export const shopifyPageTemplates = shopifyTheme.pages;\n" +
    "export const shopifySectionSchemas = shopifyTheme.sectionSchemas;\n"
);

writeFileSync(
  homeOutputPath,
  'export { shopifyHomePage } from "./shopify-theme.generated";\n'
);

console.log(
  `Imported Shopify theme: ${Object.keys(templates).length} templates, ` +
    `${Object.keys(pages).length} pages, ${Object.keys(sectionSchemas).length} section schemas.`
);
