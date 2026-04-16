// ============================================================
// APP.JS — State Management, Logic & Rendering
// Campus News CMS
// ============================================================

// ─── STATE ───────────────────────────────────────────────────
const State = {
  // Data
  articles: [],
  categories: [],
  tickers: [],
  settings: {},

  // UI State
  currentView: "home",       // home | article | admin
  adminTab: "dashboard",     // dashboard | articles | categories | tickers | settings
  currentArticleId: null,
  editingArticleId: null,
  editingCategoryId: null,

  // Filters
  searchQuery: "",
  activeCategory: "all",
  activeTag: null,
  currentPage: 1,
  articlesPerPage: 6,

  // Admin article form
  articleForm: {
    title: "", excerpt: "", content: "", category: "",
    tags: "", author: "", date: "", image: "", status: "draft", featured: false,
  },
};

// ─── STORAGE ─────────────────────────────────────────────────
const Storage = {
  KEYS: {
    articles: "cms_articles",
    categories: "cms_categories",
    tickers: "cms_tickers",
    settings: "cms_settings",
    initialized: "cms_initialized",
  },

  init() {
    if (!localStorage.getItem(this.KEYS.initialized)) {
      const d = window.DEFAULT_DATA;
      localStorage.setItem(this.KEYS.articles, JSON.stringify(d.articles));
      localStorage.setItem(this.KEYS.categories, JSON.stringify(d.categories));
      localStorage.setItem(this.KEYS.tickers, JSON.stringify(d.tickers));
      localStorage.setItem(this.KEYS.settings, JSON.stringify(d.settings));
      localStorage.setItem(this.KEYS.initialized, "1");
    }
    State.articles = JSON.parse(localStorage.getItem(this.KEYS.articles)) || [];
    State.categories = JSON.parse(localStorage.getItem(this.KEYS.categories)) || [];
    State.tickers = JSON.parse(localStorage.getItem(this.KEYS.tickers)) || [];
    State.settings = JSON.parse(localStorage.getItem(this.KEYS.settings)) || {};
  },

  save(key) {
    localStorage.setItem(this.KEYS[key], JSON.stringify(State[key]));
  },

  saveAll() {
    ["articles", "categories", "tickers", "settings"].forEach(k => this.save(k));
  },
};

// ─── UTILS ───────────────────────────────────────────────────
const Utils = {
  uid: () => "id-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
  slug: (str) => str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80),
  escapeHtml: (str) => str ? str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : "",
  formatDate: (dateStr) => {
    if (!dateStr) return "";
    const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
    const d = new Date(dateStr);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  },
  formatViews: (n) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n),
  truncate: (str, len) => str && str.length > len ? str.slice(0, len) + "…" : (str || ""),

  // Simple Markdown renderer
  renderMarkdown(md) {
    if (!md) return "";
    let html = Utils.escapeHtml(md);
    // Headers
    html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
    // Bold / Italic
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    // Blockquote
    html = html.replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>");
    // Unordered list
    html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
    html = html.replace(/<\/ul>\s*<ul>/gs, "");
    // Line breaks
    html = html.replace(/\n\n/g, "</p><p>");
    html = "<p>" + html + "</p>";
    html = html.replace(/<p>\s*<\/p>/g, "");
    html = html.replace(/<p>(<h[1-3]>)/g, "$1");
    html = html.replace(/(<\/h[1-3]>)<\/p>/g, "$1");
    html = html.replace(/<p>(<ul>)/g, "$1");
    html = html.replace(/(<\/ul>)<\/p>/g, "$1");
    html = html.replace(/<p>(<blockquote>)/g, "$1");
    html = html.replace(/(<\/blockquote>)<\/p>/g, "$1");
    return html;
  },
};

// ─── APPLY SETTINGS ──────────────────────────────────────────
function applySettings() {
  const s = State.settings;
  document.title = s.siteName || "KampusNews";
  document.getElementById("logo-text").textContent = s.logoText || "KN";
  document.getElementById("site-name").textContent = s.siteName || "KampusNews";
  document.getElementById("footer-site-name").textContent = s.siteName || "KampusNews";
  document.getElementById("footer-text").textContent = s.footerText || "";
  document.getElementById("footer-contact").textContent = s.contactEmail || "";
  const accent = s.accentColor || "#f97316";
  document.documentElement.style.setProperty("--accent", accent);
  document.documentElement.style.setProperty("--accent-rgb", hexToRgb(accent));
}

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1], 16)}, ${parseInt(r[2], 16)}, ${parseInt(r[3], 16)}` : "249, 115, 22";
}

// ─── TICKER ──────────────────────────────────────────────────
function renderTicker() {
  const active = State.tickers.filter(t => t.active);
  const el = document.getElementById("ticker-content");
  if (!active.length) { document.getElementById("ticker-bar").style.display = "none"; return; }
  document.getElementById("ticker-bar").style.display = "flex";
  el.innerHTML = active.map(t => `<span class="ticker-item">${Utils.escapeHtml(t.text)}</span>`).join('<span class="ticker-sep">●</span>');
}

// ─── NAVIGATION ──────────────────────────────────────────────
function navigate(view, params = {}) {
  State.currentView = view;
  if (params.articleId) State.currentArticleId = params.articleId;
  if (params.category !== undefined) { State.activeCategory = params.category; State.currentPage = 1; }
  if (params.tag !== undefined) { State.activeTag = params.tag; State.activeCategory = "all"; State.currentPage = 1; }
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderApp();
}

// ─── MAIN RENDER ─────────────────────────────────────────────
function renderApp() {
  const app = document.getElementById("app");
  const nav = document.getElementById("main-nav");
  const footer = document.getElementById("main-footer");
  const tickerBar = document.getElementById("ticker-bar");
  const adminPanel = document.getElementById("admin-panel");

  if (State.currentView === "admin") {
    app.style.display = "none";
    footer.style.display = "none";
    tickerBar.style.display = "none";
    nav.style.display = "none";
    adminPanel.style.display = "flex";
    renderAdmin();
  } else {
    app.style.display = "block";
    footer.style.display = "block";
    nav.style.display = "flex";
    adminPanel.style.display = "none";
    renderTicker();

    if (State.currentView === "article") {
      renderArticlePage();
    } else {
      renderHomePage();
    }
  }
}

// ─── HOME PAGE ───────────────────────────────────────────────
function renderHomePage() {
  const app = document.getElementById("app");
  const published = State.articles.filter(a => a.status === "published");

  // Filter
  let filtered = published;
  if (State.activeCategory !== "all") filtered = filtered.filter(a => a.category === State.activeCategory);
  if (State.activeTag) filtered = filtered.filter(a => a.tags && a.tags.includes(State.activeTag));
  if (State.searchQuery) {
    const q = State.searchQuery.toLowerCase();
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      (a.tags && a.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  const featured = published.filter(a => a.featured);
  const totalPages = Math.ceil(filtered.length / State.articlesPerPage);
  const paginated = filtered.slice((State.currentPage - 1) * State.articlesPerPage, State.currentPage * State.articlesPerPage);

  app.innerHTML = `
    ${renderHero(featured)}
    <main class="main-content">
      ${renderFilters()}
      ${renderSearchResultsHeader(filtered.length)}
      ${renderArticleGrid(paginated)}
      ${renderPagination(totalPages)}
      ${renderPopularTags()}
    </main>
  `;

  // Bind search
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.value = State.searchQuery;
    searchInput.addEventListener("input", (e) => {
      State.searchQuery = e.target.value;
      State.currentPage = 1;
      renderHomePage();
    });
  }
}

function renderHero(featured) {
  if (!featured.length) return "";
  const main = featured[0];
  const rest = featured.slice(1, 4);
  const cat = State.categories.find(c => c.id === main.category);

  return `
  <section class="hero">
    <div class="hero-main" onclick="navigate('article', {articleId: '${main.id}'})" style="cursor:pointer">
      <img src="${Utils.escapeHtml(main.image)}" alt="" class="hero-main-img" onerror="this.src='https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80'">
      <div class="hero-main-overlay">
        <div class="hero-main-content">
          ${cat ? `<span class="badge" style="--badge-color:${cat.color}">${cat.name}</span>` : ""}
          <h1 class="hero-main-title">${Utils.escapeHtml(main.title)}</h1>
          <p class="hero-main-excerpt">${Utils.escapeHtml(main.excerpt)}</p>
          <div class="hero-meta">
            <span>✍ ${Utils.escapeHtml(main.author)}</span>
            <span>📅 ${Utils.formatDate(main.date)}</span>
            <span>👁 ${Utils.formatViews(main.views)}</span>
          </div>
        </div>
      </div>
    </div>
    ${rest.length ? `
    <div class="hero-side">
      ${rest.map(a => {
        const c = State.categories.find(c => c.id === a.category);
        return `
        <div class="hero-side-card" onclick="navigate('article', {articleId: '${a.id}'})" style="cursor:pointer">
          <img src="${Utils.escapeHtml(a.image)}" alt="" class="hero-side-img" onerror="this.src='https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80'">
          <div class="hero-side-content">
            ${c ? `<span class="badge badge-sm" style="--badge-color:${c.color}">${c.name}</span>` : ""}
            <h3 class="hero-side-title">${Utils.escapeHtml(Utils.truncate(a.title, 70))}</h3>
            <span class="hero-side-date">${Utils.formatDate(a.date)}</span>
          </div>
        </div>`;
      }).join("")}
    </div>` : ""}
  </section>`;
}

function renderFilters() {
  const cats = [{ id: "all", name: "Semua", color: "#94a3b8" }, ...State.categories];
  return `
  <div class="filters-bar">
    <div class="filter-categories">
      ${cats.map(c => `
        <button class="filter-btn ${State.activeCategory === c.id ? "active" : ""}"
          style="${State.activeCategory === c.id ? `--btn-active:${c.color}` : ""}"
          onclick="navigate('home', {category:'${c.id}'})">
          ${c.name}
        </button>`).join("")}
    </div>
    <div class="search-wrap">
      <span class="search-icon">🔍</span>
      <input id="search-input" type="text" placeholder="Cari berita…" class="search-input" value="${Utils.escapeHtml(State.searchQuery)}">
      ${State.searchQuery ? `<button class="search-clear" onclick="clearSearch()">✕</button>` : ""}
    </div>
  </div>`;
}

function clearSearch() {
  State.searchQuery = "";
  State.currentPage = 1;
  renderHomePage();
}

function renderSearchResultsHeader(count) {
  if (!State.searchQuery && State.activeCategory === "all" && !State.activeTag) return '<div class="section-title">Berita Terbaru</div>';
  let label = "";
  if (State.searchQuery) label = `Hasil pencarian "${State.searchQuery}"`;
  else if (State.activeTag) label = `Tag: #${State.activeTag}`;
  else {
    const cat = State.categories.find(c => c.id === State.activeCategory);
    label = cat ? `Kategori: ${cat.name}` : "Semua Berita";
  }
  return `<div class="section-title">${label} <span class="count-badge">${count} artikel</span></div>`;
}

function renderArticleGrid(articles) {
  if (!articles.length) return `<div class="empty-state"><div class="empty-icon">📭</div><p>Tidak ada artikel yang ditemukan.</p></div>`;
  return `<div class="article-grid">${articles.map(a => renderArticleCard(a)).join("")}</div>`;
}

function renderArticleCard(a) {
  const cat = State.categories.find(c => c.id === a.category);
  return `
  <article class="card" onclick="openArticle('${a.id}')" style="cursor:pointer">
    <div class="card-img-wrap">
      <img src="${Utils.escapeHtml(a.image)}" alt="" class="card-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80'">
      ${cat ? `<span class="card-badge" style="--badge-color:${cat.color}">${cat.name}</span>` : ""}
      ${a.featured ? `<span class="card-featured-badge">⭐ Unggulan</span>` : ""}
    </div>
    <div class="card-body">
      <h2 class="card-title">${Utils.escapeHtml(Utils.truncate(a.title, 80))}</h2>
      <p class="card-excerpt">${Utils.escapeHtml(Utils.truncate(a.excerpt, 120))}</p>
      <div class="card-meta">
        <span>✍ ${Utils.escapeHtml(a.author)}</span>
        <span>📅 ${Utils.formatDate(a.date)}</span>
        <span>👁 ${Utils.formatViews(a.views || 0)}</span>
      </div>
      ${a.tags && a.tags.length ? `<div class="card-tags">${a.tags.slice(0,3).map(t => `<span class="tag" onclick="event.stopPropagation();filterByTag('${t}')">#${Utils.escapeHtml(t)}</span>`).join("")}</div>` : ""}
    </div>
  </article>`;
}

function openArticle(id) {
  // Increment views
  const idx = State.articles.findIndex(a => a.id === id);
  if (idx !== -1) {
    State.articles[idx].views = (State.articles[idx].views || 0) + 1;
    Storage.save("articles");
  }
  navigate("article", { articleId: id });
}

function filterByTag(tag) {
  State.activeTag = tag;
  State.activeCategory = "all";
  State.searchQuery = "";
  State.currentPage = 1;
  navigate("home");
}

function renderPagination(totalPages) {
  if (totalPages <= 1) return "";
  const p = State.currentPage;
  let pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= p - 1 && i <= p + 1)) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }
  return `
  <div class="pagination">
    <button class="page-btn" ${p === 1 ? "disabled" : ""} onclick="changePage(${p - 1})">← Prev</button>
    ${pages.map(pg => pg === "…"
      ? `<span class="page-ellipsis">…</span>`
      : `<button class="page-btn ${pg === p ? "active" : ""}" onclick="changePage(${pg})">${pg}</button>`
    ).join("")}
    <button class="page-btn" ${p === totalPages ? "disabled" : ""} onclick="changePage(${p + 1})">Next →</button>
  </div>`;
}

function changePage(p) {
  State.currentPage = p;
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderHomePage();
}

function renderPopularTags() {
  const tagCount = {};
  State.articles.filter(a => a.status === "published").forEach(a => {
    (a.tags || []).forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; });
  });
  const sorted = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 15);
  if (!sorted.length) return "";
  return `
  <div class="popular-tags">
    <div class="section-title">Tag Populer</div>
    <div class="tags-cloud">
      ${sorted.map(([t, n]) => `<button class="tag-cloud-btn ${State.activeTag === t ? "active" : ""}" onclick="filterByTag('${Utils.escapeHtml(t)}')">#${Utils.escapeHtml(t)} <span>(${n})</span></button>`).join("")}
    </div>
  </div>`;
}

// ─── ARTICLE PAGE ────────────────────────────────────────────
function renderArticlePage() {
  const app = document.getElementById("app");
  const a = State.articles.find(x => x.id === State.currentArticleId);
  if (!a) { navigate("home"); return; }

  const cat = State.categories.find(c => c.id === a.category);
  const related = State.articles
    .filter(x => x.status === "published" && x.id !== a.id && x.category === a.category)
    .slice(0, 3);

  app.innerHTML = `
  <main class="article-page">
    <div class="article-container">
      <nav class="breadcrumb">
        <button onclick="navigate('home')" class="breadcrumb-link">🏠 Beranda</button>
        <span>/</span>
        ${cat ? `<button onclick="navigate('home',{category:'${cat.id}'})" class="breadcrumb-link" style="color:${cat.color}">${cat.name}</button><span>/</span>` : ""}
        <span class="breadcrumb-current">${Utils.escapeHtml(Utils.truncate(a.title, 40))}</span>
      </nav>

      <article class="article-full">
        <header class="article-header">
          ${cat ? `<span class="badge" style="--badge-color:${cat.color}">${cat.name}</span>` : ""}
          ${a.featured ? `<span class="badge" style="--badge-color:#f59e0b">⭐ Artikel Unggulan</span>` : ""}
          <h1 class="article-title">${Utils.escapeHtml(a.title)}</h1>
          <p class="article-excerpt">${Utils.escapeHtml(a.excerpt)}</p>
          <div class="article-meta-bar">
            <span>✍ <strong>${Utils.escapeHtml(a.author)}</strong></span>
            <span>📅 ${Utils.formatDate(a.date)}</span>
            <span>👁 ${Utils.formatViews(a.views || 0)} views</span>
          </div>
        </header>

        <div class="article-hero-img-wrap">
          <img src="${Utils.escapeHtml(a.image)}" alt="${Utils.escapeHtml(a.title)}" class="article-hero-img" onerror="this.src='https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80'">
        </div>

        <div class="article-body">
          ${Utils.renderMarkdown(a.content)}
        </div>

        ${a.tags && a.tags.length ? `
        <div class="article-tags">
          <strong>Tag:</strong>
          ${a.tags.map(t => `<button class="tag" onclick="filterByTag('${Utils.escapeHtml(t)}')">#${Utils.escapeHtml(t)}</button>`).join("")}
        </div>` : ""}
      </article>

      ${related.length ? `
      <section class="related-articles">
        <div class="section-title">Artikel Terkait</div>
        <div class="article-grid related-grid">
          ${related.map(r => renderArticleCard(r)).join("")}
        </div>
      </section>` : ""}
    </div>
  </main>`;
}

// ─── ADMIN ───────────────────────────────────────────────────
function renderAdmin() {
  const panel = document.getElementById("admin-panel");
  panel.innerHTML = `
  <aside class="admin-sidebar">
    <div class="admin-logo">
      <span class="admin-logo-icon">${Utils.escapeHtml(State.settings.logoText || "KN")}</span>
      <div>
        <div class="admin-logo-title">${Utils.escapeHtml(State.settings.siteName || "KampusNews")}</div>
        <div class="admin-logo-sub">Admin Panel</div>
      </div>
    </div>
    <nav class="admin-nav">
      ${[
        ["dashboard", "📊", "Dashboard"],
        ["articles", "📰", "Artikel"],
        ["categories", "🏷️", "Kategori"],
        ["tickers", "📢", "Running Text"],
        ["settings", "⚙️", "Pengaturan"],
      ].map(([tab, icon, label]) => `
        <button class="admin-nav-btn ${State.adminTab === tab ? "active" : ""}" onclick="switchAdminTab('${tab}')">
          <span>${icon}</span> ${label}
        </button>`).join("")}
    </nav>
    <button class="admin-nav-btn exit-btn" onclick="navigate('home')">
      <span>🚪</span> Keluar Admin
    </button>
  </aside>
  <main class="admin-main">
    <div id="admin-content">
      ${renderAdminContent()}
    </div>
  </main>`;
}

function switchAdminTab(tab) {
  State.adminTab = tab;
  State.editingArticleId = null;
  document.getElementById("admin-content").innerHTML = renderAdminContent();
}

function renderAdminContent() {
  switch (State.adminTab) {
    case "dashboard": return renderDashboard();
    case "articles": return State.editingArticleId !== null ? renderArticleEditor() : renderArticlesList();
    case "categories": return renderCategoriesManager();
    case "tickers": return renderTickersManager();
    case "settings": return renderSettingsPanel();
    default: return "";
  }
}

// Dashboard
function renderDashboard() {
  const published = State.articles.filter(a => a.status === "published").length;
  const drafts = State.articles.filter(a => a.status === "draft").length;
  const featured = State.articles.filter(a => a.featured).length;
  const totalViews = State.articles.reduce((s, a) => s + (a.views || 0), 0);
  const recent = [...State.articles].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  // Category distribution
  const catDist = State.categories.map(c => ({
    ...c,
    count: State.articles.filter(a => a.category === c.id && a.status === "published").length,
  })).filter(c => c.count > 0).sort((a, b) => b.count - a.count);

  return `
  <div class="admin-page-header">
    <h1>Dashboard</h1>
    <p>Selamat datang di panel admin KampusNews</p>
  </div>

  <div class="stats-grid">
    <div class="stat-card stat-blue">
      <div class="stat-icon">📰</div>
      <div class="stat-value">${published}</div>
      <div class="stat-label">Artikel Publik</div>
    </div>
    <div class="stat-card stat-yellow">
      <div class="stat-icon">📝</div>
      <div class="stat-value">${drafts}</div>
      <div class="stat-label">Draft</div>
    </div>
    <div class="stat-card stat-green">
      <div class="stat-icon">⭐</div>
      <div class="stat-value">${featured}</div>
      <div class="stat-label">Artikel Unggulan</div>
    </div>
    <div class="stat-card stat-orange">
      <div class="stat-icon">👁</div>
      <div class="stat-value">${Utils.formatViews(totalViews)}</div>
      <div class="stat-label">Total Views</div>
    </div>
  </div>

  <div class="dash-grid">
    <div class="dash-card">
      <h3>Artikel Terbaru</h3>
      <table class="dash-table">
        <thead><tr><th>Judul</th><th>Status</th><th>Views</th></tr></thead>
        <tbody>
          ${recent.map(a => `
          <tr>
            <td>${Utils.escapeHtml(Utils.truncate(a.title, 45))}</td>
            <td><span class="status-badge status-${a.status}">${a.status === "published" ? "Publik" : "Draft"}</span></td>
            <td>${Utils.formatViews(a.views || 0)}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
    <div class="dash-card">
      <h3>Distribusi Kategori</h3>
      ${catDist.map(c => `
      <div class="cat-dist-row">
        <span class="cat-dot" style="background:${c.color}"></span>
        <span class="cat-dist-name">${c.name}</span>
        <div class="cat-dist-bar-wrap">
          <div class="cat-dist-bar" style="width:${Math.round(c.count / published * 100) || 0}%;background:${c.color}"></div>
        </div>
        <span class="cat-dist-num">${c.count}</span>
      </div>`).join("")}
    </div>
  </div>`;
}

// Articles List (Admin)
function renderArticlesList() {
  const q = document.getElementById("admin-art-search")?.value?.toLowerCase() || "";
  const statusFilter = document.getElementById("admin-art-status")?.value || "all";
  let list = [...State.articles].sort((a, b) => new Date(b.date) - new Date(a.date));
  if (q) list = list.filter(a => a.title.toLowerCase().includes(q));
  if (statusFilter !== "all") list = list.filter(a => a.status === statusFilter);

  return `
  <div class="admin-page-header">
    <div>
      <h1>Manajemen Artikel</h1>
      <p>${State.articles.length} artikel total</p>
    </div>
    <button class="btn-primary" onclick="openNewArticle()">+ Artikel Baru</button>
  </div>

  <div class="admin-toolbar">
    <input id="admin-art-search" type="text" placeholder="Cari artikel…" class="admin-input" oninput="refreshArticlesList()" value="${Utils.escapeHtml(q)}">
    <select id="admin-art-status" class="admin-select" onchange="refreshArticlesList()">
      <option value="all" ${statusFilter === "all" ? "selected" : ""}>Semua Status</option>
      <option value="published" ${statusFilter === "published" ? "selected" : ""}>Publik</option>
      <option value="draft" ${statusFilter === "draft" ? "selected" : ""}>Draft</option>
    </select>
  </div>

  <div class="articles-admin-list">
    ${!list.length ? `<div class="empty-state"><div class="empty-icon">📭</div><p>Tidak ada artikel.</p></div>` :
    list.map(a => {
      const cat = State.categories.find(c => c.id === a.category);
      return `
      <div class="art-admin-card">
        <img src="${Utils.escapeHtml(a.image)}" alt="" class="art-admin-thumb" onerror="this.src='https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&q=60'">
        <div class="art-admin-info">
          <div class="art-admin-title">${Utils.escapeHtml(Utils.truncate(a.title, 70))}</div>
          <div class="art-admin-meta">
            ${cat ? `<span class="badge-sm" style="background:${cat.color}20;color:${cat.color}">${cat.name}</span>` : ""}
            <span class="status-badge status-${a.status}">${a.status === "published" ? "Publik" : "Draft"}</span>
            ${a.featured ? `<span class="status-badge status-featured">⭐ Unggulan</span>` : ""}
            <span>📅 ${Utils.formatDate(a.date)}</span>
            <span>👁 ${Utils.formatViews(a.views || 0)}</span>
          </div>
        </div>
        <div class="art-admin-actions">
          <button class="btn-icon btn-view" onclick="viewArticleFromAdmin('${a.id}')" title="Lihat">👁</button>
          <button class="btn-icon btn-edit" onclick="editArticle('${a.id}')" title="Edit">✏️</button>
          <button class="btn-icon btn-delete" onclick="deleteArticle('${a.id}')" title="Hapus">🗑️</button>
        </div>
      </div>`;
    }).join("")}
  </div>`;
}

function refreshArticlesList() {
  document.getElementById("admin-content").innerHTML = renderAdminContent();
}

function openNewArticle() {
  State.editingArticleId = "new";
  State.articleForm = {
    title: "", excerpt: "", content: "", category: State.categories[0]?.id || "",
    tags: "", author: "Redaksi KampusNews",
    date: new Date().toISOString().split("T")[0],
    image: "", status: "draft", featured: false,
  };
  document.getElementById("admin-content").innerHTML = renderAdminContent();
}

function editArticle(id) {
  const a = State.articles.find(x => x.id === id);
  if (!a) return;
  State.editingArticleId = id;
  State.articleForm = { ...a, tags: (a.tags || []).join(", ") };
  document.getElementById("admin-content").innerHTML = renderAdminContent();
}

function viewArticleFromAdmin(id) {
  State.currentArticleId = id;
  State.currentView = "article";
  navigate("article", { articleId: id });
}

function deleteArticle(id) {
  if (!confirm("Hapus artikel ini?")) return;
  State.articles = State.articles.filter(a => a.id !== id);
  Storage.save("articles");
  document.getElementById("admin-content").innerHTML = renderAdminContent();
}

// Article Editor
function renderArticleEditor() {
  const f = State.articleForm;
  const isNew = State.editingArticleId === "new";
  return `
  <div class="admin-page-header">
    <div>
      <button class="btn-back" onclick="State.editingArticleId=null;switchAdminTab('articles')">← Kembali</button>
      <h1>${isNew ? "Artikel Baru" : "Edit Artikel"}</h1>
    </div>
    <div class="editor-actions">
      <button class="btn-secondary" onclick="saveArticle('draft')">💾 Simpan Draft</button>
      <button class="btn-primary" onclick="saveArticle('published')">🚀 Publikasi</button>
    </div>
  </div>

  <div class="editor-layout">
    <div class="editor-main">
      <div class="form-group">
        <label>Judul Artikel *</label>
        <input type="text" id="art-title" class="admin-input" placeholder="Tulis judul yang menarik…" value="${Utils.escapeHtml(f.title || "")}" oninput="State.articleForm.title=this.value">
      </div>
      <div class="form-group">
        <label>Ringkasan / Excerpt *</label>
        <textarea id="art-excerpt" class="admin-textarea" rows="3" placeholder="Deskripsi singkat artikel (tampil di kartu berita)…" oninput="State.articleForm.excerpt=this.value">${Utils.escapeHtml(f.excerpt || "")}</textarea>
      </div>
      <div class="form-group">
        <label>Konten Artikel (Markdown) *</label>
        <div class="md-toolbar">
          <button class="md-btn" onclick="insertMd('## Heading 2')" title="Heading">H2</button>
          <button class="md-btn" onclick="insertMd('### Heading 3')" title="Sub-heading">H3</button>
          <button class="md-btn" onclick="wrapMd('**','**')" title="Bold"><strong>B</strong></button>
          <button class="md-btn" onclick="wrapMd('*','*')" title="Italic"><em>I</em></button>
          <button class="md-btn" onclick="insertMd('> Kutipan teks di sini')" title="Quote">❝</button>
          <button class="md-btn" onclick="insertMd('- Item list')" title="List">≡</button>
          <button class="md-btn preview-toggle" onclick="togglePreview()">👁 Preview</button>
        </div>
        <div id="md-editor-wrap">
          <textarea id="art-content" class="admin-textarea md-editor" rows="18" placeholder="Tulis konten artikel dalam format Markdown…" oninput="State.articleForm.content=this.value;updateMdPreview()">${Utils.escapeHtml(f.content || "")}</textarea>
          <div id="md-preview" class="md-preview article-body" style="display:none"></div>
        </div>
      </div>
    </div>

    <aside class="editor-sidebar">
      <div class="editor-section">
        <h3>📋 Meta Artikel</h3>
        <div class="form-group">
          <label>Penulis</label>
          <input type="text" id="art-author" class="admin-input" value="${Utils.escapeHtml(f.author || "")}" oninput="State.articleForm.author=this.value">
        </div>
        <div class="form-group">
          <label>Tanggal</label>
          <input type="date" id="art-date" class="admin-input" value="${f.date || ""}" oninput="State.articleForm.date=this.value">
        </div>
        <div class="form-group">
          <label>Kategori</label>
          <select id="art-category" class="admin-select" onchange="State.articleForm.category=this.value">
            <option value="">-- Pilih Kategori --</option>
            ${State.categories.map(c => `<option value="${c.id}" ${f.category === c.id ? "selected" : ""}>${c.name}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Tags (pisahkan koma)</label>
          <input type="text" id="art-tags" class="admin-input" placeholder="ai, inovasi, kampus" value="${Utils.escapeHtml(f.tags || "")}" oninput="State.articleForm.tags=this.value">
        </div>
      </div>

      <div class="editor-section">
        <h3>🖼️ Gambar Utama</h3>
        <div class="form-group">
          <label>URL Gambar</label>
          <input type="text" id="art-image" class="admin-input" placeholder="https://…" value="${Utils.escapeHtml(f.image || "")}" oninput="State.articleForm.image=this.value;updateImgPreview()">
        </div>
        <div class="form-group">
          <label>Upload Gambar</label>
          <input type="file" id="art-image-file" class="admin-input" accept="image/*" onchange="handleImageUpload(this)">
        </div>
        <div id="img-preview-wrap" class="${f.image ? "" : "hidden"}">
          <img id="img-preview" src="${Utils.escapeHtml(f.image || "")}" alt="" class="img-preview">
        </div>
      </div>

      <div class="editor-section">
        <h3>📡 Publikasi</h3>
        <div class="toggle-row">
          <label>Tampilkan di Hero</label>
          <label class="toggle">
            <input type="checkbox" id="art-featured" ${f.featured ? "checked" : ""} onchange="State.articleForm.featured=this.checked">
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="status-display">
          Status: <span class="status-badge status-${f.status}">${f.status === "published" ? "Publik" : "Draft"}</span>
        </div>
      </div>
    </aside>
  </div>`;
}

function saveArticle(status) {
  const f = State.articleForm;
  if (!f.title.trim()) { alert("Judul artikel tidak boleh kosong!"); return; }
  if (!f.excerpt.trim()) { alert("Ringkasan artikel tidak boleh kosong!"); return; }
  if (!f.content.trim()) { alert("Konten artikel tidak boleh kosong!"); return; }

  const tags = f.tags ? f.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
  const now = new Date().toISOString().split("T")[0];

  if (State.editingArticleId === "new") {
    const newArt = {
      id: Utils.uid(), slug: Utils.slug(f.title),
      title: f.title, excerpt: f.excerpt, content: f.content,
      category: f.category, tags, author: f.author || "Redaksi",
      date: f.date || now, image: f.image,
      status, featured: f.featured, views: 0,
    };
    State.articles.unshift(newArt);
  } else {
    const idx = State.articles.findIndex(a => a.id === State.editingArticleId);
    if (idx !== -1) {
      State.articles[idx] = {
        ...State.articles[idx],
        title: f.title, excerpt: f.excerpt, content: f.content,
        category: f.category, tags, author: f.author,
        date: f.date, image: f.image, status, featured: f.featured,
      };
    }
  }
  Storage.save("articles");
  State.editingArticleId = null;
  switchAdminTab("articles");
  showToast("Artikel berhasil disimpan!");
}

function insertMd(text) {
  const el = document.getElementById("art-content");
  if (!el) return;
  const s = el.selectionStart;
  const before = el.value.substring(0, s);
  const after = el.value.substring(el.selectionEnd);
  el.value = before + "\n" + text + "\n" + after;
  State.articleForm.content = el.value;
  el.focus();
}

function wrapMd(pre, post) {
  const el = document.getElementById("art-content");
  if (!el) return;
  const s = el.selectionStart, e = el.selectionEnd;
  const selected = el.value.substring(s, e) || "teks";
  el.value = el.value.substring(0, s) + pre + selected + post + el.value.substring(e);
  State.articleForm.content = el.value;
  el.focus();
}

let previewMode = false;
function togglePreview() {
  previewMode = !previewMode;
  const editor = document.getElementById("art-content");
  const preview = document.getElementById("md-preview");
  if (!editor || !preview) return;
  if (previewMode) {
    preview.innerHTML = Utils.renderMarkdown(editor.value);
    preview.style.display = "block";
    editor.style.display = "none";
  } else {
    preview.style.display = "none";
    editor.style.display = "block";
  }
}

function updateMdPreview() {
  const preview = document.getElementById("md-preview");
  if (preview && previewMode) {
    preview.innerHTML = Utils.renderMarkdown(State.articleForm.content);
  }
}

function updateImgPreview() {
  const wrap = document.getElementById("img-preview-wrap");
  const img = document.getElementById("img-preview");
  const url = State.articleForm.image;
  if (wrap && img) {
    if (url) { img.src = url; wrap.classList.remove("hidden"); }
    else { wrap.classList.add("hidden"); }
  }
}

function handleImageUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    State.articleForm.image = e.target.result;
    const imgInput = document.getElementById("art-image");
    if (imgInput) imgInput.value = "(file lokal — tidak bisa disimpan permanen)";
    const wrap = document.getElementById("img-preview-wrap");
    const img = document.getElementById("img-preview");
    if (wrap && img) { img.src = e.target.result; wrap.classList.remove("hidden"); }
  };
  reader.readAsDataURL(file);
}

// Categories Manager
function renderCategoriesManager() {
  return `
  <div class="admin-page-header">
    <h1>Manajemen Kategori</h1>
  </div>
  <div class="cat-manager">
    <div class="cat-add-form">
      <h3>Tambah Kategori Baru</h3>
      <div class="cat-add-row">
        <input type="text" id="new-cat-name" class="admin-input" placeholder="Nama kategori…">
        <input type="color" id="new-cat-color" class="admin-color" value="#3b82f6">
        <button class="btn-primary" onclick="addCategory()">+ Tambah</button>
      </div>
    </div>
    <div class="cat-list">
      ${State.categories.map(c => {
        const count = State.articles.filter(a => a.category === c.id).length;
        return `
        <div class="cat-row">
          <span class="cat-color-dot" style="background:${c.color}"></span>
          <span class="cat-name">${Utils.escapeHtml(c.name)}</span>
          <input type="color" class="admin-color" value="${c.color}" onchange="updateCategoryColor('${c.id}', this.value)" title="Ubah warna">
          <span class="cat-count">${count} artikel</span>
          <button class="btn-icon btn-delete" onclick="deleteCategory('${c.id}')" ${count > 0 ? 'title="Hapus (perlu pindahkan artikel terlebih dahulu)"' : 'title="Hapus"'}>🗑️</button>
        </div>`;
      }).join("")}
    </div>
  </div>`;
}

function addCategory() {
  const name = document.getElementById("new-cat-name")?.value?.trim();
  const color = document.getElementById("new-cat-color")?.value || "#3b82f6";
  if (!name) { alert("Nama kategori tidak boleh kosong!"); return; }
  if (State.categories.find(c => c.name.toLowerCase() === name.toLowerCase())) { alert("Kategori sudah ada!"); return; }
  State.categories.push({ id: Utils.uid(), name, color, slug: Utils.slug(name) });
  Storage.save("categories");
  switchAdminTab("categories");
  showToast("Kategori berhasil ditambahkan!");
}

function updateCategoryColor(id, color) {
  const c = State.categories.find(c => c.id === id);
  if (c) { c.color = color; Storage.save("categories"); }
}

function deleteCategory(id) {
  const count = State.articles.filter(a => a.category === id).length;
  if (count > 0) { alert(`Kategori ini digunakan oleh ${count} artikel. Harap pindahkan artikel terlebih dahulu.`); return; }
  if (!confirm("Hapus kategori ini?")) return;
  State.categories = State.categories.filter(c => c.id !== id);
  Storage.save("categories");
  switchAdminTab("categories");
  showToast("Kategori dihapus.");
}

// Tickers Manager
function renderTickersManager() {
  return `
  <div class="admin-page-header">
    <h1>Manajemen Running Text</h1>
  </div>
  <div class="ticker-manager">
    <div class="ticker-add-form">
      <h3>Tambah Running Text</h3>
      <div class="ticker-add-row">
        <input type="text" id="new-ticker-text" class="admin-input" placeholder="Teks berita berjalan…">
        <button class="btn-primary" onclick="addTicker()">+ Tambah</button>
      </div>
    </div>
    <div class="ticker-list">
      ${!State.tickers.length ? `<div class="empty-state"><p>Belum ada running text.</p></div>` :
      State.tickers.map((t, i) => `
        <div class="ticker-row">
          <label class="toggle" title="${t.active ? "Aktif — klik untuk nonaktifkan" : "Nonaktif — klik untuk aktifkan"}">
            <input type="checkbox" ${t.active ? "checked" : ""} onchange="toggleTicker('${t.id}')">
            <span class="toggle-slider"></span>
          </label>
          <input type="text" class="admin-input ticker-edit-input" value="${Utils.escapeHtml(t.text)}" onchange="updateTicker('${t.id}', this.value)">
          <button class="btn-icon btn-delete" onclick="deleteTicker('${t.id}')">🗑️</button>
        </div>`).join("")}
    </div>
  </div>`;
}

function addTicker() {
  const text = document.getElementById("new-ticker-text")?.value?.trim();
  if (!text) { alert("Teks tidak boleh kosong!"); return; }
  State.tickers.push({ id: Utils.uid(), text, active: true });
  Storage.save("tickers");
  switchAdminTab("tickers");
  showToast("Running text ditambahkan!");
}

function toggleTicker(id) {
  const t = State.tickers.find(t => t.id === id);
  if (t) { t.active = !t.active; Storage.save("tickers"); renderTicker(); }
}

function updateTicker(id, text) {
  const t = State.tickers.find(t => t.id === id);
  if (t) { t.text = text; Storage.save("tickers"); renderTicker(); }
}

function deleteTicker(id) {
  if (!confirm("Hapus running text ini?")) return;
  State.tickers = State.tickers.filter(t => t.id !== id);
  Storage.save("tickers");
  switchAdminTab("tickers");
  renderTicker();
  showToast("Running text dihapus.");
}

// Settings Panel
function renderSettingsPanel() {
  const s = State.settings;
  return `
  <div class="admin-page-header">
    <h1>Pengaturan Website</h1>
  </div>
  <div class="settings-grid">
    <div class="settings-card">
      <h3>🏫 Identitas Website</h3>
      <div class="form-group">
        <label>Nama Website</label>
        <input type="text" id="set-name" class="admin-input" value="${Utils.escapeHtml(s.siteName || "")}" placeholder="Nama portal berita">
      </div>
      <div class="form-group">
        <label>Logo Text (2-3 karakter)</label>
        <input type="text" id="set-logo" class="admin-input" value="${Utils.escapeHtml(s.logoText || "")}" maxlength="3" placeholder="KN">
      </div>
      <div class="form-group">
        <label>Tagline</label>
        <input type="text" id="set-tagline" class="admin-input" value="${Utils.escapeHtml(s.tagline || "")}" placeholder="Tagline portal">
      </div>
    </div>
    <div class="settings-card">
      <h3>📩 Kontak & Footer</h3>
      <div class="form-group">
        <label>Email Kontak</label>
        <input type="email" id="set-email" class="admin-input" value="${Utils.escapeHtml(s.contactEmail || "")}" placeholder="redaksi@kampus.ac.id">
      </div>
      <div class="form-group">
        <label>Teks Footer</label>
        <input type="text" id="set-footer" class="admin-input" value="${Utils.escapeHtml(s.footerText || "")}" placeholder="© 2025 KampusNews">
      </div>
    </div>
    <div class="settings-card">
      <h3>🎨 Kustomisasi Warna</h3>
      <div class="form-group">
        <label>Warna Aksen (Accent Color)</label>
        <div class="color-pick-row">
          <input type="color" id="set-accent" class="admin-color admin-color-lg" value="${s.accentColor || "#f97316"}">
          <div class="color-presets">
            ${["#f97316","#3b82f6","#10b981","#8b5cf6","#ef4444","#f59e0b","#06b6d4","#ec4899"].map(c =>
              `<button class="color-preset ${s.accentColor === c ? "active" : ""}" style="background:${c}" onclick="setAccentPreset('${c}')"></button>`
            ).join("")}
          </div>
        </div>
      </div>
      <div class="accent-preview">
        <span>Preview: </span>
        <button class="btn-primary" id="accent-preview-btn">Tombol Aksen</button>
      </div>
    </div>
  </div>
  <div class="settings-save-row">
    <button class="btn-primary btn-lg" onclick="saveSettings()">💾 Simpan Semua Pengaturan</button>
  </div>`;
}

function setAccentPreset(color) {
  const input = document.getElementById("set-accent");
  if (input) input.value = color;
  // Live preview
  document.documentElement.style.setProperty("--accent", color);
  document.documentElement.style.setProperty("--accent-rgb", hexToRgb(color));
  // Update active state
  document.querySelectorAll(".color-preset").forEach(b => {
    b.classList.toggle("active", b.style.background === color || b.style.backgroundColor === color);
  });
}

function saveSettings() {
  State.settings = {
    siteName: document.getElementById("set-name")?.value || "",
    logoText: document.getElementById("set-logo")?.value || "",
    tagline: document.getElementById("set-tagline")?.value || "",
    contactEmail: document.getElementById("set-email")?.value || "",
    footerText: document.getElementById("set-footer")?.value || "",
    accentColor: document.getElementById("set-accent")?.value || "#f97316",
  };
  Storage.save("settings");
  applySettings();
  showToast("Pengaturan berhasil disimpan!");
}

// ─── TOAST ───────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

// ─── BOOT ────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  Storage.init();
  applySettings();
  renderApp();
});

// Expose functions to window for inline handlers
Object.assign(window, {
  navigate, openArticle, filterByTag, changePage, clearSearch,
  switchAdminTab, openNewArticle, editArticle, deleteArticle,
  viewArticleFromAdmin, saveArticle, insertMd, wrapMd, togglePreview,
  updateMdPreview, updateImgPreview, handleImageUpload, refreshArticlesList,
  addCategory, updateCategoryColor, deleteCategory,
  addTicker, toggleTicker, updateTicker, deleteTicker,
  saveSettings, setAccentPreset, showToast, State,
});
