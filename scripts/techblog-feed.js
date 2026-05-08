/**
 * Încarcă articole publicate ale unui blogger de pe TechBlog prin GET /api/embed/blogger/:slug
 *
 * Config (în blog.html):
 * - pe #techblog-feed-root: data-techblog-api-base, data-techblog-blogger-slug
 * - sau window.ZENGSM_TECHBLOG_FEED = { apiBase, bloggerSlug, perPage? }
 */
(function () {
  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function mergeConfig(root) {
    var w = typeof window !== 'undefined' ? window.ZENGSM_TECHBLOG_FEED : null;
    var apiBase = (w && w.apiBase) || root.getAttribute('data-techblog-api-base') || '';
    var bloggerSlug = (w && w.bloggerSlug) || root.getAttribute('data-techblog-blogger-slug') || '';
    var perPage = (w && w.perPage) || parseInt(root.getAttribute('data-techblog-per-page') || '12', 10);
    if (Number.isNaN(perPage) || perPage < 1) perPage = 12;
    if (perPage > 30) perPage = 30;
    var apiBaseRaw = String(apiBase).trim().replace(/\/+$/, '');
    try {
      var u = new URL(apiBaseRaw.indexOf('//') === -1 ? 'https://' + apiBaseRaw : apiBaseRaw);
      if (u.hostname.toLowerCase() === 'e-gsm.ro') {
        u.hostname = 'www.e-gsm.ro';
        apiBaseRaw = u.origin;
      }
    } catch (e) {}
    return {
      apiBase: apiBaseRaw,
      bloggerSlug: String(bloggerSlug).trim(),
      perPage: perPage,
    };
  }

  function articleCard(a) {
    var art = document.createElement('article');
    art.className = 'blog-card';
    art.setAttribute('itemscope', '');
    art.setAttribute('itemtype', 'https://schema.org/BlogPosting');

    var imgWrap = document.createElement('div');
    imgWrap.className = 'blog-image';
    if (a.coverImage) {
      var img = document.createElement('img');
      img.src = a.coverImage;
      img.alt = '';
      img.loading = 'lazy';
      img.width = 800;
      img.height = 450;
      imgWrap.appendChild(img);
    } else {
      var ph = document.createElement('div');
      ph.className = 'blog-placeholder';
      ph.setAttribute('aria-hidden', 'true');
      ph.textContent = '📱';
      imgWrap.appendChild(ph);
    }
    art.appendChild(imgWrap);

    var body = document.createElement('div');
    body.className = 'blog-content';

    var meta = document.createElement('div');
    meta.className = 'blog-meta';
    var dateStr = formatDate(a.publishedAt);
    if (a.category && a.category.name) {
      var spCat = document.createElement('span');
      spCat.textContent = '📁 ' + a.category.name;
      meta.appendChild(spCat);
    }
    if (dateStr) {
      var spDt = document.createElement('span');
      spDt.textContent = '📅 ' + dateStr;
      spDt.setAttribute('itemprop', 'datePublished');
      spDt.setAttribute('content', a.publishedAt || '');
      meta.appendChild(spDt);
    }
    body.appendChild(meta);

    var h = document.createElement('h3');
    h.textContent = a.title;
    h.setAttribute('itemprop', 'headline');
    body.appendChild(h);

    if (a.excerpt) {
      var p = document.createElement('p');
      p.textContent = a.excerpt;
      p.setAttribute('itemprop', 'description');
      body.appendChild(p);
    }

    var link = document.createElement('a');
    link.className = 'blog-read-more';
    var origin =
      typeof location !== 'undefined' && location.origin
        ? location.origin.replace(/\/+$/, '')
        : 'https://zengsm.ro';
    var artPath =
      '/blog/' +
      String(a.slug || '')
        .split('/')
        .filter(Boolean)
        .map(encodeURIComponent)
        .join('/');
    link.href = origin + artPath;
    link.textContent = 'Citește articolul →';
    link.setAttribute('itemprop', 'url');
    body.appendChild(link);

    art.appendChild(body);
    return art;
  }

  function setSubtitle(blogger) {
    var el = document.getElementById('techblog-feed-subtitle');
    if (!el || !blogger || !blogger.name) return;
    el.textContent =
      'Articole de ' + blogger.name + ' — afișate integral pe site-ul ZEN GSM Timișoara.';
  }

  function setAttribution(blogger) {
    var el = document.getElementById('techblog-feed-attribution');
    if (!el || !blogger || !blogger.name) return;
    el.hidden = false;
    el.textContent = 'Autor articole: ' + blogger.name + '.';
  }

  var root = document.getElementById('techblog-feed-root');
  if (!root) return;

  var moreBtn = document.getElementById('techblog-feed-more');
  var cfg = mergeConfig(root);
  var state = { page: 1, pages: 1, loading: false };

  function showHint(html) {
    root.className = 'blog-grid blog-feed-hint-wrap';
    root.innerHTML = '<p class="blog-feed-hint">' + html + '</p>';
    if (moreBtn) moreBtn.hidden = true;
  }

  if (!cfg.apiBase || !cfg.bloggerSlug) {
    showHint(
      'Pentru a afișa articole din TechBlog live, completează în <strong>blog.html</strong> atributele ' +
        '<code>data-techblog-api-base</code> (URL-ul site-ului TechBlog, fără slash final) și ' +
        '<code>data-techblog-blogger-slug</code> (slug-ul bloggerului din admin / URL <code>/blogger/…</code>). ' +
        'Opțional poți seta și <code>window.ZENGSM_TECHBLOG_FEED</code>.'
    );
    return;
  }

  function appendArticles(list) {
    for (var i = 0; i < list.length; i++) {
      root.appendChild(articleCard(list[i]));
    }
  }

  function load(page) {
    if (state.loading) return;
    state.loading = true;
    if (moreBtn) {
      moreBtn.disabled = true;
      moreBtn.textContent = 'Se încarcă…';
    }

    var url =
      cfg.apiBase +
      '/api/embed/blogger/' +
      encodeURIComponent(cfg.bloggerSlug) +
      '?page=' +
      page +
      '&limit=' +
      cfg.perPage;

    fetch(url, { credentials: 'omit', headers: { Accept: 'application/json' } })
      .then(function (r) {
        return r.json().then(function (body) {
          return { ok: r.ok, status: r.status, body: body };
        });
      })
      .then(function (res) {
        state.loading = false;
        if (moreBtn) {
          moreBtn.disabled = false;
          moreBtn.textContent = 'Încarcă mai multe';
        }

        var body = res.body || {};
        if (!res.ok || !body.ok) {
          var err =
            (body && body.error) ||
            (res.status === 403 ? 'origine nepermisă (configurează EMBED_ALLOWED_ORIGINS pe TechBlog)' : '') ||
            'Eroare la încărcarea articolelor';
          if (page === 1) {
            root.className = 'blog-grid blog-feed-hint-wrap';
            root.innerHTML = '<p class="blog-feed-error" role="alert">' + esc(err) + '</p>';
          }
          return;
        }

        if (page === 1) {
          root.className = 'blog-grid';
          root.innerHTML = '';
          setSubtitle(body.blogger);
          setAttribution(body.blogger);
        }

        state.page = body.page || page;
        state.pages = body.pages || 1;
        appendArticles(body.articles || []);

        if (moreBtn) {
          moreBtn.hidden = state.page >= state.pages || state.pages <= 1;
        }
      })
      .catch(function () {
        state.loading = false;
        if (moreBtn) {
          moreBtn.disabled = false;
          moreBtn.textContent = 'Încarcă mai multe';
        }
        if (page === 1) {
          root.className = 'blog-grid blog-feed-hint-wrap';
          root.innerHTML =
            '<p class="blog-feed-error" role="alert">Nu s-a putut contacta serverul TechBlog. Verifică URL-ul API și rețeaua.</p>';
        }
      });
  }

  load(1);

  if (moreBtn) {
    moreBtn.addEventListener('click', function () {
      if (state.page >= state.pages) return;
      load(state.page + 1);
    });
  }
})();
