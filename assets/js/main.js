/* ruben gläser/ – Hauptskript (ohne Abhängigkeiten) */
(function () {
  "use strict";
  let io; // Scroll-Reveal-Observer

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Marken-Zeichen (drei Schrägstriche) als wiederverwendbares SVG
  const MARK = '<svg viewBox="0 0 111.09 183.96" aria-hidden="true"><path d="M45.34 0.00L65.50 0.00L20.46 113.49L0.00 113.49L45.34 0.00Z"/><path d="M47.96 70.47L68.13 70.47L23.08 183.96L2.62 183.96L47.96 70.47Z"/><path d="M90.92 43.59L80.06 70.80L79.87 71.28L45.59 157.08L66.05 157.08L79.92 122.15L100.29 70.80L111.09 43.59L90.92 43.59Z"/></svg>';

  /* ---------- Theme (hell/dunkel) ---------- */
  const root = document.documentElement;
  let theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  root.setAttribute("data-theme", theme);
  const themeIcon = (t) => t === "dark"
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  $$("[data-theme-toggle]").forEach((btn) => {
    const sync = () => {
      btn.innerHTML = themeIcon(theme);
      btn.setAttribute("aria-label", theme === "dark" ? "Zu hellem Design wechseln" : "Zu dunklem Design wechseln");
    };
    sync();
    btn.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", theme);
      $$("[data-theme-toggle]").forEach((b) => { b.innerHTML = themeIcon(theme); });
      sync();
      // Theme an eingebettete App weiterreichen (falls sie darauf hört)
      const f = $("#app-frame");
      if (f && f.contentWindow) f.contentWindow.postMessage({ type: "theme", theme }, "*");
    });
  });

  /* ---------- Header & Menü ---------- */
  const header = $(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 8);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
  }
  const menuBtn = $(".menu-toggle");
  const navList = $(".nav-list");
  if (menuBtn && navList) {
    menuBtn.addEventListener("click", () => {
      const open = navList.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    $$("a", navList).forEach((a) => a.addEventListener("click", () => {
      navList.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    }));
  }

  /* ---------- Site-Daten (E-Mail, Social) ---------- */
  const SITE = window.SITE || {};
  $$("[data-email]").forEach((a) => {
    if (!SITE.email) return;
    a.href = "mailto:" + SITE.email;
    if (a.hasAttribute("data-email-text")) a.textContent = SITE.email;
  });
  $$("[data-social]").forEach((ul) => {
    (SITE.social || []).filter((s) => s.url).forEach((s) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`;
      ul.appendChild(li);
    });
  });
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Hilfen ---------- */
  const placeholder = (i, label) =>
    `<div class="ph ph--${(i % 6) + 1}">${MARK}${label ? `<span class="ph-label">${esc(label)}</span>` : ""}</div>`;

  function buildFilters(container, items, key, onChange) {
    if (!container) return;
    const cats = [...new Set(items.map((x) => x[key]).filter(Boolean))];
    if (cats.length < 2) { container.hidden = true; return; }
    const all = ["Alle", ...cats];
    container.innerHTML = all.map((c, i) =>
      `<button class="chip" type="button" aria-pressed="${i === 0}" data-val="${esc(c)}">${esc(c)}</button>`).join("");
    container.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      $$(".chip", container).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      onChange(b.dataset.val === "Alle" ? null : b.dataset.val);
    });
  }

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox");
  let lbList = [], lbIndex = 0, lbRender = null;
  function openLightbox(list, index, render) {
    if (!lb) return;
    lbList = list; lbIndex = index; lbRender = render;
    drawLightbox();
    if (!lb.open) lb.showModal();
  }
  function drawLightbox() {
    const item = lbList[lbIndex];
    $(".lb-media", lb).innerHTML = (item.bild
      ? `<img src="${esc(item.bild)}" alt="${esc(item.alt || item.titel)}">`
      : placeholder(item._i, "Bild folgt")) + `<div class="lb-nav">
        <button class="icon-btn" type="button" data-lb="prev" aria-label="Vorheriges"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
        <button class="icon-btn" type="button" data-lb="next" aria-label="Nächstes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>
      </div>`;
    $(".lb-body", lb).innerHTML = lbRender(item);
  }
  if (lb) {
    lb.addEventListener("click", (e) => {
      const nav = e.target.closest("[data-lb]");
      if (nav) {
        const d = nav.dataset.lb === "next" ? 1 : -1;
        lbIndex = (lbIndex + d + lbList.length) % lbList.length;
        drawLightbox();
        return;
      }
      if (e.target.closest(".lb-close") || e.target === lb) lb.close();
    });
    lb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        lbIndex = (lbIndex + (e.key === "ArrowRight" ? 1 : -1) + lbList.length) % lbList.length;
        drawLightbox();
      }
    });
  }

  /* ---------- Grafik ---------- */
  const grafikGrid = $("#grafik-grid");
  if (grafikGrid) {
    const items = (window.GRAFIK || []).map((x, i) => ({ ...x, _i: i }));
    const render = (filter) => {
      const list = items.filter((x) => !filter || x.kategorie === filter);
      if (!list.length) { grafikGrid.innerHTML = '<p class="empty">Hier erscheinen bald Arbeiten.</p>'; return; }
      grafikGrid.innerHTML = list.map((x, i) => `
        <button class="work-card reveal" type="button" data-i="${i}">
          <div class="work-media">${x.bild ? `<img src="${esc(x.bild)}" alt="${esc(x.alt || x.titel)}" loading="lazy">` : placeholder(x._i, x.kategorie)}</div>
          <div class="work-meta"><div><h3>${esc(x.titel)}</h3><p class="work-cat">${esc(x.kategorie)}</p></div><span>${esc(x.jahr)}</span></div>
        </button>`).join("");
      $$(".work-card", grafikGrid).forEach((card) => card.addEventListener("click", () =>
        openLightbox(list, +card.dataset.i, (it) => `
          <span class="eyebrow">${esc(it.kategorie)}</span>
          <h2>${esc(it.titel)}</h2>
          ${it.beschreibung ? `<p>${esc(it.beschreibung)}</p>` : ""}
          <dl class="lb-facts">
            ${it.kunde ? `<dt>Kunde</dt><dd>${esc(it.kunde)}</dd>` : ""}
            ${it.leistung ? `<dt>Leistung</dt><dd>${esc(it.leistung)}</dd>` : ""}
            ${it.jahr ? `<dt>Jahr</dt><dd>${esc(it.jahr)}</dd>` : ""}
          </dl>`)));
      observeReveals();
    };
    buildFilters($("#grafik-filters"), items, "kategorie", render);
    render(null);
  }

  /* ---------- Fotografie ---------- */
  const gallery = $("#foto-gallery");
  if (gallery) {
    const items = (window.FOTOGRAFIE || []).map((x, i) => ({ ...x, _i: i }));
    const ratio = { hoch: "4 / 5", quer: "3 / 2", quadrat: "1 / 1" };
    const render = (filter) => {
      const list = items.filter((x) => !filter || x.serie === filter);
      if (!list.length) { gallery.innerHTML = '<p class="empty">Hier erscheinen bald Fotos.</p>'; return; }
      gallery.innerHTML = list.map((x, i) => `
        <button class="gallery-item reveal" type="button" data-i="${i}">
          <div class="gallery-media">${x.bild
            ? `<img src="${esc(x.bild)}" alt="${esc(x.alt || x.titel)}" loading="lazy">`
            : `<div class="ph-wrap" style="aspect-ratio:${ratio[x.format] || "3 / 2"}">${placeholder(x._i + 2, x.serie)}</div>`}</div>
          <div class="gallery-caption"><span>${esc(x.titel)}</span><span>${esc([x.ort, x.jahr].filter(Boolean).join(", "))}</span></div>
        </button>`).join("");
      $$(".gallery-item", gallery).forEach((card) => card.addEventListener("click", () =>
        openLightbox(list, +card.dataset.i, (it) => `
          <span class="eyebrow">${esc(it.serie)}</span>
          <h2>${esc(it.titel)}</h2>
          ${it.beschreibung ? `<p>${esc(it.beschreibung)}</p>` : ""}
          <dl class="lb-facts">
            ${it.ort ? `<dt>Ort</dt><dd>${esc(it.ort)}</dd>` : ""}
            ${it.jahr ? `<dt>Jahr</dt><dd>${esc(it.jahr)}</dd>` : ""}
            ${it.kamera ? `<dt>Kamera</dt><dd>${esc(it.kamera)}</dd>` : ""}
          </dl>`)));
      observeReveals();
    };
    buildFilters($("#foto-filters"), items, "serie", render);
    render(null);
  }

  /* ---------- Web-Apps: Übersicht ---------- */
  const appsGrid = $("#apps-grid");
  if (appsGrid) {
    const apps = window.WEBAPPS || [];
    const initials = (t) => t.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    appsGrid.innerHTML = apps.length ? apps.map((a, i) => `
      <article class="app-card reveal">
        <div class="app-thumb">
          ${a.vorschau ? `<img src="${esc(a.vorschau)}" alt="" loading="lazy">` : placeholder(i * 2) + `<span class="app-thumb-initials" aria-hidden="true">${esc(initials(a.titel))}</span>`}
          ${a.status ? `<span class="app-status">${esc(a.status)}</span>` : ""}
        </div>
        <div class="app-body">
          <h3>${esc(a.titel)}</h3>
          <p>${esc(a.kurz || a.beschreibung)}</p>
          ${a.tags?.length ? `<ul class="tags">${a.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
          <div class="app-actions">
            <a class="btn btn-primary" href="app.html?id=${encodeURIComponent(a.id)}">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>Ausprobieren</a>
            <a class="btn btn-ghost" href="${esc(a.url)}" target="_blank" rel="noopener">Neuer Tab
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg></a>
          </div>
        </div>
      </article>`).join("")
      : '<p class="empty">Noch keine Web-Apps eingetragen. Ergänze sie in <code>content/web-apps.js</code>.</p>';
  }

  /* ---------- Web-Apps: Player ---------- */
  const stage = $("#player-stage");
  if (stage) {
    const id = new URLSearchParams(location.search).get("id");
    const app = (window.WEBAPPS || []).find((a) => a.id === id);
    if (!app) {
      stage.innerHTML = `<div class="player-empty"><h2>App nicht gefunden</h2>
        <p>Zu dieser Adresse gibt es keine App. Vielleicht wurde sie umbenannt.</p>
        <a class="btn btn-primary" href="web-apps.html">Zur Übersicht</a></div>`;
      $("#player-tools").hidden = true;
    } else {
      document.title = `${app.titel} – Web-Apps – Ruben Gläser`;
      $("#player-name").textContent = app.titel;
      $("#player-meta").textContent = [app.status, ...(app.tags || [])].filter(Boolean).join(" · ");
      const wrap = $("#frame-wrap");
      const frame = $("#app-frame");
      frame.title = app.titel;
      frame.src = app.url;
      frame.addEventListener("load", () => {
        try { frame.contentWindow.postMessage({ type: "theme", theme }, "*"); } catch (e) {}
      });
      $("#open-tab").href = app.url;
      $("#reload").addEventListener("click", () => { frame.src = app.url; });
      // Fokus-Modus: App füllt das ganze Fenster (Esc beendet)
      const fsBtn = $("#fullscreen");
      const setFocus = (on) => {
        document.body.classList.toggle("is-focus", on);
        fsBtn.setAttribute("aria-pressed", String(on));
      };
      fsBtn.addEventListener("click", () => setFocus(!document.body.classList.contains("is-focus")));
      $("#focus-exit").addEventListener("click", () => setFocus(false));
      addEventListener("keydown", (e) => { if (e.key === "Escape") setFocus(false); });
      $$("#device-seg button").forEach((b) => b.addEventListener("click", () => {
        $$("#device-seg button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        wrap.style.setProperty("--frame-w", b.dataset.w);
      }));
    }
  }

  /* ---------- Scroll-Reveal ---------- */
  function observeReveals() {
    if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((el) => el.classList.add("is-in")); return; }
    io = io || new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    $$(".reveal:not(.is-in)").forEach((el, i) => { el.style.transitionDelay = Math.min(i % 6, 5) * 60 + "ms"; io.observe(el); });
  }
  observeReveals();
})();
