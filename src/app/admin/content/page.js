import "./content.css";

import { getEditableSitePages, getSitePage } from "@/lib/siteContent";
import { shopifyTheme } from "@/content/shopify-theme.generated";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Content",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ContentAdminPage({ searchParams }) {
  const params = await searchParams;
  const pages = getEditableSitePages();
  const selectedKey = pages.some((page) => page.key === params?.page)
    ? params.page
    : "home";
  const selectedPage = pages.find((page) => page.key === selectedKey) || pages[0];
  const { page, source, updatedAt } = await getSitePage(selectedKey);
  const status = params?.status;

  return (
    <main className="content-admin">
      <div className="container">
        <section className="content-admin-header">
          <p>Admin</p>
          <h1>Continut site</h1>
          <p className="bodyCopy">
            Sursa curenta: {source}
            {updatedAt ? ` / ${new Date(updatedAt).toLocaleString("ro-RO")}` : ""}
          </p>
          {status === "saved" && (
            <p className="content-admin-notice">Homepage salvata in D1.</p>
          )}
          {status === "reset" && (
            <p className="content-admin-notice">
              Pagina resetata la exportul Shopify.
            </p>
          )}
          {status === "invalid" && (
            <p className="content-admin-error">
              JSON invalid sau structura lipseste: verifica `sections` si `order`.
            </p>
          )}
        </section>

        <section className="content-admin-source">
          <div>
            <p>Shopify export</p>
            <h2>{shopifyTheme.source}</h2>
          </div>
          <div>
            <p>Templates</p>
            <strong>{Object.keys(shopifyTheme.templates).length}</strong>
          </div>
          <div>
            <p>Sections</p>
            <strong>{Object.keys(shopifyTheme.sectionSchemas).length}</strong>
          </div>
          <div>
            <p>Locales</p>
            <strong>{Object.keys(shopifyTheme.locales).join(", ")}</strong>
          </div>
        </section>

        <nav className="content-admin-tabs" aria-label="Editable pages">
          {pages.map((item) => (
            <a
              key={item.key}
              href={`/admin/content?page=${encodeURIComponent(item.key)}`}
              className={item.key === selectedKey ? "is-active" : ""}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <form className="content-admin-editor" action="/admin/content/save" method="post">
          <input type="hidden" name="pageKey" value={selectedKey} />
          <label htmlFor="page-json">{selectedPage.label} JSON</label>
          <textarea
            id="page-json"
            name="pageJson"
            spellCheck="false"
            defaultValue={JSON.stringify(page, null, 2)}
          />
          <div className="content-admin-actions">
            <button type="submit" name="intent" value="save">
              Salveaza
            </button>
            <button type="submit" name="intent" value="reset">
              Reset Shopify
            </button>
            <a href="/" target="_blank" rel="noreferrer">
              Home
            </a>
            <a href={selectedPage.previewPath} target="_blank" rel="noreferrer">
              Preview
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
