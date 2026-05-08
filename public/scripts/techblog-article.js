/**
 * Încarcă articol HTML din TechBlog (API embed). URL canonic: /blog/:slug
 * Compatibil și cu blog-articol.html?slug=… (redirecționat 301 către /blog/slug prin .htaccess).
 */
(function () {
  var SITE_ORG = {
    '@type': 'Organization',
    name: 'ZEN GSM',
    url: 'https://zengsm.ro/',
    logo: {
      '@type': 'ImageObject',
      url: 'https://zengsm.ro/images/IMG_7712.PNG',
    },
  };

  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function normalizeApiBase(raw) {
    var apiBaseRaw = String(raw || '').trim().replace(/\/+$/, '');
    try {
      var u = new URL(apiBaseRaw.indexOf('//') === -1 ? 'https://' + apiBaseRaw : apiBaseRaw);
      if (u.hostname.toLowerCase() === 'e-gsm.ro') {
        u.hostname = 'www.e-gsm.ro';
        apiBaseRaw = u.origin;
      }
    } catch (e) {}
    return apiBaseRaw;
  }

  function parseSlugFromPath() {
    try {
      var p = decodeURI(String(window.location.pathname || '').replace(/\/+$/, ''));
      var parts = p.split('/').filter(Boolean);
      if (parts.length >= 2 && parts[0].toLowerCase() === 'blog') {
        return parts.slice(1).join('/') || '';
      }
    } catch (e) {}
    return '';
  }

  function getPublicBase() {
    var el = document.getElementById('techblog-article-config');
    var w = typeof window !== 'undefined' ? window.ZENGSM_TECHBLOG_FEED : null;
    var fromData = el && el.getAttribute('data-zengsm-public-base');
    if (w && w.publicSiteUrl) return String(w.publicSiteUrl).replace(/\/+$/, '');
    if (fromData) return String(fromData).replace(/\/+$/, '');
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      return window.location.origin.replace(/\/+$/, '');
    }
    return 'https://zengsm.ro';
  }

  function articleCanonicalPath(slug) {
    return (
      '/blog/' +
      String(slug || '').split('/').map(encodeURIComponent).join('/') +
      '/'
    );
  }

  function getConfig() {
    var el = document.getElementById('techblog-article-config');
    var params = new URLSearchParams(window.location.search || '');
    var slugFromPath = parseSlugFromPath();
    var slugFromQuery = String(params.get('slug') || '').trim();
    var slug = slugFromPath || slugFromQuery;
    var bloggerFromUrl = String(params.get('blogger') || '').trim();
    var w = typeof window !== 'undefined' ? window.ZENGSM_TECHBLOG_FEED : null;
    var apiBase = normalizeApiBase(
      (w && w.apiBase) || (el && el.getAttribute('data-techblog-api-base')) || ''
    );
    var bloggerSlug =
      bloggerFromUrl ||
      (w && w.bloggerSlug) ||
      (el && el.getAttribute('data-techblog-blogger-slug')) ||
      '';
    return {
      apiBase: apiBase,
      bloggerSlug: String(bloggerSlug).trim(),
      articleSlug: slug,
      publicBase: getPublicBase(),
    };
  }

  /** @param {string} html */
  function rewriteArticleHtmlInner(html) {
    var toPath = function (slug) {
      return (
        '/blog/' +
        String(slug)
          .split('/')
          .filter(Boolean)
          .map(encodeURIComponent)
          .join('/') +
        '/'
      );
    };
    return String(html || '')
      .replace(/href=(["'])https?:\/\/(?:www\.)?e-gsm\.ro\/articol\/([^"']*)/gi, function (_m, q, rest) {
        var slug = String(rest).split(/[#?]/)[0].replace(/\/+$/, '');
        return 'href=' + q + toPath(slug) + q;
      })
      .replace(/href=(["'])\/articol\/([^"']*)/gi, function (_m, q, rest) {
        var slug = String(rest).split(/[#?]/)[0].replace(/\/+$/, '');
        return 'href=' + q + toPath(slug) + q;
      })
      .replace(
        /href=(["'])blog-articol\.html\?slug=([^&"'#]+)(?:&blogger=[^"'#]+)?/gi,
        function (_m, q, slugEnc) {
          try {
            var slug = decodeURIComponent(String(slugEnc));
            return 'href=' + q + toPath(slug) + q;
          } catch (e) {
            return 'href=' + q + '/blog/' + slugEnc + '/' + q;
          }
        }
      );
  }

  function upsertMetaProperty(prop, content) {
    if (!content) return;
    var el = document.querySelector('meta[property="' + prop.replace(/"/g, '\\"') + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', prop);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function injectJsonLd(data) {
    var id = 'techblog-article-jsonld';
    var old = document.getElementById(id);
    if (old) old.remove();
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = id;
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  var cfg = getConfig();
  var loading = document.getElementById('techblog-article-loading');
  var errEl = document.getElementById('techblog-article-error');
  var main = document.getElementById('techblog-article-main');
  var coverWrap = document.getElementById('techblog-article-cover-wrap');
  var coverImg = document.getElementById('techblog-article-cover');

  function fail(msg) {
    if (loading) loading.hidden = true;
    if (errEl) {
      errEl.hidden = false;
      errEl.textContent = msg;
    }
  }

  if (!cfg.apiBase || !cfg.articleSlug) {
    fail('Lipsește articolul. Folosește adresa /blog/slug-articol sau blog-articol.html?slug=…');
    return;
  }

  var url =
    cfg.apiBase +
    '/api/embed/article/' +
    encodeURIComponent(cfg.articleSlug) +
    (cfg.bloggerSlug ? '?bloggerSlug=' + encodeURIComponent(cfg.bloggerSlug) : '');

  fetch(url, { credentials: 'omit', headers: { Accept: 'application/json' } })
    .then(function (r) {
      return r.json().then(function (body) {
        return { ok: r.ok, status: r.status, body: body };
      });
    })
    .then(function (res) {
      if (loading) loading.hidden = true;
      var body = res.body || {};
      if (!res.ok || !body.ok || !body.article) {
        var err =
          (body && body.error) ||
          (res.status === 403 ? 'Embed dezactivat sau origine respinsă.' : '') ||
          'Articol indisponibil.';
        fail(err);
        return;
      }

      var a = body.article;
      var html = rewriteArticleHtmlInner(a.contentHtml || '');
      var canonicalUrl = cfg.publicBase + articleCanonicalPath(a.slug);
      var titlePlain = String(a.seoTitle || a.title || 'Articol');

      document.title = titlePlain + ' | Blog ZEN GSM';

      var metaDesc = document.getElementById('techblog-article-meta-desc');
      if (metaDesc && a.metaDescription) metaDesc.setAttribute('content', a.metaDescription);

      var canonical = document.getElementById('techblog-article-canonical');
      if (canonical) canonical.setAttribute('href', canonicalUrl);

      function setIdContent(id, v) {
        var el = document.getElementById(id);
        if (el) el.setAttribute('content', v);
      }
      setIdContent('techblog-og-title', titlePlain);
      setIdContent('techblog-og-desc', a.metaDescription || a.excerpt || '');
      setIdContent('techblog-og-url', canonicalUrl);
      if (a.coverImage) setIdContent('techblog-og-image', a.coverImage);
      setIdContent('techblog-tw-title', titlePlain);
      setIdContent('techblog-tw-desc', a.metaDescription || a.excerpt || '');
      if (a.coverImage) setIdContent('techblog-tw-image', a.coverImage);

      if (a.publishedAt) upsertMetaProperty('article:published_time', a.publishedAt);
      if (a.updatedAt) upsertMetaProperty('article:modified_time', a.updatedAt);

      var metaEl = document.getElementById('techblog-article-meta');
      if (metaEl) {
        var parts = [];
        if (a.author && a.author.name) parts.push('✍️ ' + a.author.name);
        if (a.category && a.category.name) parts.push('📁 ' + a.category.name);
        var ds = formatDate(a.publishedAt);
        if (ds) parts.push('📅 ' + ds);
        metaEl.textContent = parts.join(' · ');
      }

      var titleEl = document.getElementById('techblog-article-title');
      if (titleEl) titleEl.textContent = a.title || '';

      var excerptEl = document.getElementById('techblog-article-excerpt');
      if (excerptEl && a.excerpt) {
        excerptEl.textContent = a.excerpt;
        excerptEl.hidden = false;
      }

      if (a.coverImage && coverImg && coverWrap) {
        coverImg.src = a.coverImage;
        coverImg.alt = a.title || '';
        coverWrap.hidden = false;
      }

      var bodyEl = document.getElementById('techblog-article-body');
      if (bodyEl) bodyEl.innerHTML = html;

      var jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: a.title,
        description: a.metaDescription || a.excerpt || '',
        datePublished: a.publishedAt || undefined,
        dateModified: a.updatedAt || a.publishedAt || undefined,
        publisher: SITE_ORG,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        url: canonicalUrl,
      };
      if (a.author && a.author.name) {
        jsonLd.author = { '@type': 'Person', name: a.author.name };
      }
      if (a.coverImage) jsonLd.image = [a.coverImage];

      injectJsonLd(jsonLd);

      if (main) main.hidden = false;
    })
    .catch(function () {
      fail('Nu s-a putut încărca articolul. Verifică rețeaua sau încearcă mai târziu.');
    });
})();
