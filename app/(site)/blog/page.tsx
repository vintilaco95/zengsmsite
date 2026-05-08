import type { Metadata } from "next";
import Link from "next/link";
import { JsonLdScripts } from "@/components/JsonLdScripts";
import {
  loadTechblogManifest,
  techblogArticleHref,
} from "@/lib/techblog-data";
import { extractJsonLdBlocks } from "@/lib/legacy-html";
import { getSiteUrl } from "@/lib/site-url";
import type { TechblogArticleSummary } from "@/lib/techblog-types";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Blog & Sfaturi | ZEN GSM Timișoara",
  description:
    "Sfaturi utile despre îngrijirea telefonului, cum să protejezi bateria, reparații și multe altele.",
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: "Blog & Sfaturi | ZEN GSM Timișoara",
    url: `${siteUrl}/blog`,
  },
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function BlogCard({ a }: { a: TechblogArticleSummary }) {
  const href = techblogArticleHref(a.slug);
  const dateStr = formatDate(a.publishedAt);

  return (
    <article
      className="blog-card"
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      <div className="blog-image">
        {a.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={a.coverImage}
            alt=""
            loading="lazy"
            width={800}
            height={450}
          />
        ) : (
          <div className="blog-placeholder" aria-hidden="true">
            📱
          </div>
        )}
      </div>
      <div className="blog-content">
        <div className="blog-meta">
          {a.category?.name ? <span>📁 {a.category.name}</span> : null}
          {dateStr ? (
            <span itemProp="datePublished" content={a.publishedAt || ""}>
              📅 {dateStr}
            </span>
          ) : null}
        </div>
        <h3 itemProp="headline">{a.title}</h3>
        {a.excerpt ? (
          <p itemProp="description">{a.excerpt}</p>
        ) : null}
        <Link href={href} className="blog-read-more" itemProp="url">
          Citește articolul →
        </Link>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const jsonLd = extractJsonLdBlocks("blog.html");
  const m = loadTechblogManifest();

  const subtitle =
    m.blogger?.name != null
      ? `Articole de ${m.blogger.name} — actualizate la build din TechBlog.`
      : "Ghiduri utile — actualizate la fiecare deploy din TechBlog.";

  return (
    <>
      <JsonLdScripts blocks={jsonLd} />
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title gradient-text">Blog & Sfaturi</h1>
          <p className="page-subtitle">{subtitle}</p>
          {m.fetchedAt ? (
            <p
              className="techblog-sync-hint"
              style={{ opacity: 0.75, fontSize: "0.9rem" }}
            >
              Sincronizare conținut:{" "}
              {new Date(m.fetchedAt).toLocaleString("ro-RO")}
            </p>
          ) : null}
        </div>
      </section>

      <section className="blog-section">
        <div className="container">
          {m.blogger?.name ? (
            <p className="techblog-feed-attribution">
              Autor articole: {m.blogger.name}.
            </p>
          ) : null}

          {m.articles.length === 0 ? (
            <div className="blog-grid blog-feed-hint-wrap">
              <p className="blog-feed-hint">
                Nu există articole în cache-ul de build. Pe Render, setează{" "}
                <code>TECHBLOG_API_BASE</code> și{" "}
                <code>TECHBLOG_BLOGGER_SLUG</code> — scriptul{" "}
                <code>fetch-techblog.mjs</code> rulează înainte de{" "}
                <code>next build</code> și generează paginile statice.
              </p>
            </div>
          ) : (
            <div className="blog-grid">
              {m.articles.map((a) => (
                <BlogCard key={a.slug} a={a} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="tips-section">
        <div className="container">
          <h2 className="section-title">Sfaturi Rapide</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">💡</div>
              <h3>Backup regulat</h3>
              <p>
                Fă backup săptămânal. Nu știi niciodată când vei avea nevoie de
                el!
              </p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🌡️</div>
              <h3>Evită temperaturile extreme</h3>
              <p>
                Nu lăsa telefonul la soare sau în mașină vara. Bateria suferă!
              </p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🔌</div>
              <h3>Încărcare corectă</h3>
              <p>
                Ideal: 20-80%. Nu lăsa telefonul la încărcat peste noapte des.
              </p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🧹</div>
              <h3>Curățare</h3>
              <p>Curăță mufa și porturile lunar cu o perie moale.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
