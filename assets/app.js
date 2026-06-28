/* =========================================================================
   multipage · app.js   (vanilla, no build, no chart lib)

   The PAGE-LEVEL LAYOUT ENGINE. shell.js has already injected the shared
   chrome and published window.LDW. This script:

     1. reads the current page from <body data-page="..."> (via LDW),
     2. picks a renderer from RENDERERS by that page's `layout`,
     3. paints it into <main id="page"> and wires its interactions,
     4. registers an onLang() callback so a language switch repaints the body.

   RENDERERS is the LAYOUT REGISTRY — one entry per supported page layout:
     hub | gallery | article | dashboard | timeline | table |
     bento | kanban | faq | comparison | leaderboard | scrolly | map
   To add a layout, add one renderer (returns the inner HTML for #page) and,
   if it needs interaction, one matching WIRE entry. Nothing else changes.
   ========================================================================= */
(function () {
  "use strict";

  function boot() {
    // Wait until shell.js has injected the chrome (app bar, nav, footer, #dialog)
    // and published LDW. End-of-body scripts run while readyState === "loading",
    // so the shell defers its injection to DOMContentLoaded — we must wait for it.
    if (!window.LDW || !window.LDW.ready) {
      document.addEventListener("ldw:shell-ready", boot, { once: true });
      return;
    }
    var L = window.LDW;

    var t = L.t, esc = L.escapeHtml, r = L.r;
    var pageEl = document.getElementById("page");
    var teardowns = [];   // observers / listeners to disconnect before each repaint

    /* ---------- shared bits ---------- */
    function head(p) {
      var sub = t(p.subtitle)
        ? '<p class="page-head__sub">' + esc(t(p.subtitle)) + "</p>" : "";
      return '<header class="page-head"><h1>' + esc(t(p.title)) + "</h1>" + sub + "</header>";
    }
    /* editorial section head (eyebrow + big title + lead) */
    function edHead(eyebrow, p) {
      return '<header class="ed-head reveal"><p class="ed-eyebrow">' + esc(eyebrow) + "</p>" +
        '<h1 class="ed-head__title">' + esc(t(p.title)) + "</h1>" +
        (t(p.subtitle) ? '<p class="ed-head__lead">' + esc(t(p.subtitle)) + "</p>" : "") + "</header>";
    }

    /* ---------- shared detail dialog (gallery / catalog / spec reuse this) ---------- */
    function tagStr(g) { return (g && typeof g === "object") ? t(g) : g; }
    function itemTagsHtml(item) {
      return (item.tags || []).map(function (g) { return '<span class="tag">' + esc(tagStr(g)) + "</span>"; }).join("");
    }
    /* mounts the puzzle mini-game tabs into the dialog body (puzzles page only) */
    function mountMinigames(body, slug) {
      if (L.currentSlug() !== "puzzles" || !window.MINIGAMES || !window.MINIGAMES[slug]) return;
      var games = window.MINIGAMES[slug]; if (!games || !games.length) return;
      var wrap = document.createElement("div"); wrap.className = "mg";
      var hd = document.createElement("h3"); hd.className = "mg__head";
      hd.textContent = (L.state.lang === "en" ? "Try it" : "試玩看看") +
        (games.length > 1 ? (L.state.lang === "en" ? " · " + games.length + " mini-games" : " · " + games.length + " 個小遊戲") : "");
      wrap.appendChild(hd);
      var tabs = null;
      if (games.length > 1) {
        tabs = document.createElement("div"); tabs.className = "mg-subtabs";
        games.forEach(function (g, gi) { var c = document.createElement("button"); c.type = "button"; c.className = "mg-subtab"; c.dataset.gi = gi; c.textContent = L.t(g.name); tabs.appendChild(c); });
        wrap.appendChild(tabs);
      }
      var host = document.createElement("div"); host.className = "mg-sub"; wrap.appendChild(host);
      body.appendChild(wrap);
      function mount(gi) { host.innerHTML = ""; if (tabs) [].forEach.call(tabs.children, function (c, i) { c.classList.toggle("mg-subtab--active", i === gi); }); try { games[gi].build(host, L); } catch (e) {} }
      if (tabs) [].forEach.call(tabs.children, function (c) { c.addEventListener("click", function () { mount(parseInt(c.dataset.gi, 10)); }); });
      mount(0);
    }
    function openDetailDialog(item) {
      if (!item) return;
      var dlg = L.dialog(), body = document.getElementById("dialogBody");
      var tags = itemTagsHtml(item);
      body.innerHTML = '<h2 id="dialogTitle">' + esc(t(item.title)) + "</h2>" +
        (tags ? '<div class="card__tags">' + tags + "</div>" : "") +
        "<p>" + esc(t(item.overview) || t(item.summary)) + "</p>";
      mountMinigames(body, item.slug);
      if (!dlg.open) dlg.showModal();
      if (location.hash.slice(1) !== item.slug) history.replaceState(null, "", "#" + item.slug);
    }
    /* wire any [data-slug] node on the page to open the detail dialog + deep-link */
    function wireDetailItems(items) {
      function findItem(slug) { for (var i = 0; i < items.length; i++) if (items[i].slug === slug) return items[i]; return null; }
      function openItem(slug) { openDetailDialog(findItem(slug)); }
      [].forEach.call(pageEl.querySelectorAll("[data-slug]"), function (el) {
        var slug = el.dataset.slug;
        el.addEventListener("click", function () { openItem(slug); });
        el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openItem(slug); } });
      });
      var dlg = L.dialog();
      function onClose() { var slug = location.hash.slice(1); if (slug && findItem(slug)) history.replaceState(null, "", location.pathname + location.search); }
      function syncHash() { var slug = location.hash.slice(1); if (slug && findItem(slug)) openItem(slug); }
      dlg.addEventListener("close", onClose);
      var onHash = function () { syncHash(); };
      window.addEventListener("hashchange", onHash);
      teardowns.push(function () { window.removeEventListener("hashchange", onHash); dlg.removeEventListener("close", onClose); });
      syncHash();
    }

    function barChart(series, accent) {
      var W = 520, H = 240, padL = 16, padR = 16, padT = 16, padB = 44;
      var plotW = W - padL - padR, plotH = H - padT - padB;
      var max = Math.max.apply(null, series.map(function (d) { return d.value; }).concat([1]));
      var n = series.length || 1, gap = 14, bw = (plotW - gap * (n - 1)) / n, baseY = padT + plotH;
      var bars = series.map(function (d, i) {
        var x = padL + i * (bw + gap), h = (d.value / max) * plotH, y = baseY - h;
        var label = esc(t(d.label)), val = esc(String(d.value));
        return '<rect class="bar-rect" x="' + r(x) + '" y="' + r(y) + '" width="' + r(bw) +
          '" height="' + r(h) + '" rx="5"' + (accent ? ' style="fill:' + esc(accent) + '"' : "") +
          '><title>' + label + ": " + val + "</title></rect>" +
          '<text class="bar-value" x="' + r(x + bw / 2) + '" y="' + r(y - 6) + '" text-anchor="middle">' + val + "</text>" +
          '<text class="bar-label" x="' + r(x + bw / 2) + '" y="' + r(baseY + 18) + '" text-anchor="middle">' + label + "</text>";
      }).join("");
      return '<svg viewBox="0 0 ' + W + " " + H + '" role="img" preserveAspectRatio="xMidYMid meet" aria-label="bar chart">' +
        '<line class="axis-line" x1="' + padL + '" y1="' + r(baseY) + '" x2="' + r(W - padR) + '" y2="' + r(baseY) + '" />' +
        bars + "</svg>";
    }

    function lineChart(points) {
      var W = 520, H = 240, padL = 28, padR = 16, padT = 16, padB = 32;
      var plotW = W - padL - padR, plotH = H - padT - padB;
      var ys = points.map(function (d) { return d.y; });
      var max = Math.max.apply(null, ys.concat([1])), min = Math.min.apply(null, ys.concat([0]));
      var span = (max - min) || 1, n = points.length || 1;
      var xy = points.map(function (d, i) {
        var x = padL + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
        var y = padT + plotH - ((d.y - min) / span) * plotH;
        return { x: x, y: y, d: d };
      });
      var path = xy.map(function (pt, i) { return (i ? "L" : "M") + r(pt.x) + " " + r(pt.y); }).join(" ");
      var area = path + " L" + r(xy[xy.length - 1].x) + " " + r(padT + plotH) + " L" + r(xy[0].x) + " " + r(padT + plotH) + " Z";
      var dots = xy.map(function (pt) {
        return '<circle class="line-dot" cx="' + r(pt.x) + '" cy="' + r(pt.y) + '" r="3"><title>' +
          esc(String(pt.d.x)) + ": " + esc(String(pt.d.y)) + "</title></circle>";
      }).join("");
      var labels = xy.map(function (pt) {
        return '<text class="bar-label" x="' + r(pt.x) + '" y="' + r(padT + plotH + 20) + '" text-anchor="middle">' + esc(String(pt.d.x)) + "</text>";
      }).join("");
      return '<svg viewBox="0 0 ' + W + " " + H + '" role="img" preserveAspectRatio="xMidYMid meet" aria-label="line chart">' +
        '<path class="line-area" d="' + area + '" />' +
        '<path class="line-path" d="' + path + '" fill="none" />' + dots + labels + "</svg>";
    }

    /* =====================================================================
       LAYOUT REGISTRY
       ===================================================================== */
    var RENDERERS = {

      /* ---- hub: hero stats + a card linking to every other page ---- */
      hub: function (p) {
        var stats = (p.stats || []).map(function (s) {
          return '<div class="hero__stat" data-item>' +
            '<b class="hero__stat-value" data-count="' + esc(String(s.value)) + '">0</b>' +
            '<span class="hero__stat-label">' + esc(t(s.label)) + "</span></div>";
        }).join("");
        var cards = L.pages.filter(function (q) { return q.slug !== "home"; }).map(function (q) {
          return '<a class="card card--nav" data-item href="' + esc(L.pageHref(q)) + '" ' +
              'aria-label="' + esc(t(q.title)) + '">' +
            '<span class="material-symbols-rounded card__icon" aria-hidden="true">' + esc(q.icon || "label") + "</span>" +
            '<h3 class="card__title">' + esc(t(q.title)) + "</h3>" +
            '<p class="card__summary">' + esc(t(q.subtitle)) + "</p></a>";
        }).join("");
        return head(p) +
          (stats ? '<div class="hero__stats">' + stats + "</div>" : "") +
          '<div class="grid">' + cards + "</div>";
      },

      /* ---- gallery: search + chips + card grid + dialog ---- */
      gallery: function (p) {
        var cats = (p.categories || []).map(function (c) {
          return '<button class="chip" type="button" data-cat="' + esc(c.key) + '">' +
            esc(c[L.state.lang] || c.en) + "</button>";
        }).join("");
        var allLabel = L.state.lang === "en" ? "All" : "全部";
        return head(p) +
          '<div class="toolbar">' +
            '<input id="search" class="search" type="search" autocomplete="off" ' +
              'placeholder="' + (L.state.lang === "en" ? "Search…" : "搜尋…") + '" ' +
              'aria-label="' + (L.state.lang === "en" ? "Search" : "搜尋") + '" />' +
            (cats ? '<div class="chips"><button class="chip chip--active" type="button" data-cat="">' + esc(allLabel) + "</button>" + cats + "</div>" : "") +
          "</div>" +
          '<p class="result-count" id="resultCount" aria-live="polite"></p>' +
          '<div class="grid" id="grid"></div>';
      },

      /* ---- article: sticky TOC + prose + reading progress ---- */
      article: function (p) {
        var toc = (p.sections || []).map(function (s) {
          return '<a class="toc-link" href="#' + esc(s.id) + '" data-toc="' + esc(s.id) + '">' + esc(t(s.heading)) + "</a>";
        }).join("");
        var body = (p.sections || []).map(function (s) {
          var blocks = (s.blocks || []).map(function (b) {
            if (b.type === "h3") return "<h3>" + esc(t(b.text)) + "</h3>";
            if (b.type === "quote") return "<blockquote>" + esc(t(b.text)) + "</blockquote>";
            if (b.type === "code") return "<pre><code>" + esc(t(b.text)) + "</code></pre>";
            if (b.type === "ul") {
              var arr = (b.items && (b.items[L.state.lang] || b.items.en || b.items.zh)) || [];
              return "<ul>" + arr.map(function (li) { return "<li>" + esc(li) + "</li>"; }).join("") + "</ul>";
            }
            return "<p>" + esc(t(b.text)) + "</p>";
          }).join("");
          return '<section class="article-section" id="' + esc(s.id) + '" data-item ' +
            'aria-labelledby="' + esc(s.id) + '-h"><h2 id="' + esc(s.id) + '-h">' + esc(t(s.heading)) + "</h2>" + blocks + "</section>";
        }).join("");
        return '<div class="reading-progress" id="readingProgress" aria-hidden="true"></div>' +
          head(p) +
          '<div class="article-layout">' +
            '<nav class="toc" aria-label="Contents"><div class="toc__inner">' + toc + "</div></nav>" +
            '<div class="article-body prose">' + body + "</div>" +
          "</div>";
      },

      /* ---- dashboard: stat cards + bar + line + table ---- */
      dashboard: function (p) {
        var stats = (p.stats || []).map(function (s) {
          var d = s.delta;
          var deltaHtml = (d === 0 || d) ?
            '<span class="stat-delta stat-delta--' + (d >= 0 ? "up" : "down") + '">' +
              (d >= 0 ? "▲ " : "▼ ") + esc(String(Math.abs(d))) + "%</span>" : "";
          return '<div class="stat-card" data-item>' +
            '<span class="stat-label">' + esc(t(s.label)) + "</span>" +
            '<b class="stat-value">' + esc(String(s.value)) +
              (t(s.unit) ? ' <span class="stat-unit">' + esc(t(s.unit)) + "</span>" : "") + "</b>" +
            deltaHtml + "</div>";
        }).join("");
        var bars = p.bars ? '<figure class="panel" data-item><figcaption>' + esc(t(p.bars.title)) + "</figcaption>" +
          '<div class="chart-wrap">' + barChart(p.bars.series || []) + "</div></figure>" : "";
        var line = p.line ? '<figure class="panel" data-item><figcaption>' + esc(t(p.line.title)) + "</figcaption>" +
          '<div class="chart-wrap">' + lineChart(p.line.points || []) + "</div></figure>" : "";
        var table = "";
        if (p.table) {
          var thead = (p.table.columns || []).map(function (c) { return "<th>" + esc(t(c.label)) + "</th>"; }).join("");
          var tbody = (p.table.rows || []).map(function (row) {
            return "<tr data-item>" + (p.table.columns || []).map(function (c) {
              var v = row[c.key];
              return "<td>" + esc(typeof v === "object" ? t(v) : String(v == null ? "" : v)) + "</td>";
            }).join("") + "</tr>";
          }).join("");
          table = '<div class="panel panel--wide" data-item><div class="table-wrap"><table class="data-table">' +
            "<thead><tr>" + thead + "</tr></thead><tbody>" + tbody + "</tbody></table></div></div>";
        }
        return head(p) +
          '<div class="stat-grid">' + stats + "</div>" +
          '<div class="panel-grid">' + bars + line + "</div>" + table;
      },

      /* ---- timeline: dated event cards down a rail ---- */
      timeline: function (p) {
        var items = (p.events || []).map(function (ev) {
          return '<li class="tl-item" data-item><div class="tl-dot" aria-hidden="true"></div>' +
            '<div class="tl-card"><span class="tl-date">' + esc(t(ev.date)) + "</span>" +
            '<h3 class="tl-title">' + esc(t(ev.title)) + "</h3>" +
            '<p class="tl-body">' + esc(t(ev.body)) + "</p></div></li>";
        }).join("");
        return head(p) + '<ol class="timeline">' + items + "</ol>";
      },

      /* ---- table: searchable + sortable ---- */
      table: function (p) {
        return head(p) +
          '<div class="toolbar">' +
            '<input id="search" class="search" type="search" autocomplete="off" ' +
              'placeholder="' + (L.state.lang === "en" ? "Search…" : "搜尋…") + '" ' +
              'aria-label="' + (L.state.lang === "en" ? "Search" : "搜尋") + '" />' +
            '<div class="chips" id="tableChips"></div>' +
          "</div>" +
          '<div class="table-wrap"><table class="data-table" id="dataTable"><thead></thead><tbody></tbody></table></div>';
      },

      /* ---- bento: asymmetric tile grid ---- */
      bento: function (p) {
        var tiles = (p.tiles || []).map(function (tile) {
          return '<article class="tile tile--' + esc(tile.size || "sm") + (tile.accent ? " tile--accent" : "") + '" data-item>' +
            (tile.icon ? '<span class="material-symbols-rounded tile__icon" aria-hidden="true">' + esc(tile.icon) + "</span>" : "") +
            (tile.value ? '<b class="tile__value">' + esc(tile.value) + "</b>" : "") +
            '<h3 class="tile__title">' + esc(t(tile.title)) + "</h3>" +
            (t(tile.body) ? '<p class="tile__body">' + esc(t(tile.body)) + "</p>" : "") + "</article>";
        }).join("");
        return head(p) + '<div class="bento">' + tiles + "</div>";
      },

      /* ---- kanban: cards grouped by status column ---- */
      kanban: function (p) {
        var cols = (p.columns || []).map(function (col) {
          var cards = (p.cards || []).filter(function (c) { return c.column === col.key; }).map(function (c) {
            var tags = (c.tags || []).map(function (g) { return '<span class="tag">' + esc(g) + "</span>"; }).join("");
            return '<article class="kb-card" data-item><h3 class="kb-card__title">' + esc(t(c.title)) + "</h3>" +
              (t(c.body) ? '<p class="kb-card__body">' + esc(t(c.body)) + "</p>" : "") +
              (tags ? '<div class="card__tags">' + tags + "</div>" : "") + "</article>";
          }).join("");
          var count = (p.cards || []).filter(function (c) { return c.column === col.key; }).length;
          return '<div class="kb-col"><div class="kb-col__head">' + esc(t(col.label)) +
            ' <span class="kb-col__count">' + count + "</span></div>" +
            '<div class="kb-col__body">' + cards + "</div></div>";
        }).join("");
        return head(p) + '<div class="kanban">' + cols + "</div>";
      },

      /* ---- faq: searchable accordion ---- */
      faq: function (p) {
        var items = (p.qa || []).map(function (row) {
          return '<details class="acc-item" data-item data-q="' + esc((t(row.q) + " " + t(row.a)).toLowerCase()) + '">' +
            '<summary class="acc-q"><span>' + esc(t(row.q)) + "</span>" +
            '<span class="material-symbols-rounded acc-chevron" aria-hidden="true">expand_more</span></summary>' +
            '<div class="acc-a">' + esc(t(row.a)) + "</div></details>";
        }).join("");
        return head(p) +
          '<div class="toolbar"><input id="search" class="search" type="search" autocomplete="off" ' +
            'placeholder="' + (L.state.lang === "en" ? "Search…" : "搜尋…") + '" ' +
            'aria-label="' + (L.state.lang === "en" ? "Search" : "搜尋") + '" /></div>' +
          '<div class="accordion" id="accordion">' + items + "</div>";
      },

      /* ---- comparison: plans (cols) x features (rows) ---- */
      comparison: function (p) {
        var plans = p.plans || [], feats = p.features || [];
        var thead = '<th scope="col"></th>' + plans.map(function (pl) {
          return '<th scope="col" class="' + (pl.highlight ? "cmp-col--hl" : "") + '">' +
            '<div class="cmp-plan">' + esc(t(pl.name)) + "</div>" +
            '<div class="cmp-price">' + esc(t(pl.price)) + "</div>" +
            (t(pl.note) ? '<div class="cmp-note">' + esc(t(pl.note)) + "</div>" : "") + "</th>";
        }).join("");
        var rows = feats.map(function (f) {
          var cells = plans.map(function (pl) {
            var v = f.values ? f.values[pl.key] : undefined;
            var cell;
            if (v === true) cell = '<span class="cmp-yes material-symbols-rounded" aria-label="yes">check</span>';
            else if (v === false || v == null) cell = '<span class="cmp-no" aria-label="no">—</span>';
            else cell = esc(t(v));
            return '<td class="' + (pl.highlight ? "cmp-col--hl" : "") + '">' + cell + "</td>";
          }).join("");
          return '<tr data-item><th scope="row" class="cmp-feat">' + esc(t(f.label)) + "</th>" + cells + "</tr>";
        }).join("");
        return head(p) + '<div class="table-wrap"><table class="cmp-table">' +
          "<thead><tr>" + thead + "</tr></thead><tbody>" + rows + "</tbody></table></div>";
      },

      /* ---- leaderboard: ranked list + tier grouping toggle ---- */
      leaderboard: function (p) {
        var listLabel = L.state.lang === "en" ? "List" : "排名";
        var tierLabel = L.state.lang === "en" ? "Tiers" : "階級";
        return head(p) +
          '<div class="seg" role="tablist">' +
            '<button class="seg__btn seg__btn--active" type="button" data-view="list">' + esc(listLabel) + "</button>" +
            '<button class="seg__btn" type="button" data-view="tier">' + esc(tierLabel) + "</button>" +
          "</div>" +
          '<div id="lbView"></div>';
      },

      /* ---- scrolly: sticky visual + stepped narrative ---- */
      scrolly: function (p) {
        var steps = (p.steps || []).map(function (s, i) {
          return '<div class="scrolly-step" data-item data-step="' + i + '"><p>' + esc(t(s.text)) + "</p></div>";
        }).join("");
        return head(p) +
          '<div class="scrolly">' +
            '<div class="scrolly-sticky"><div class="scrolly-visual" id="scrollyVisual"></div></div>' +
            '<div class="scrolly-steps">' + steps + "</div>" +
          "</div>";
      },

      /* ---- map: Leaflet map + list (needs Leaflet on the page) ---- */
      map: function (p) {
        var cats = (p.categories || []).map(function (c) {
          return '<button class="chip" type="button" data-cat="' + esc(c.key) + '">' +
            esc(c[L.state.lang] || c.en) + "</button>";
        }).join("");
        var allLabel = L.state.lang === "en" ? "All" : "全部";
        return head(p) +
          '<div class="toolbar">' +
            '<input id="search" class="search" type="search" autocomplete="off" ' +
              'placeholder="' + (L.state.lang === "en" ? "Search studios…" : "搜尋工作室…") + '" ' +
              'aria-label="' + (L.state.lang === "en" ? "Search" : "搜尋") + '" />' +
            (cats ? '<div class="chips"><button class="chip chip--active" type="button" data-cat="">' + esc(allLabel) + "</button>" + cats + "</div>" : "") +
          "</div>" +
          '<p class="result-count" id="resultCount" aria-live="polite"></p>' +
          '<div class="map-layout">' +
            '<div class="map-box" id="map" role="application" aria-label="Map"></div>' +
            '<ul class="map-list" id="mapList"></ul>' +
          "</div>";
      },

      /* ---- glossary: searchable term list (opt-in interactive add-on) ---- */
      glossary: function (p) {
        var items = (p.terms || []).map(function (row) {
          return '<details class="gloss-item" data-item data-q="' +
              esc((t(row.term) + " " + t(row.def)).toLowerCase()) + '">' +
            '<summary class="gloss-term"><span>' + esc(t(row.term)) + "</span>" +
            '<span class="material-symbols-rounded gloss-chevron" aria-hidden="true">expand_more</span></summary>' +
            '<div class="gloss-def">' + esc(t(row.def)) + "</div></details>";
        }).join("");
        return head(p) +
          '<div class="toolbar"><input id="search" class="search" type="search" autocomplete="off" ' +
            'placeholder="' + (L.state.lang === "en" ? "Search terms…" : "搜尋術語…") + '" ' +
            'aria-label="' + (L.state.lang === "en" ? "Search" : "搜尋") + '" /></div>' +
          '<p class="result-count" id="resultCount" aria-live="polite"></p>' +
          '<div class="glossary" id="glossary">' + items + "</div>";
      },

      /* ---- quiz: multiple-choice with instant feedback + score (ephemeral) ---- */
      quiz: function (p) {
        var qs = (p.questions || []).map(function (q, qi) {
          var opts = (q.options || []).map(function (o, oi) {
            return '<button class="quiz-opt" type="button" data-o="' + oi + '">' +
              '<span class="quiz-opt__key">' + String.fromCharCode(65 + oi) + "</span>" +
              "<span>" + esc(t(o)) + "</span></button>";
          }).join("");
          return '<div class="quiz-card" data-item data-qi="' + qi + '">' +
            '<div class="quiz-q"><span class="quiz-num">' + (qi + 1) + "</span>" +
              "<span>" + esc(t(q.q)) + "</span></div>" +
            '<div class="quiz-opts">' + opts + "</div>" +
            '<div class="quiz-explain" hidden></div></div>';
        }).join("");
        return head(p) +
          '<div class="quiz-score" id="quizScore" aria-live="polite"></div>' +
          '<div class="quiz" id="quiz">' + qs + "</div>";
      },

      /* ---- flashcards: tap to flip front/back (ephemeral) ---- */
      flashcards: function (p) {
        var cards = (p.cards || []).map(function (c, i) {
          return '<button class="flash" type="button" data-item data-i="' + i + '" aria-pressed="false">' +
            '<span class="flash__inner">' +
              '<span class="flash__face flash__front">' + esc(t(c.front)) + "</span>" +
              '<span class="flash__face flash__back">' + esc(t(c.back)) + "</span>" +
            "</span></button>";
        }).join("");
        var hint = L.state.lang === "en" ? "Tap any card to flip." : "點任一張卡片翻面。";
        return head(p) +
          '<p class="result-count">' + esc(hint) + "</p>" +
          '<div class="flash-grid">' + cards + "</div>";
      },

      /* ---- home: immersive editorial landing (hero + features + explore + quote) ---- */
      home: function (p) {
        var h = p.hero || {};
        var stats = (h.stats || []).map(function (s) {
          return '<div class="ed-hero__stat"><b data-count="' + esc(String(s.value)) + '"' +
            (s.suffix ? ' data-suffix="' + esc(s.suffix) + '"' : "") + '>0</b><span>' + esc(t(s.label)) + "</span></div>";
        }).join("");
        var cta = (h.cta || []).map(function (c) {
          return '<a class="ed-btn' + (c.primary ? " ed-btn--primary" : "") + '" href="' + esc(c.href) + '">' + esc(t(c.label)) + "</a>";
        }).join("");
        var hero = '<header class="ed-hero">' +
          '<div class="ed-hero__glow" aria-hidden="true"></div><div class="ed-hero__key" aria-hidden="true"></div>' +
          '<div class="ed-hero__inner">' +
            (t(h.eyebrow) ? '<p class="ed-eyebrow">' + esc(t(h.eyebrow)) + "</p>" : "") +
            '<h1 class="ed-hero__title">' + esc(t(h.title || p.title)) + (t(h.accent) ? ' <em>' + esc(t(h.accent)) + "</em>" : "") + "</h1>" +
            (t(h.lead) ? '<p class="ed-hero__lead">' + esc(t(h.lead)) + "</p>" : "") +
            (stats ? '<div class="ed-hero__stats">' + stats + "</div>" : "") +
            (cta ? '<div class="ed-hero__cta">' + cta + "</div>" : "") +
            '<span class="ed-cue">' + (L.state.lang === "en" ? "Scroll to explore" : "向下探索") +
              ' <span class="material-symbols-rounded" aria-hidden="true">arrow_downward</span></span>' +
          "</div></header>";
        var feats = (p.highlights || []).map(function (f) {
          return '<article class="ed-feature reveal" data-item>' +
            '<figure class="ed-feature__media">' + (t(f.badge) ? '<figcaption class="ed-feature__badge">' + esc(t(f.badge)) + "</figcaption>" : "") +
              '<span class="material-symbols-rounded ed-feature__icon" aria-hidden="true">' + esc(f.icon || "extension") + "</span></figure>" +
            '<div class="ed-feature__body">' +
              '<h2 class="ed-feature__title">' + esc(t(f.title)) + "</h2>" +
              '<p class="ed-feature__text">' + esc(t(f.body)) + "</p>" +
              (f.href ? '<a class="ed-link" href="' + esc(f.href) + '">' + (L.state.lang === "en" ? "Explore" : "看更多") +
                ' <span class="material-symbols-rounded" aria-hidden="true">arrow_forward</span></a>' : "") +
            "</div></article>";
        }).join("");
        var featuresSection = feats ? '<section class="ed-section ed-wrap"><div class="ed-features">' + feats + "</div></section>" : "";
        var explore = (p.explore || []).map(function (g) {
          var lead = g.lead ? '<a class="ed-index__lead" href="' + esc(g.lead.href) + '"><b>' + esc(t(g.lead.title)) +
            "</b><span>" + esc(t(g.lead.sub)) + '</span><span class="material-symbols-rounded" aria-hidden="true">arrow_outward</span></a>' : "";
          var links = '<ul class="ed-index__list">' + (g.links || []).map(function (l) {
            return '<li><a href="' + esc(l.href) + '"><span>' + esc(t(l.title)) + '</span> <span class="material-symbols-rounded" aria-hidden="true">chevron_right</span></a></li>';
          }).join("") + "</ul>";
          return '<div class="ed-index__group" data-item>' + (t(g.eyebrow) ? '<p class="ed-eyebrow">' + esc(t(g.eyebrow)) + "</p>" : "") + lead + links + "</div>";
        }).join("");
        var exploreSection = explore ? '<section class="ed-section ed-wrap" id="explore">' +
          '<header class="ed-head reveal"><p class="ed-eyebrow">' + (L.state.lang === "en" ? "Explore" : "探索全站") + "</p>" +
          '<h2 class="ed-head__title">' + (L.state.lang === "en" ? "Browse every corner of the codex" : "逐區瀏覽整座知識庫") + "</h2></header>" +
          '<nav class="ed-index reveal" aria-label="' + (L.state.lang === "en" ? "Explore" : "探索") + '">' + explore + "</nav></section>" : "";
        var quote = p.quote ? '<aside class="ed-band reveal"><div class="ed-band__inner ed-quote"><p>' +
          esc(t(p.quote.text)) + "</p><cite>" + esc(t(p.quote.cite)) + "</cite></div></aside>" : "";
        return hero + featuresSection + '<hr class="ed-rule">' + exploreSection + quote;
      },

      /* ---- editorial: alternating zig-zag feature blocks (themes) ---- */
      editorial: function (p) {
        var items = (p.items || []).map(function (it, i) {
          var tags = (it.tags || []).map(function (g) { return '<span class="tag">' + esc(tagStr(g)) + "</span>"; }).join("");
          return '<article class="ed-feature reveal" data-item>' +
            '<figure class="ed-feature__media"><figcaption class="ed-feature__badge">' + (i < 9 ? "0" : "") + (i + 1) + "</figcaption>" +
              '<span class="material-symbols-rounded ed-feature__icon" aria-hidden="true">' + esc(it.icon || "theater_comedy") + "</span></figure>" +
            '<div class="ed-feature__body">' +
              '<h2 class="ed-feature__title">' + esc(t(it.title)) + "</h2>" +
              (t(it.summary) ? '<p class="ed-feature__text" style="color:var(--on-surface)">' + esc(t(it.summary)) + "</p>" : "") +
              '<p class="ed-feature__text">' + esc(t(it.overview) || "") + "</p>" +
              (tags ? '<div class="card__tags">' + tags + "</div>" : "") +
            "</div></article>";
        }).join("");
        return '<div class="ed-wrap ed-section">' + edHead(L.state.lang === "en" ? "Genres & formats" : "主題與形式", p) +
          '<div class="ed-features">' + items + "</div></div>";
      },

      /* ---- catalog: category-grouped item sections + search/filter (puzzles) ---- */
      catalog: function (p) {
        var cats = p.categories || [];
        var chips = cats.map(function (c) { return '<button class="chip" type="button" data-cat="' + esc(c.key) + '">' + esc(c[L.state.lang] || c.en) + "</button>"; }).join("");
        var allLabel = L.state.lang === "en" ? "All" : "全部";
        var groups = cats.map(function (c) {
          var its = (p.items || []).filter(function (it) { return it.category === c.key; });
          if (!its.length) return "";
          var cards = its.map(function (it, idx) {
            var hay = (t(it.title) + " " + t(it.summary) + " " + (it.tags || []).map(tagStr).join(" ")).toLowerCase();
            var tags = (it.tags || []).map(function (g) { return '<span class="tag">' + esc(tagStr(g)) + "</span>"; }).join("");
            return '<article class="card' + (idx === 0 ? " card--feat" : "") + '" data-item data-slug="' + esc(it.slug) +
              '" data-cat="' + esc(c.key) + '" data-hay="' + esc(hay) + '" tabindex="0" role="button" aria-label="' + esc(t(it.title)) + '">' +
              '<h3 class="card__title">' + esc(t(it.title)) + "</h3>" +
              '<p class="card__summary">' + esc(t(it.summary)) + "</p>" +
              (tags ? '<div class="card__tags">' + tags + "</div>" : "") +
              '<span class="card__play"><span class="material-symbols-rounded" aria-hidden="true">play_circle</span>' + (L.state.lang === "en" ? "play" : "試玩") + "</span></article>";
          }).join("");
          return '<section class="ed-catgroup reveal" data-catgroup="' + esc(c.key) + '">' +
            '<header class="ed-cat__head"><h3>' + esc(c[L.state.lang] || c.en) + '</h3><span class="ed-cat__count">' + its.length + "</span></header>" +
            '<div class="ed-catgrid">' + cards + "</div></section>";
        }).join("");
        return '<div class="ed-wrap ed-section">' + edHead(L.state.lang === "en" ? "Puzzle types" : "遊戲題型", p) +
          '<div class="toolbar"><input id="search" class="search" type="search" autocomplete="off" ' +
            'placeholder="' + (L.state.lang === "en" ? "Search puzzle types…" : "搜尋題型…") + '" aria-label="' + (L.state.lang === "en" ? "Search" : "搜尋") + '" />' +
            '<div class="chips"><button class="chip chip--active" type="button" data-cat="">' + esc(allLabel) + "</button>" + chips + "</div></div>" +
          '<p class="result-count" id="resultCount" aria-live="polite"></p>' +
          '<div class="ed-catgroups">' + groups + "</div></div>";
      },

      /* ---- spec: grouped spec-sheet rows (locks) ---- */
      spec: function (p) {
        var cats = p.categories || [];
        var groups = cats.map(function (c) {
          var its = (p.items || []).filter(function (it) { return it.category === c.key; });
          if (!its.length) return "";
          var rows = its.map(function (it) {
            var freq = (it.tags && it.tags[0]) ? tagStr(it.tags[0]) : "";
            return '<li class="ed-spec" data-item data-slug="' + esc(it.slug) + '" tabindex="0" role="button" aria-label="' + esc(t(it.title)) + '">' +
              '<span class="ed-spec__visual" aria-hidden="true"><span class="material-symbols-rounded">' + esc(it.icon || "lock") + "</span></span>" +
              '<span class="ed-spec__name">' + esc(t(it.title)) + (freq ? '<span class="ed-spec__freq">' + esc(freq) + "</span>" : "") + "</span>" +
              '<span class="ed-spec__sum">' + esc(t(it.summary)) + "</span></li>";
          }).join("");
          return '<section class="ed-cat reveal"><header class="ed-cat__head"><h3>' + esc(c[L.state.lang] || c.en) +
            '</h3><span class="ed-cat__count">' + its.length + "</span></header><ul class=\"ed-specs\">" + rows + "</ul></section>";
        }).join("");
        return '<div class="ed-wrap ed-section">' + edHead(L.state.lang === "en" ? "Lock families" : "鎖具圖鑑", p) + groups + "</div>";
      }
    };

    /* =====================================================================
       WIRING (interactions) — keyed by layout, run after innerHTML is set
       ===================================================================== */
    var WIRE = {
      hub: function () { /* counters handled by the global postRender() hook */ },

      home: function () { /* static editorial; reveal + count-up via postRender() */ },
      editorial: function () { /* static editorial; reveal via postRender() */ },

      spec: function (p) { wireDetailItems(p.items || []); },

      catalog: function (p) {
        wireDetailItems(p.items || []);
        var search = document.getElementById("search");
        var count = document.getElementById("resultCount");
        var chips = [].slice.call(pageEl.querySelectorAll(".chip"));
        var cards = [].slice.call(pageEl.querySelectorAll(".card[data-slug]"));
        var groups = [].slice.call(pageEl.querySelectorAll(".ed-catgroup"));
        var st = { q: "", cat: "" };
        function apply() {
          var n = 0;
          cards.forEach(function (c) {
            var show = (!st.cat || c.dataset.cat === st.cat) && (!st.q || (c.dataset.hay || "").indexOf(st.q) !== -1);
            c.style.display = show ? "" : "none"; if (show) n++;
          });
          groups.forEach(function (g) {
            var any = [].some.call(g.querySelectorAll(".card[data-slug]"), function (c) { return c.style.display !== "none"; });
            g.style.display = any ? "" : "none";
          });
          if (count) count.textContent = n + (L.state.lang === "en" ? " type(s)" : " 種題型");
        }
        if (search) search.addEventListener("input", function () { st.q = this.value.trim().toLowerCase(); apply(); });
        chips.forEach(function (chip) {
          chip.addEventListener("click", function () {
            chips.forEach(function (c) { c.classList.remove("chip--active"); });
            chip.classList.add("chip--active"); st.cat = chip.dataset.cat || ""; apply();
          });
        });
        apply();
      },

      gallery: function (p) {
        var grid = document.getElementById("grid");
        var search = document.getElementById("search");
        var count = document.getElementById("resultCount");
        var chips = [].slice.call(pageEl.querySelectorAll(".chip"));
        var st = { q: "", cat: "" };

        /* tags may be plain strings (proper nouns) OR {en,zh} objects — localize
           the objects so the language toggle leaves nothing stuck in one tongue */
        function tagStr(g) { return (g && typeof g === "object") ? t(g) : g; }

        function matches(item) {
          if (st.cat && item.category !== st.cat) return false;
          if (!st.q) return true;
          var hay = (t(item.title) + " " + t(item.summary) + " " + (item.tags || []).map(tagStr).join(" ")).toLowerCase();
          return hay.indexOf(st.q) !== -1;
        }
        function paint() {
          var rows = (p.items || []).filter(matches);
          grid.innerHTML = rows.map(function (item) {
            var tags = (item.tags || []).map(function (g) { return '<span class="tag">' + esc(tagStr(g)) + "</span>"; }).join("");
            return '<article class="card" tabindex="0" role="button" data-item data-slug="' + esc(item.slug) + '" ' +
              'aria-label="' + esc(t(item.title)) + '">' +
              '<h3 class="card__title">' + esc(t(item.title)) + "</h3>" +
              '<p class="card__summary">' + esc(t(item.summary)) + "</p>" +
              (tags ? '<div class="card__tags">' + tags + "</div>" : "") + "</article>";
          }).join("");
          if (count) count.textContent = rows.length + (L.state.lang === "en" ? " result(s)" : " 筆結果");
          wireCards();
        }
        function wireCards() {
          [].forEach.call(grid.querySelectorAll(".card[data-slug]"), function (card) {
            var slug = card.dataset.slug;
            card.addEventListener("click", function () { openItem(slug); });
            card.addEventListener("keydown", function (e) {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openItem(slug); }
            });
          });
        }
        function findItem(slug) {
          return (p.items || []).filter(function (it) { return it.slug === slug; })[0] || null;
        }
        function openItem(slug) {
          var item = findItem(slug); if (!item) return;
          var dlg = L.dialog(), body = document.getElementById("dialogBody");
          var tags = (item.tags || []).map(function (g) { return '<span class="tag">' + esc(tagStr(g)) + "</span>"; }).join("");
          body.innerHTML = '<h2 id="dialogTitle">' + esc(t(item.title)) + "</h2>" +
            (tags ? '<div class="card__tags">' + tags + "</div>" : "") +
            "<p>" + esc(t(item.overview) || t(item.summary)) + "</p>";
          /* puzzles page: mount the playable mini-game(s) for this puzzle type.
             A type can expose several sub-games (one per sub-technique) shown as tabs. */
          if (L.currentSlug() === "puzzles" && window.MINIGAMES && window.MINIGAMES[slug]) {
            var games = window.MINIGAMES[slug];
            if (games && games.length) {
              var mgWrap = document.createElement("div");
              mgWrap.className = "mg";
              var mgHead = document.createElement("h3");
              mgHead.className = "mg__head";
              mgHead.textContent = (L.state.lang === "en" ? "Try it" : "試玩看看") +
                (games.length > 1 ? (L.state.lang === "en" ? " · " + games.length + " mini-games" : " · " + games.length + " 個小遊戲") : "");
              mgWrap.appendChild(mgHead);
              var mgTabs = null;
              if (games.length > 1) {
                mgTabs = document.createElement("div");
                mgTabs.className = "mg-subtabs";
                games.forEach(function (g, gi) {
                  var c = document.createElement("button");
                  c.type = "button"; c.className = "mg-subtab"; c.dataset.gi = gi;
                  c.textContent = L.t(g.name);
                  mgTabs.appendChild(c);
                });
                mgWrap.appendChild(mgTabs);
              }
              var mgHost = document.createElement("div");
              mgHost.className = "mg-sub";
              mgWrap.appendChild(mgHost);
              body.appendChild(mgWrap);
              var mountGame = function (gi) {
                mgHost.innerHTML = "";
                if (mgTabs) [].forEach.call(mgTabs.children, function (c, i) { c.classList.toggle("mg-subtab--active", i === gi); });
                try { games[gi].build(mgHost, L); } catch (e) {}
              };
              if (mgTabs) [].forEach.call(mgTabs.children, function (c) {
                c.addEventListener("click", function () { mountGame(parseInt(c.dataset.gi, 10)); });
              });
              mountGame(0);
            }
          }
          if (!dlg.open) dlg.showModal();
          if (location.hash.slice(1) !== slug) history.replaceState(null, "", "#" + slug);
        }
        function syncHash() {
          var slug = location.hash.slice(1);
          if (slug && findItem(slug)) openItem(slug);
        }
        if (search) search.addEventListener("input", function () { st.q = this.value.trim().toLowerCase(); paint(); });
        chips.forEach(function (chip) {
          chip.addEventListener("click", function () {
            chips.forEach(function (c) { c.classList.remove("chip--active"); });
            chip.classList.add("chip--active");
            st.cat = chip.dataset.cat || "";
            paint();
          });
        });
        /* closing the dialog clears the #slug so the URL returns to clean state
           and a later deep link to the SAME slug fires hashchange again */
        var dlg = L.dialog();
        function onClose() {
          var slug = location.hash.slice(1);
          if (slug && findItem(slug)) history.replaceState(null, "", location.pathname + location.search);
        }
        dlg.addEventListener("close", onClose);
        var onHash = function () { syncHash(); };
        window.addEventListener("hashchange", onHash);
        teardowns.push(function () {
          window.removeEventListener("hashchange", onHash);
          dlg.removeEventListener("close", onClose);
        });
        paint();
        syncHash();
      },

      article: function () {
        var prog = document.getElementById("readingProgress");
        var links = [].slice.call(pageEl.querySelectorAll(".toc-link"));
        var secs = [].slice.call(pageEl.querySelectorAll(".article-section"));
        function onScroll() {
          var h = document.documentElement;
          var max = h.scrollHeight - h.clientHeight;
          if (prog) prog.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        teardowns.push(function () { window.removeEventListener("scroll", onScroll); });
        if ("IntersectionObserver" in window) {
          var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
              if (!en.isIntersecting) return;
              links.forEach(function (a) {
                var on = a.dataset.toc === en.target.id;
                a.classList.toggle("toc-link--active", on);
              });
            });
          }, { rootMargin: "-30% 0px -60% 0px" });
          secs.forEach(function (s) { io.observe(s); });
          teardowns.push(function () { io.disconnect(); });
        }
      },

      dashboard: function () { /* static charts; nothing to wire */ },

      table: function (p) {
        var table = document.getElementById("dataTable");
        var thead = table.querySelector("thead"), tbody = table.querySelector("tbody");
        var search = document.getElementById("search");
        var chipsBox = document.getElementById("tableChips");
        var cols = p.columns || [];
        var st = { q: "", filter: "", sortKey: null, dir: 1 };
        var filterCol = cols.filter(function (c) { return c.filter; })[0];

        function cellText(row, c) { var v = row[c.key]; return typeof v === "object" ? t(v) : String(v == null ? "" : v); }
        function rowMatches(row) {
          if (filterCol && st.filter && cellText(row, filterCol) !== st.filter) return false;
          if (!st.q) return true;
          return cols.some(function (c) { return cellText(row, c).toLowerCase().indexOf(st.q) !== -1; });
        }
        function paintHead() {
          thead.innerHTML = "<tr>" + cols.map(function (c) {
            var arrow = st.sortKey === c.key ? (st.dir > 0 ? " ▲" : " ▼") : "";
            return '<th class="th-sort" data-key="' + esc(c.key) + '" role="button" tabindex="0" aria-label="Sort by ' +
              esc(t(c.label)) + '">' + esc(t(c.label)) + esc(arrow) + "</th>";
          }).join("") + "</tr>";
          [].forEach.call(thead.querySelectorAll(".th-sort"), function (th) {
            th.addEventListener("click", function () { sortBy(th.dataset.key); });
            th.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sortBy(th.dataset.key); } });
          });
        }
        function sortBy(key) {
          if (st.sortKey === key) st.dir = -st.dir; else { st.sortKey = key; st.dir = 1; }
          paint();
        }
        function paint() {
          paintHead();
          var col = cols.filter(function (c) { return c.key === st.sortKey; })[0];
          var rows = (p.rows || []).filter(rowMatches).slice();
          if (col) {
            rows.sort(function (a, b) {
              var va = a[col.key], vb = b[col.key];
              if (col.type === "num") return (Number(va) - Number(vb)) * st.dir;
              return String(typeof va === "object" ? t(va) : va).localeCompare(String(typeof vb === "object" ? t(vb) : vb)) * st.dir;
            });
          }
          tbody.innerHTML = rows.map(function (row) {
            return "<tr data-item>" + cols.map(function (c) {
              if (c.type === "link") {
                var u = row[c.key];
                return '<td><a class="row-link" href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(u) + "</a></td>";
              }
              return "<td>" + esc(cellText(row, c)) + "</td>";
            }).join("") + "</tr>";
          }).join("");
        }
        if (filterCol) {
          var vals = [];
          (p.rows || []).forEach(function (row) { var v = cellText(row, filterCol); if (vals.indexOf(v) === -1) vals.push(v); });
          var allLabel = L.state.lang === "en" ? "All" : "全部";
          chipsBox.innerHTML = '<button class="chip chip--active" type="button" data-v="">' + esc(allLabel) + "</button>" +
            vals.map(function (v) { return '<button class="chip" type="button" data-v="' + esc(v) + '">' + esc(v) + "</button>"; }).join("");
          [].forEach.call(chipsBox.querySelectorAll(".chip"), function (chip) {
            chip.addEventListener("click", function () {
              [].forEach.call(chipsBox.querySelectorAll(".chip"), function (c) { c.classList.remove("chip--active"); });
              chip.classList.add("chip--active");
              st.filter = chip.dataset.v || "";
              paint();
            });
          });
        }
        if (search) search.addEventListener("input", function () { st.q = this.value.trim().toLowerCase(); paint(); });
        paint();
      },

      bento: function () { /* static */ },
      kanban: function () { /* static */ },

      faq: function () {
        var search = document.getElementById("search");
        var items = [].slice.call(pageEl.querySelectorAll(".acc-item"));
        if (search) search.addEventListener("input", function () {
          var q = this.value.trim().toLowerCase();
          items.forEach(function (it) {
            var hit = !q || (it.dataset.q || "").indexOf(q) !== -1;
            it.style.display = hit ? "" : "none";
          });
        });
      },

      comparison: function () { /* static */ },

      leaderboard: function (p) {
        var view = document.getElementById("lbView");
        var btns = [].slice.call(pageEl.querySelectorAll(".seg__btn"));
        var entries = (p.entries || []).slice().sort(function (a, b) { return b.score - a.score; });
        function row(e, rank) {
          return '<li class="lb-row" data-item>' +
            (rank ? '<span class="lb-rank">' + rank + "</span>" : "") +
            '<span class="lb-tier lb-tier--' + esc(e.tier || "") + '">' + esc(e.tier || "") + "</span>" +
            '<span class="lb-name">' + esc(t(e.name)) + "</span>" +
            '<span class="lb-meta">' + esc(t(e.meta)) + "</span>" +
            '<span class="lb-score">' + esc(String(e.score)) + "</span></li>";
        }
        function listView() {
          view.innerHTML = '<ol class="lb-list">' + entries.map(function (e, i) { return row(e, i + 1); }).join("") + "</ol>";
        }
        function tierView() {
          var tiers = [];
          entries.forEach(function (e) { if (tiers.indexOf(e.tier) === -1) tiers.push(e.tier); });
          view.innerHTML = tiers.map(function (tier) {
            var rows = entries.filter(function (e) { return e.tier === tier; }).map(function (e) { return row(e); }).join("");
            return '<div class="lb-tier-group"><div class="lb-tier-head lb-tier--' + esc(tier) + '">' + esc(tier) + "</div>" +
              '<ol class="lb-list">' + rows + "</ol></div>";
          }).join("");
        }
        btns.forEach(function (b) {
          b.addEventListener("click", function () {
            btns.forEach(function (x) { x.classList.remove("seg__btn--active"); });
            b.classList.add("seg__btn--active");
            if (b.dataset.view === "tier") tierView(); else listView();
          });
        });
        listView();
      },

      scrolly: function (p) {
        var visual = document.getElementById("scrollyVisual");
        var steps = [].slice.call(pageEl.querySelectorAll(".scrolly-step"));
        function paintVisual(i) {
          var s = (p.steps || [])[i]; if (!s) return;
          var v = s.visual || {};
          if (v.type === "bars") {
            visual.innerHTML = '<div class="chart-wrap">' + barChart(v.bars || [], v.color) + "</div>";
          } else {
            visual.innerHTML = '<div class="scrolly-stat" style="color:' + esc(v.color || "var(--primary)") + '">' +
              esc(t(v.value)) + "</div>";
          }
        }
        paintVisual(0);
        if ("IntersectionObserver" in window) {
          var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
              if (en.isIntersecting) {
                steps.forEach(function (s) { s.classList.remove("scrolly-step--active"); });
                en.target.classList.add("scrolly-step--active");
                paintVisual(parseInt(en.target.dataset.step, 10) || 0);
              }
            });
          }, { rootMargin: "-45% 0px -45% 0px" });
          steps.forEach(function (s) { io.observe(s); });
          teardowns.push(function () { io.disconnect(); });
        }
      },

      map: function (p) {
        var listEl = document.getElementById("mapList");
        var search = document.getElementById("search");
        var count = document.getElementById("resultCount");
        var chips = [].slice.call(pageEl.querySelectorAll(".chip"));
        var places = p.places || [];
        var st = { q: "", cat: "" };
        var hasLeaflet = !(typeof window.L === "undefined" || !window.L.map);
        var map = null, markers = {};

        if (hasLeaflet) {
          map = window.L.map("map", { scrollWheelZoom: false });
          window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap", maxZoom: 19
          }).addTo(map);
          places.forEach(function (pl) {
            /* alt + title give Leaflet's marker <img role="button"> an accessible name */
            markers[pl.slug] = window.L.marker([pl.lat, pl.lng], { alt: t(pl.name), title: t(pl.name), keyboard: true })
              .bindPopup("<b>" + esc(t(pl.name)) + "</b><br>" + esc(t(pl.body)));
          });
          teardowns.push(function () { try { map.remove(); } catch (e) {} });
        } else {
          // Leaflet not loaded (offline / blocked): list-only graceful fallback.
          document.getElementById("map").innerHTML =
            '<div class="map-fallback">' + esc(L.state.lang === "en" ? "Map unavailable offline — see the list." : "離線時地圖無法載入 — 請看清單。") + "</div>";
        }

        function matches(pl) {
          if (st.cat && pl.category !== st.cat) return false;
          if (!st.q) return true;
          return (t(pl.name) + " " + t(pl.body)).toLowerCase().indexOf(st.q) !== -1;
        }
        function paint() {
          var rows = places.filter(matches);
          listEl.innerHTML = rows.map(function (pl) {
            return '<li class="place" data-item data-slug="' + esc(pl.slug) + '" tabindex="0" role="button" ' +
              'aria-label="' + esc(t(pl.name)) + '"><b>' + esc(t(pl.name)) + "</b>" +
              '<span>' + esc(t(pl.body)) + "</span></li>";
          }).join("");
          if (count) count.textContent = rows.length + (L.state.lang === "en" ? " studio(s)" : " 間工作室");
          if (hasLeaflet) {
            var group = [];
            places.forEach(function (pl) {
              var m = markers[pl.slug]; if (!m) return;
              if (matches(pl)) { m.addTo(map); group.push([pl.lat, pl.lng]); }
              else { map.removeLayer(m); }
            });
            if (group.length) map.fitBounds(group, { padding: [30, 30] });
          }
          [].forEach.call(listEl.querySelectorAll(".place"), function (li) {
            function go() { var m = markers[li.dataset.slug]; if (m && hasLeaflet) { map.panTo(m.getLatLng()); m.openPopup(); } }
            li.addEventListener("click", go);
            li.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
          });
        }
        if (search) search.addEventListener("input", function () { st.q = this.value.trim().toLowerCase(); paint(); });
        chips.forEach(function (chip) {
          chip.addEventListener("click", function () {
            chips.forEach(function (c) { c.classList.remove("chip--active"); });
            chip.classList.add("chip--active");
            st.cat = chip.dataset.cat || "";
            paint();
          });
        });
        paint();
      },

      glossary: function (p) {
        var search = document.getElementById("search");
        var count = document.getElementById("resultCount");
        var items = [].slice.call(pageEl.querySelectorAll(".gloss-item"));
        function update() {
          var q = search ? search.value.trim().toLowerCase() : "";
          var n = 0;
          items.forEach(function (it) {
            var hit = !q || (it.dataset.q || "").indexOf(q) !== -1;
            it.style.display = hit ? "" : "none";
            if (hit) n++;
          });
          if (count) count.textContent = n + (L.state.lang === "en" ? " term(s)" : " 個術語");
        }
        if (search) search.addEventListener("input", update);
        update();
      },

      quiz: function (p) {
        var scoreEl = document.getElementById("quizScore");
        var questions = p.questions || [];
        var total = questions.length;
        var answered = {};   // qi -> chosen option index (in-memory, resets on reload/lang switch)
        function paintScore() {
          var done = Object.keys(answered).length, correct = 0;
          Object.keys(answered).forEach(function (qi) {
            if (answered[qi] === questions[qi].answer) correct++;
          });
          scoreEl.textContent = L.state.lang === "en"
            ? ("Score " + correct + " / " + total + "  ·  answered " + done + "/" + total)
            : ("得分 " + correct + " / " + total + "  ·  已答 " + done + "/" + total);
        }
        [].forEach.call(pageEl.querySelectorAll(".quiz-card"), function (card) {
          var qi = parseInt(card.dataset.qi, 10);
          var q = questions[qi];
          var opts = [].slice.call(card.querySelectorAll(".quiz-opt"));
          var explainEl = card.querySelector(".quiz-explain");
          opts.forEach(function (btn) {
            btn.addEventListener("click", function () {
              if (card.classList.contains("quiz-card--done")) return;  // answer once
              var oi = parseInt(btn.dataset.o, 10);
              answered[qi] = oi;
              card.classList.add("quiz-card--done");
              var ok = oi === q.answer;
              opts.forEach(function (b, i) {
                b.disabled = true;
                if (i === q.answer) b.classList.add("quiz-opt--correct");
                else if (i === oi) b.classList.add("quiz-opt--wrong");
              });
              explainEl.innerHTML = '<span class="quiz-mark">' + (ok ? "✅" : "❌") + "</span> " + esc(t(q.explain));
              explainEl.hidden = false;
              paintScore();
            });
          });
        });
        paintScore();
      },

      flashcards: function () {
        [].forEach.call(pageEl.querySelectorAll(".flash"), function (card) {
          card.addEventListener("click", function () {
            var flipped = card.classList.toggle("flash--flipped");
            card.setAttribute("aria-pressed", flipped ? "true" : "false");
          });
        });
      }
    };

    /* ---- hero count-up (shared by hub) ---- */
    function animateCounters() {
      var els = [].slice.call(pageEl.querySelectorAll(".hero__stat-value[data-count]"));
      if (!els.length) return;
      function run(el) {
        var target = parseFloat(el.dataset.count) || 0, dur = 1000, start = null;
        function step(ts) {
          if (start === null) start = ts;
          var pr = Math.min(1, (ts - start) / dur), eased = 1 - Math.pow(1 - pr, 3);
          el.textContent = String(Math.round(target * eased));
          if (pr < 1) requestAnimationFrame(step); else el.textContent = String(target);
        }
        requestAnimationFrame(step);
      }
      if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
      }, { threshold: 0.4 });
      els.forEach(function (el) { io.observe(el); });
      teardowns.push(function () { io.disconnect(); });
    }

    /* ---- post-render: count-up for [data-count] + scroll-reveal for .reveal ---- */
    function postRender() {
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var nums = [].slice.call(pageEl.querySelectorAll("[data-count]"));
      function run(el) {
        var target = parseFloat(el.dataset.count) || 0, suffix = el.dataset.suffix || "", dur = 1100, start = null;
        function step(ts) {
          if (start === null) start = ts;
          var pr = Math.min(1, (ts - start) / dur), eased = 1 - Math.pow(1 - pr, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (pr < 1) requestAnimationFrame(step); else el.textContent = target + suffix;
        }
        requestAnimationFrame(step);
      }
      if (reduce) { nums.forEach(function (el) { el.textContent = (parseFloat(el.dataset.count) || 0) + (el.dataset.suffix || ""); }); }
      else if (!("IntersectionObserver" in window)) { nums.forEach(run); }
      else {
        var io = new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } }); }, { threshold: 0.4 });
        nums.forEach(function (el) { io.observe(el); });
        teardowns.push(function () { io.disconnect(); });
      }
      var rev = [].slice.call(pageEl.querySelectorAll(".reveal"));
      if (reduce || !("IntersectionObserver" in window)) { rev.forEach(function (el) { el.classList.add("is-in"); }); }
      else {
        var io2 = new IntersectionObserver(function (ents, ob) { ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); ob.unobserve(en.target); } }); }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
        rev.forEach(function (el) { io2.observe(el); });
        teardowns.push(function () { io2.disconnect(); });
      }
    }

    /* =====================================================================
       RENDER the current page; re-runnable on language switch
       ===================================================================== */
    function render() {
      teardowns.forEach(function (fn) { try { fn(); } catch (e) {} });
      teardowns = [];
      var p = L.currentPage();
      if (!p) { pageEl.innerHTML = '<p class="empty">No page data.</p>'; return; }
      var fn = RENDERERS[p.layout] || RENDERERS.gallery;
      pageEl.className = "page page--" + p.layout;
      pageEl.innerHTML = fn(p);
      var w = WIRE[p.layout];
      if (w) w(p);
      postRender();
    }

    L.onLang(render);
    render();
  }

  boot();
})();
