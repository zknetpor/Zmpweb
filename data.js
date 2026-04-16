// ============================================================
// DATA.JS — Default seed data & localStorage schema
// Campus News CMS
// ============================================================

const DEFAULT_SETTINGS = {
  siteName: "KampusNews",
  logoText: "KN",
  tagline: "Portal Berita Kampus Terkini",
  footerText: "© 2025 KampusNews. Seluruh hak cipta dilindungi.",
  contactEmail: "redaksi@kampusnews.ac.id",
  accentColor: "#f97316",
  accentColorHex: "#f97316",
};

const DEFAULT_CATEGORIES = [
  { id: "cat-1", name: "Akademik", color: "#3b82f6", slug: "akademik" },
  { id: "cat-2", name: "Mahasiswa", color: "#10b981", slug: "mahasiswa" },
  { id: "cat-3", name: "Kampus", color: "#8b5cf6", slug: "kampus" },
  { id: "cat-4", name: "Riset", color: "#f59e0b", slug: "riset" },
  { id: "cat-5", name: "Prestasi", color: "#ef4444", slug: "prestasi" },
  { id: "cat-6", name: "Kegiatan", color: "#06b6d4", slug: "kegiatan" },
];

const DEFAULT_TICKERS = [
  { id: "tick-1", text: "🎓 Pendaftaran wisuda periode Juli 2025 telah dibuka — kunjungi portal akademik untuk informasi selengkapnya", active: true },
  { id: "tick-2", text: "🏆 Tim robotik kampus meraih juara 1 tingkat nasional di Kompetisi Robot Indonesia 2025", active: true },
  { id: "tick-3", text: "📅 Seminar Nasional Teknologi & Inovasi akan diselenggarakan 25 Juni 2025 di Gedung Auditorium Utama", active: true },
  { id: "tick-4", text: "📢 Pengumuman: Libur akhir semester genap dimulai 20 Juni s/d 14 Juli 2025", active: true },
];

const DEFAULT_ARTICLES = [
  {
    id: "art-1",
    title: "Kampus Raih Akreditasi Internasional AACSB untuk Program Bisnis",
    slug: "kampus-raih-akreditasi-internasional-aacsb",
    excerpt: "Universitas berhasil meraih akreditasi bergengsi Association to Advance Collegiate Schools of Business (AACSB), menjadikannya salah satu dari sedikit institusi di Asia Tenggara yang memiliki pengakuan internasional ini.",
    content: `## Pencapaian Bersejarah

Universitas kami dengan bangga mengumumkan keberhasilan meraih akreditasi internasional **AACSB (Association to Advance Collegiate Schools of Business)** untuk Program Studi Manajemen dan Akuntansi. Pencapaian ini menjadikan kampus kami sebagai salah satu dari **hanya 6% institusi bisnis di seluruh dunia** yang mendapatkan pengakuan bergengsi ini.

## Proses Panjang Menuju Akreditasi

Perjalanan menuju akreditasi AACSB membutuhkan waktu lebih dari **lima tahun** dengan melibatkan seluruh civitas akademika. Proses ini mencakup:

- Evaluasi menyeluruh terhadap kurikulum dan metode pengajaran
- Peningkatan kualifikasi dan penelitian dosen
- Pengembangan fasilitas pembelajaran berbasis teknologi
- Penguatan jaringan dengan dunia industri dan alumni

## Dampak bagi Mahasiswa

> "Akreditasi ini bukan sekadar prestise, melainkan jaminan bahwa pendidikan yang kami berikan setara dengan standar terbaik di dunia." — Prof. Dr. Ahmad Santoso, Dekan Fakultas Bisnis

Dengan akreditasi AACSB, lulusan program bisnis kampus kami kini memiliki keunggulan kompetitif yang signifikan di pasar kerja global. Beberapa keuntungan langsung yang dirasakan mahasiswa antara lain:

- Pengakuan gelar di lebih dari 100 negara
- Akses ke jaringan alumni global AACSB
- Peluang beasiswa internasional yang lebih luas
- Kemudahan transfer kredit ke universitas partner di luar negeri

## Rencana ke Depan

Rektor universitas menyatakan bahwa akreditasi ini akan menjadi momentum untuk terus meningkatkan standar akademik. Program double degree dengan universitas-universitas terkemuka di Eropa dan Amerika Serikat sedang dalam tahap negosiasi lanjutan.`,
    category: "cat-1",
    tags: ["akreditasi", "AACSB", "bisnis", "internasional", "prestasi"],
    author: "Redaksi KampusNews",
    date: "2025-06-10",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
    status: "published",
    featured: true,
    views: 1842,
  },
  {
    id: "art-2",
    title: "Mahasiswa Teknik Informatika Ciptakan Aplikasi Deteksi Penyakit Tanaman Berbasis AI",
    slug: "mahasiswa-ti-ciptakan-aplikasi-deteksi-penyakit-tanaman-ai",
    excerpt: "Tim mahasiswa semester 6 Program Studi Teknik Informatika berhasil mengembangkan aplikasi mobile yang mampu mendeteksi penyakit tanaman padi dengan akurasi 94% menggunakan teknologi machine learning.",
    content: `## Inovasi dari Laboratorium Kecerdasan Buatan

Tiga mahasiswa Program Studi Teknik Informatika — **Budi Santoso, Dewi Rahayu, dan Fajar Nugroho** — berhasil menciptakan terobosan di bidang pertanian digital. Aplikasi bernama **"AgriScan"** ini dikembangkan selama satu semester penuh sebagai bagian dari proyek akhir mata kuliah Computer Vision.

## Cara Kerja AgriScan

Aplikasi AgriScan bekerja dengan memanfaatkan kamera smartphone untuk menganalisis kondisi daun tanaman secara real-time. Sistem AI yang dibangun di atasnya mampu mengidentifikasi hingga **15 jenis penyakit umum** pada tanaman padi, jagung, dan kedelai.

- **Scan Instan**: Cukup arahkan kamera ke daun tanaman
- **Analisis Real-time**: Hasil diagnosa muncul dalam kurang dari 3 detik  
- **Rekomendasi Penanganan**: Aplikasi langsung memberikan saran pengobatan
- **Offline Mode**: Bisa digunakan tanpa koneksi internet

## Pengujian di Lapangan

Tim melakukan pengujian langsung bersama petani di Desa Sumberejo selama dua minggu. Hasilnya, akurasi deteksi mencapai **94,3%** dengan tingkat kepuasan pengguna yang sangat tinggi.

> "Kami tidak menyangka petani di desa langsung bisa menggunakan aplikasi ini. Mereka sangat antusias dan merasa terbantu." — Budi Santoso, ketua tim

## Penghargaan dan Rencana Pengembangan

AgriScan berhasil meraih **Juara 1** pada Kompetisi Inovasi Digital Mahasiswa tingkat nasional. Tim kini sedang menjajaki kerjasama dengan Kementerian Pertanian untuk distribusi aplikasi secara lebih luas.`,
    category: "cat-2",
    tags: ["AI", "inovasi", "pertanian", "machine learning", "aplikasi"],
    author: "Hendra Wijaya",
    date: "2025-06-08",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    status: "published",
    featured: false,
    views: 976,
  },
  {
    id: "art-3",
    title: "Pembangunan Gedung Riset dan Inovasi Tahap II Resmi Dimulai",
    slug: "pembangunan-gedung-riset-inovasi-tahap-2",
    excerpt: "Peletakan batu pertama Gedung Riset dan Inovasi Tahap II senilai Rp 45 miliar dilakukan oleh Rektor bersama perwakilan Kementerian Pendidikan. Gedung 12 lantai ini akan menjadi pusat riset terpadu pertama di kawasan timur Indonesia.",
    content: `## Investasi Besar untuk Masa Depan Riset

Kampus kami memasuki babak baru pengembangan infrastruktur riset dengan dimulainya **pembangunan Gedung Riset dan Inovasi (GRI) Tahap II**. Gedung senilai **Rp 45 miliar** ini akan berdiri megah setinggi 12 lantai di area selatan kampus.

## Fasilitas yang Akan Hadir

GRI Tahap II dirancang sebagai ekosistem inovasi terpadu yang menghubungkan akademisi, peneliti, dan industri. Beberapa fasilitas unggulan yang akan hadir:

- **Lantai 1-2**: Innovation Hub & Co-working Space berkapasitas 200 orang
- **Lantai 3-5**: Laboratorium penelitian multidisiplin berstandar internasional
- **Lantai 6-8**: Pusat Data dan Komputasi Awan (Cloud Computing Center)
- **Lantai 9-10**: Inkubator Bisnis & Startup Studio
- **Lantai 11-12**: Ruang konferensi internasional dan observatory

## Target Penyelesaian

Proyek ini ditargetkan rampung pada **Desember 2026** dengan melibatkan kontraktor lokal dari Sulawesi Selatan. Penggunaan material bangunan berkelanjutan menjadi salah satu komitmen dalam proyek ini.

## Dampak bagi Ekosistem Riset

Wakil Rektor Bidang Riset mengungkapkan bahwa kehadiran GRI Tahap II akan meningkatkan kapasitas penelitian kampus secara signifikan, dengan target publikasi internasional naik **150%** dalam tiga tahun ke depan.`,
    category: "cat-3",
    tags: ["infrastruktur", "gedung", "riset", "inovasi", "kampus"],
    author: "Siti Aminah",
    date: "2025-06-05",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
    status: "published",
    featured: false,
    views: 654,
  },
  {
    id: "art-4",
    title: "Tim Peneliti Ungkap Potensi Ekstrak Rumput Laut Sulawesi sebagai Antibiotik Alami",
    slug: "peneliti-ungkap-potensi-rumput-laut-sulawesi-antibiotik-alami",
    excerpt: "Penelitian yang dipimpin Dr. Nurul Hidayah dari Fakultas MIPA menemukan senyawa bioaktif unik pada spesies rumput laut endemik Sulawesi yang menunjukkan aktivitas antimikroba kuat terhadap bakteri resisten antibiotik.",
    content: `## Penemuan yang Menjanjikan

Sebuah penelitian yang telah berlangsung selama **tiga tahun** akhirnya membuahkan hasil yang luar biasa. Tim peneliti dari Laboratorium Biokimia Fakultas MIPA berhasil mengidentifikasi senyawa bioaktif baru dari rumput laut *Sargassum polycystum* yang hanya ditemukan di perairan Sulawesi.

## Senyawa Bioaktif Baru

Senyawa yang diberi nama **"Sulawesitol-A"** ini menunjukkan kemampuan luar biasa dalam menghambat pertumbuhan bakteri resisten antibiotik, termasuk *Staphylococcus aureus* yang resistan terhadap Methicillin (MRSA).

Hasil uji laboratorium menunjukkan:
- Efektivitas hambat 89% terhadap MRSA
- Toksisitas rendah terhadap sel mamalia
- Stabilitas tinggi pada berbagai kondisi suhu

## Publikasi Internasional

Temuan ini telah dipublikasikan dalam jurnal bergengsi **"Journal of Natural Products"** edisi terbaru dan mendapat respons positif dari komunitas ilmiah internasional.

> "Ini baru permulaan. Sulawesi menyimpan kekayaan hayati laut yang belum banyak dieksplorasi. Kami optimis akan menemukan lebih banyak senyawa berharga." — Dr. Nurul Hidayah

## Langkah Selanjutnya

Tim sedang mengajukan paten atas penemuan ini dan berencana melakukan uji praklinis pada hewan dalam waktu dekat. Kerjasama dengan perusahaan farmasi internasional juga sedang dalam pembicaraan.`,
    category: "cat-4",
    tags: ["riset", "rumput laut", "antibiotik", "MIPA", "inovasi", "Sulawesi"],
    author: "Dr. Nurul Hidayah",
    date: "2025-06-03",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1200&q=80",
    status: "published",
    featured: true,
    views: 1203,
  },
  {
    id: "art-5",
    title: "Delegasi Mahasiswa Bawa Pulang 5 Medali dari Olimpiade Sains Nasional",
    slug: "delegasi-mahasiswa-bawa-5-medali-osn",
    excerpt: "Sebelas mahasiswa yang mewakili kampus pada Olimpiade Sains Nasional 2025 di Yogyakarta pulang membawa kebanggaan: 2 medali emas, 2 perak, dan 1 perunggu dari berbagai bidang kompetisi.",
    content: `## Kebanggaan Kampus di Kancah Nasional

Delegasi mahasiswa kampus kami kembali menorehkan prestasi membanggakan di **Olimpiade Sains Nasional (OSN) 2025** yang diselenggarakan di Universitas Gadjah Mada, Yogyakarta. Dari 11 mahasiswa yang diberangkatkan, mereka berhasil membawa pulang **5 medali bergengsi**.

## Perincian Medali

### 🥇 Medali Emas
- **Matematika**: Rizky Firmansyah (Teknik Sipil, Semester 4)
- **Fisika**: Ananda Putri (Fisika, Semester 6)

### 🥈 Medali Perak  
- **Kimia**: Muhammad Fauzi (Kimia, Semester 4)
- **Biologi**: Laila Sari (Biologi, Semester 6)

### 🥉 Medali Perunggu
- **Komputer**: Dimas Pratama (Teknik Informatika, Semester 2)

## Pesan dari Para Juara

> "Kemenangan ini adalah buah dari latihan intensif selama enam bulan. Saya sangat berterima kasih kepada dosen pembimbing dan seluruh pihak yang mendukung." — Rizky Firmansyah

## Apresiasi Kampus

Rektor secara khusus memberikan beasiswa penuh kepada seluruh peraih medali emas sebagai bentuk apresiasi. Kampus juga akan meningkatkan anggaran pembinaan olimpiade untuk persiapan kompetisi internasional tahun depan.`,
    category: "cat-5",
    tags: ["olimpiade", "prestasi", "medali", "mahasiswa", "OSN"],
    author: "Redaksi KampusNews",
    date: "2025-05-30",
    image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&q=80",
    status: "published",
    featured: false,
    views: 887,
  },
  {
    id: "art-6",
    title: "Festival Budaya Nusantara Kampus Diikuti 2.000 Peserta dari 12 Provinsi",
    slug: "festival-budaya-nusantara-kampus-2025",
    excerpt: "Gelaran tahunan Festival Budaya Nusantara kembali hadir dengan skala yang lebih besar. Sebanyak 2.000 peserta dari 12 provinsi memeriahkan acara yang berlangsung selama tiga hari di lapangan utama kampus.",
    content: `## Perayaan Keberagaman Budaya

**Festival Budaya Nusantara Kampus 2025** sukses digelar selama tiga hari penuh, 20-22 Mei 2025. Ribuan pengunjung memenuhi lapangan utama kampus untuk menyaksikan dan berpartisipasi dalam perayaan kekayaan budaya Indonesia.

## Sorotan Acara

### Penampilan Seni
Lebih dari **150 grup seni** tampil secara bergantian di tiga panggung utama, menampilkan tarian tradisional dari Sabang sampai Merauke. Penampilan kolosal Tari Saman yang melibatkan 500 penari serentak menjadi puncak yang paling ditunggu-tunggu.

### Pameran Kuliner Nusantara
Zona kuliner menampilkan **87 stand** yang menyajikan makanan tradisional dari berbagai daerah. Pengunjung bisa menikmati kuliner langka yang jarang ditemui di kota-kota besar.

### Workshop Kerajinan
Peserta bisa langsung belajar membatik, menganyam, memainkan gamelan, dan berbagai kerajinan tangan tradisional dipandu oleh para pengrajin berpengalaman.

## Dampak Positif

Festival ini tidak hanya menjadi ajang budaya, tetapi juga platform networking bagi mahasiswa dari berbagai daerah. Banyak kolaborasi penelitian lintas budaya lahir dari pertemuan yang terjadi selama festival.`,
    category: "cat-6",
    tags: ["festival", "budaya", "nusantara", "kegiatan", "mahasiswa"],
    author: "Rina Kusuma",
    date: "2025-05-22",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80",
    status: "published",
    featured: false,
    views: 723,
  },
  {
    id: "art-7",
    title: "Program KKN Tematik Digital Sasar 50 Desa Tertinggal di Sulawesi",
    slug: "kkn-tematik-digital-50-desa-sulawesi",
    excerpt: "Sebanyak 450 mahasiswa diberangkatkan dalam Program KKN Tematik Digital yang bertujuan membantu percepatan transformasi digital di desa-desa terpencil di Sulawesi Selatan, Tengah, dan Tenggara.",
    content: `## KKN untuk Indonesia Digital

Program **Kuliah Kerja Nyata (KKN) Tematik Digital** angkatan pertama resmi diberangkatkan hari ini. Sebanyak **450 mahasiswa** dari berbagai program studi akan diterjunkan ke 50 desa di tiga provinsi Sulawesi selama 40 hari.

## Misi Utama

Program ini berfokus pada tiga pilar utama transformasi digital desa:

### 1. Literasi Digital Warga
Mahasiswa akan melatih warga desa mulai dari penggunaan smartphone dasar, internet sehat, hingga keamanan siber untuk melindungi dari penipuan online.

### 2. UMKM Go Digital  
Tim mahasiswa akan membantu pelaku UMKM desa untuk memiliki toko online, menggunakan platform e-commerce, dan memanfaatkan media sosial untuk pemasaran.

### 3. Smart Government Desa
Program ini mencakup pendampingan digitalisasi administrasi desa, mulai dari sistem kependudukan hingga portal informasi desa yang dapat diakses warga.

## Bekal untuk Mahasiswa

Sebelum keberangkatan, seluruh peserta mengikuti **pelatihan intensif 3 hari** meliputi pendampingan masyarakat, teknis implementasi teknologi, dan sensitifitas budaya lokal.

> "Ini bukan sekadar kewajiban akademis. Ini kesempatan nyata bagi kami untuk berkontribusi bagi masyarakat yang membutuhkan." — Koordinator KKN, Mahendra

## Target Capaian

Dalam 40 hari, diharapkan minimal **5.000 warga** meningkat literasi digitalnya dan **500 UMKM** berhasil go digital.`,
    category: "cat-2",
    tags: ["KKN", "digital", "desa", "mahasiswa", "pengabdian"],
    author: "Agus Prasetyo",
    date: "2025-05-15",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80",
    status: "published",
    featured: false,
    views: 541,
  },
  {
    id: "art-8",
    title: "Draft: Kerjasama Riset dengan MIT Media Lab Tengah Dijajaki",
    slug: "kerjasama-riset-mit-media-lab",
    excerpt: "Penjajakan kerjasama penelitian dengan Massachusetts Institute of Technology (MIT) Media Lab sedang dalam tahap finalisasi. Fokus kerjasama mencakup bidang Human-Computer Interaction dan Smart City.",
    content: `## Menuju Kolaborasi Kelas Dunia

Universitas kami sedang dalam tahap finalisasi perjanjian kerjasama riset dengan **MIT Media Lab**, salah satu laboratorium penelitian teknologi paling berpengaruh di dunia.

## Fokus Penelitian Bersama

Kerjasama yang direncanakan mencakup beberapa bidang strategis:

- Human-Computer Interaction untuk kebutuhan lokal Indonesia
- Pengembangan Smart City yang kontekstual dengan kondisi kota-kota di Sulawesi
- Artificial Intelligence untuk bahasa dan budaya daerah
- Teknologi pendidikan adaptif

## Mekanisme Kolaborasi

Kerjasama ini akan melibatkan pertukaran peneliti, mahasiswa doktoral, serta pendanaan bersama untuk proyek-proyek riset spesifik.

*Artikel ini masih dalam tahap finalisasi — akan dipublikasikan setelah penandatanganan MoU resmi.*`,
    category: "cat-4",
    tags: ["MIT", "kerjasama", "riset", "internasional"],
    author: "Redaksi KampusNews",
    date: "2025-06-12",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80",
    status: "draft",
    featured: false,
    views: 0,
  },
];

// Export sebagai konstanta global (untuk diakses file lain)
window.DEFAULT_DATA = {
  settings: DEFAULT_SETTINGS,
  categories: DEFAULT_CATEGORIES,
  tickers: DEFAULT_TICKERS,
  articles: DEFAULT_ARTICLES,
};
