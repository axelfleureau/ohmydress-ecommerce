import "../content/content.css";

import { getCommerceSettings } from "@/lib/commerceContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Marketing",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MarketingAdminPage({ searchParams }) {
  const params = await searchParams;
  const { settings, source, updatedAt } = await getCommerceSettings();
  const status = params?.status;

  return (
    <main className="content-admin">
      <div className="container">
        <section className="content-admin-header">
          <p>Admin</p>
          <h1>Marketing and promotions</h1>
          <p className="bodyCopy">
            Current source: {source}
            {updatedAt ? ` / ${new Date(updatedAt).toLocaleString("ro-RO")}` : ""}
          </p>
          {status === "saved" && (
            <p className="content-admin-notice">Marketing settings saved.</p>
          )}
          {status === "reset" && (
            <p className="content-admin-notice">Settings reset to the default template.</p>
          )}
          {status === "invalid" && (
            <p className="content-admin-error">
              Invalid JSON. Check announcementBars, banners, productCtas,
              checkout and customCollections.
            </p>
          )}
        </section>

        <section className="content-admin-editor">
          <div className="content-admin-help">
            <p className="bodyCopy">
              Control banners, promotions, product CTAs, the free-shipping
              threshold and new sections here. For a new category like cosmetics,
              add an entry in customCollections and match products by tag,
              category or keyword.
            </p>
          </div>
        </section>

        <form className="content-admin-editor" action="/admin/marketing/save" method="post">
          <label htmlFor="settings-json">Marketing JSON</label>
          <textarea
            id="settings-json"
            name="settingsJson"
            spellCheck="false"
            defaultValue={JSON.stringify(settings, null, 2)}
          />
          <div className="content-admin-actions">
            <button type="submit" name="intent" value="save">
              Save
            </button>
            <button type="submit" name="intent" value="reset">
              Reset template
            </button>
            <a href="/checkout" target="_blank" rel="noreferrer">
              Preview checkout
            </a>
            <a href="/collections/cosmetics" target="_blank" rel="noreferrer">
              Preview section
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
