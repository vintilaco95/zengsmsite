/**
 * Încarcă și afișează articolul integral (HTML) din TechBlog (API embed).
 * URL: blog-articol.html?slug=...&blogger=andreea (blogger opțional dacă e în data-* pe #techblog-article-config)
 */
(function () {
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

  function getConfig() {
    var el = document.getElementById('techblog-article-config');
    var params = new URLSearchParams(window.location.search || '');
    var slug = String(params.get('slug') || '').trim();
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
    return { apiBase: apiBase, bloggerSlug: String(bloggerSlug).trim(), articleSlug: slug };
  }

  /** @param {string} html */
  function rewriteArticleHtmlInner(html, bloggerSlug) {
    var bq =
      bloggerSlug && bloggerSlug.length
        ? '&blogger=' + encodeURIComponent(bloggerSlug)
        : '';
    return String(html || '')
      .replace(/href=(["'])https?:\/\/(?:www\.)?e-gsm\.ro\/articol\/([^"']*)/gi, function (_m, q, rest) {
        var slug = String(rest).split(/[#?]/)[0].replace(/\/+$/, '');
        return 'href=' + q + 'blog-articol.html?slug=' + encodeURIComponent(slug) + bq + q;
      })
      .replace(/href=(["'])\/articol\/([^"']*)/gi, function (_m, q, rest) {
        var slug = String(rest).split(/[#?]/)[0].replace(/\/+$/, '');
        return 'href=' + q + 'blog-articol.html?slug=' + encodeURIComponent(slug) + bq + q;
      });
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
    fail(
      'Lipsește articolul. Folosește un link de forma blog-articol.html?slug=… (și opțional &blogger=…).'
    );
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
      var html = rewriteArticleHtmlInner(a.contentHtml || '', cfg.bloggerSlug);

      document.title = String(a.seoTitle || a.title || 'Articol') + ' | Blog ZEN GSM';

      var metaDesc = document.getElementById('techblog-article-meta-desc');
      if (metaDesc && a.metaDescription) {
        metaDesc.setAttribute('content', a.metaDescription);
      }

      var canonical = document.getElementById('techblog-article-canonical');
      if (canonical) {
        var c =
          window.location.origin +
          window.location.pathname +
          '?slug=' +
          encodeURIComponent(a.slug) +
          (cfg.bloggerSlug ? '&blogger=' + encodeURIComponent(cfg.bloggerSlug) : '');
        canonical.setAttribute('href', c);
      }

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

      if (main) main.hidden = false;
    })
    .catch(function () {
      fail('Nu s-a putut încărca articolul. Verifică rețeaua sau încearcă mai târziu.');
    });
})();
