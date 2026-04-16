# 🎓 KampusNews — Campus News CMS

Portal berita kampus modern dengan panel admin lengkap. Dibangun dengan pure HTML, CSS, dan JavaScript tanpa library eksternal. Data tersimpan di **localStorage** browser.

---

## 📁 Struktur File

```
campus-news-cms/
├── index.html      ← Entry point utama (shell HTML)
├── style.css       ← Seluruh design system & styling
├── app.js          ← State management, logika, rendering
├── data.js         ← Data seed default & konstanta
├── vercel.json     ← Konfigurasi deployment Vercel
└── README.md       ← Dokumentasi ini
```

---

## 🚀 Deploy ke Vercel

### Cara 1 — Via Vercel CLI (Paling Mudah)

```bash
# Install Vercel CLI (jika belum)
npm i -g vercel

# Masuk ke folder project
cd campus-news-cms

# Deploy
vercel

# Ikuti prompt: Y, Y, kampusnews, Y
```

### Cara 2 — Via Vercel Dashboard (Drag & Drop)

1. Kunjungi [vercel.com](https://vercel.com) → Login
2. Klik **"Add New Project"**
3. Pilih **"Upload"** lalu drag & drop seluruh folder `campus-news-cms`
4. Klik **Deploy** → Selesai! ✅

### Cara 3 — Via GitHub

1. Upload folder ke repo GitHub baru
2. Di Vercel: **"Add New Project"** → Import dari GitHub
3. Framework: **Other** (static)
4. Klik **Deploy**

---

## ✨ Fitur Lengkap

### Tampilan Publik
- **Hero Section** — Artikel unggulan dengan layout editorial
- **Grid Artikel** — Responsive, lazy loading
- **Halaman Detail** — Render Markdown, artikel terkait
- **Filter Kategori** — Real-time filtering
- **Search** — Pencarian judul, excerpt, dan tag
- **Pagination** — Navigasi halaman
- **Running Text** — Ticker berita berjalan di atas
- **Dark Mode** — UI gelap modern by default
- **Tag Cloud** — Tag populer di bawah grid

### Panel Admin (`/` → Tombol Admin)
- **Dashboard** — Statistik artikel, views, distribusi kategori
- **Artikel** — CRUD lengkap dengan preview
- **Editor Artikel** — Markdown toolbar (H2, H3, Bold, Italic, Quote, List, Preview)
- **Upload Gambar** — URL input + file upload dengan preview
- **Status** — Draft / Publik / Unggulan (hero toggle)
- **Kategori** — Tambah, hapus, ubah warna
- **Running Text** — Tambah, edit, toggle aktif/nonaktif, hapus
- **Pengaturan** — Nama site, logo, tagline, email, footer, accent color

---

## 🎨 Kustomisasi Warna

Di panel Admin → Pengaturan → pilih warna aksen dari palette atau color picker.
Warna tersimpan di localStorage dan langsung diterapkan ke seluruh UI.

---

## 📝 Format Konten (Markdown Sederhana)

| Sintaks | Output |
|---|---|
| `## Judul` | Heading 2 |
| `### Sub-judul` | Heading 3 |
| `**teks**` | **Bold** |
| `*teks*` | *Italic* |
| `> kutipan` | Blockquote |
| `- item` | List |

---

## ⚠️ Catatan Penting

- **Data tersimpan di browser** — Jika buka di device/browser lain, data akan reset ke default
- **Upload gambar lokal** — Gambar upload via file hanya untuk preview; untuk production gunakan URL
- **Tidak perlu backend** — 100% static, bisa di-host di mana saja (Vercel, Netlify, GitHub Pages)

---

## 🛠 Tech Stack

- Pure HTML5, CSS3, JavaScript (ES6+)
- Google Fonts: Playfair Display + DM Sans + JetBrains Mono
- Penyimpanan: localStorage API
- Tidak ada dependency / npm / build step

---

*Dibuat untuk portal berita kampus — 2025*
