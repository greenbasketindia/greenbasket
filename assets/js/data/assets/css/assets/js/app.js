/**
 * GreenBasket - Main App Logic
 * ------------------------------------------------------------
 * 1. Page basics (menu, year, brand text, scroll reveal)
 * 2. WhatsApp link builder
 * 3. Product loading (local JSON or Google Sheet CSV)
 * 4. Rendering (categories, filter chips, product cards)
 *
 * Settings come from assets/js/config.js (window.GREENBASKET_CONFIG).
 * NOTE: Price is never rendered anywhere on the website.
 */

(function () {
  "use strict";

  const CFG = window.GREENBASKET_CONFIG;
  if (!CFG) {
    console.error("GreenBasket: config.js not loaded.");
    return;
  }

  document.documentElement.classList.add("js");

  /* =========================================================
     Helpers
     ========================================================= */

  // Safe element creator (uses textContent, so no HTML injection)
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function icon(id) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#" + id);
    svg.appendChild(use);
    return svg;
  }

  // Simple grey-green placeholder when an image is missing
  const PLACEHOLDER =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">' +
        '<rect width="800" height="600" fill="#e6f0e8"/>' +
        '<g fill="none" stroke="#2a7a4d" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.55" transform="translate(340 240) scale(5)">' +
        '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>' +
        '<path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></g></svg>'
    );

  /* =========================================================
     1. Page basics
     ========================================================= */

  function initPage() {
    // Footer year
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    // Brand text from config
    document.querySelectorAll("[data-brand='serviceArea']").forEach(function (n) {
      n.textContent = CFG.brand.serviceArea;
    });

    // Mobile menu
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");
    if (toggle && links) {
      const setOpen = function (open) {
        links.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        toggle.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-menu");
      };
      toggle.addEventListener("click", function () {
        setOpen(!links.classList.contains("is-open"));
      });
      links.addEventListener("click", function (e) {
        if (e.target.closest("a")) setOpen(false);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") setOpen(false);
      });
    }
  }

  /* Scroll reveal: subtle fade-up for sections' content */
  let revealObserver = null;

  function initReveal() {
    if (!("IntersectionObserver" in window)) return;
    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document
      .querySelectorAll(".section-head, .step, .why-item, .about-grid > *, .cta-inner")
      .forEach(observeReveal);
  }

  function observeReveal(node) {
    if (!revealObserver) return;
    node.classList.add("reveal");
    revealObserver.observe(node);
  }

  /* =========================================================
     2. WhatsApp links
     ========================================================= */

  function buildWhatsAppUrl(message) {
    return "https://wa.me/" + CFG.whatsapp.number + "?text=" + encodeURIComponent(message);
  }

  function productMessage(productName, quantity) {
    return CFG.whatsapp.productMessage
      .replace("{product}", productName)
      .replace("{quantity}", quantity);
  }

  // Every button with data-wa="general" gets the generic order link
  function initGeneralWhatsAppLinks() {
    const url = buildWhatsAppUrl(CFG.whatsapp.generalMessage);
    document.querySelectorAll("[data-wa='general']").forEach(function (a) {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    });
  }

  /* =========================================================
     3. Loading product data
     ========================================================= */

  // Minimal CSV parser (handles quotes, commas and line breaks inside quotes)
  function parseCsv(text) {
    const rows = [];
    let row = [];
    let value = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"' && text[i + 1] === '"') { value += '"'; i++; }
        else if (c === '"') { inQuotes = false; }
        else { value += c; }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(value); value = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(value); value = "";
        rows.push(row); row = [];
      } else {
        value += c;
      }
    }
    if (value !== "" || row.length) { row.push(value); rows.push(row); }
    return rows;
  }

  function csvToProducts(text) {
    const rows = parseCsv(text).filter(function (r) {
      return r.some(function (cell) { return cell.trim() !== ""; });
    });
    if (rows.length < 2) return [];

    const headers = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    return rows.slice(1).map(function (r) {
      const obj = {};
      headers.forEach(function (h, i) { obj[h] = (r[i] || "").trim(); });
      return obj;
    });
  }

  // Normalise any source into safe product objects. PRICE IS DROPPED HERE.
  function normaliseProducts(list) {
    return list
      .map(function (p, i) {
        const availableRaw = String(p.available === undefined ? "true" : p.available).toLowerCase();
        return {
          id: p.id || "product-" + i,
          name: p.name || "",
          category: p.category || "",
          description: p.description || "",
          image: p.image || "",
          available: !["false", "no", "0", "out", "n"].includes(availableRaw)
          // price is intentionally NOT copied
        };
      })
      .filter(function (p) { return p.name; });
  }

  async function fetchLocalProducts() {
    const res = await fetch(CFG.products.localJsonUrl, { cache: "no-cache" });
    if (!res.ok) throw new Error("Local products file not found");
    return normaliseProducts(await res.json());
  }

  async function fetchSheetProducts() {
    const res = await fetch(CFG.products.sheetCsvUrl, { cache: "no-cache" });
    if (!res.ok) throw new Error("Google Sheet not reachable");
    return normaliseProducts(csvToProducts(await res.text()));
  }

  async function loadProducts() {
    if (CFG.products.source === "sheet" && CFG.products.sheetCsvUrl) {
      try {
        return await fetchSheetProducts();
      } catch (err) {
        console.warn("GreenBasket: sheet failed, using local fallback.", err);
      }
    }
    return fetchLocalProducts();
  }

  /* =========================================================
     4. Rendering
     ========================================================= */

  const state = { products: [], activeCategory: "All" };

  const grid = document.getElementById("productGrid");
  const empty = document.getElementById("productEmpty");
  const filterBar = document.getElementById("filterBar");
  const categoryGrid = document.getElementById("categoryGrid");

  function getCategories() {
    const list = CFG.categories.slice();
    state.products.forEach(function (p) {
      if (p.category && !list.includes(p.category)) list.push(p.category);
    });
    return list;
  }

  /* ---- Skeleton while loading ---- */
  function renderSkeleton() {
    grid.innerHTML = "";
    for (let i = 0; i < 4; i++) {
      const card = el("article", "product-card is-loading");
      card.appendChild(el("div", "product-media"));
      const body = el("div", "product-body");
      body.appendChild(el("div", "line"));
      body.appendChild(el("div", "line"));
      card.appendChild(body);
      grid.appendChild(card);
    }
  }

  /* ---- Category cards ---- */
  function renderCategories() {
    categoryGrid.innerHTML = "";
    getCategories().forEach(function (cat) {
      const card = el("button", "category-card");
      card.type = "button";
      const iconWrap = el("span", "category-icon");
      iconWrap.appendChild(icon("i-leaf"));
      card.appendChild(iconWrap);
      card.appendChild(el("span", "", cat));
      card.addEventListener("click", function () {
        setCategory(cat);
        document.getElementById("produce").scrollIntoView({ behavior: "smooth" });
      });
      categoryGrid.appendChild(card);
    });
    categoryGrid.querySelectorAll(".category-card").forEach(observeReveal);
  }

  /* ---- Filter chips ---- */
  function renderFilters() {
    filterBar.innerHTML = "";
    ["All"].concat(getCategories()).forEach(function (cat) {
      const chip = el("button", "chip" + (cat === state.activeCategory ? " is-active" : ""), cat);
      chip.type = "button";
      chip.setAttribute("aria-pressed", String(cat === state.activeCategory));
      chip.addEventListener("click", function () { setCategory(cat); });
      filterBar.appendChild(chip);
    });
  }

  function setCategory(cat) {
    state.activeCategory = cat;
    renderFilters();
    renderProducts();
  }

  /* ---- Product card ---- */
  function createProductCard(p) {
    const card = el("article", "product-card");

    // Image
    const media = el("div", "product-media");
    const img = document.createElement("img");
    img.src = p.image || PLACEHOLDER;
    img.alt = p.name;
    img.width = 800;
    img.height = 600;
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", function () {
      if (img.src !== PLACEHOLDER) img.src = PLACEHOLDER;
    });
    media.appendChild(img);
    media.appendChild(
      el("span", "product-badge" + (p.available ? "" : " is-out"), p.available ? "Available" : "Out of stock")
    );
    card.appendChild(media);

    // Body
    const body = el("div", "product-body");
    if (p.category) body.appendChild(el("p", "product-cat", p.category));
    body.appendChild(el("h3", "product-name", p.name));
    if (p.description) body.appendChild(el("p", "product-desc", p.description));

    // Actions
    const actions = el("div", "product-actions");

    const select = el("select", "qty-select");
    select.setAttribute("aria-label", "Quantity for " + p.name);
    CFG.quantityOptions.forEach(function (q) {
      const opt = el("option", "", q);
      opt.value = q;
      select.appendChild(opt);
    });
    select.selectedIndex = Math.min(1, CFG.quantityOptions.length - 1);

    const btn = el("a", "btn btn-primary");
    btn.appendChild(icon("i-chat"));

    if (p.available) {
      btn.appendChild(document.createTextNode("Order on WhatsApp"));
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
      const updateLink = function () {
        btn.href = buildWhatsAppUrl(productMessage(p.name, select.value));
      };
      select.addEventListener("change", updateLink);
      updateLink();
    } else {
      btn.appendChild(document.createTextNode("Currently unavailable"));
      btn.classList.add("is-disabled");
      btn.setAttribute("aria-disabled", "true");
      select.disabled = true;
    }

    actions.appendChild(select);
    actions.appendChild(btn);
    body.appendChild(actions);
    card.appendChild(body);

    return card;
  }

  /* ---- Product grid ---- */
  function renderProducts() {
    grid.innerHTML = "";
    const list = state.products.filter(function (p) {
      return state.activeCategory === "All" || p.category === state.activeCategory;
    });

    empty.hidden = list.length > 0;
    list.forEach(function (p) {
      const card = createProductCard(p);
      grid.appendChild(card);
      observeReveal(card);
    });
  }

  /* =========================================================
     Init
     ========================================================= */

  async function init() {
    initPage();
    initGeneralWhatsAppLinks();
    initReveal();
    renderSkeleton();

    try {
      state.products = await loadProducts();
      renderCategories();
      renderFilters();
      renderProducts();
    } catch (err) {
      console.error("GreenBasket: could not load products.", err);
      grid.innerHTML = "";
      empty.textContent = "We couldn't load the catalogue right now. Please order directly on WhatsApp.";
      empty.hidden = false;
    }
  }

  init();
})();
