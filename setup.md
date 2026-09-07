# Panduan Setup Website Dashboard Surat KPU

## Langkah 1 — Aktifkan Google Sheets API

1. Buka https://console.cloud.google.com
2. Buat project baru (atau gunakan yang sudah ada)
3. Cari "Google Sheets API" → Enable
4. Buka **Credentials** → **Create Credentials** → **API Key**
5. Salin API Key yang dihasilkan

## Langkah 2 — Atur Keamanan API Key

Di console Google Cloud:
- Edit API Key → **Application restrictions**: HTTP referrers
- Tambahkan domain website Anda (contoh: `https://yourdomain.com/*`)
- **API restrictions**: Restrict key → pilih Google Sheets API

## Langkah 3 — Publish Google Sheets

Di Google Sheets Anda:
1. **File** → **Share** → **Publish to web**
2. Pilih "Entire Document" → Publish
3. ATAU: Share → Anyone with the link → **Viewer**

## Langkah 4 — Isi config.js

Buka file `assets/js/config.js` dan ganti:

```javascript
SPREADSHEET_ID: "ID_DARI_URL_SPREADSHEET_ANDA",
API_KEY: "API_KEY_DARI_GOOGLE_CLOUD",
FORM_URL: "URL_GOOGLE_FORM_INPUT_ANDA",
```

**Cara ambil Spreadsheet ID:**
URL: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
Salin bagian antara `/d/` dan `/edit`

## Langkah 5 — Pastikan Nama Sheet Sesuai

Di config.js, bagian `SHEETS`, nama harus PERSIS sama dengan nama tab di Google Sheets:
- `Surat Masuk Ketua`
- `Surat Masuk Sekretaris`
- `Surat Keluar Ketua`
- `Surat Keluar Sekretaris`
- `Lembar Disposisi Ketua`
- `Lembar Disposisi Sekretaris`

## Langkah 6 — Jalankan Website

Buka `index.html` di browser. Karena menggunakan fetch API, 
website harus dijalankan melalui web server, bukan dibuka langsung sebagai file.

**Opsi 1: VS Code Live Server**
- Install extension "Live Server"
- Klik kanan `index.html` → Open with Live Server

**Opsi 2: Python (jika terinstall)**
```bash
python -m http.server 8080
```
Buka http://localhost:8080

**Opsi 3: Deploy ke hosting**
Upload semua file ke hosting (cPanel, Netlify, Vercel, dll.)

## Struktur File

```
surat-kpu/
├── index.html                     # Dashboard utama
├── pages/
│   ├── surat-masuk-ketua.html
│   ├── surat-masuk-sekretaris.html
│   ├── surat-keluar-ketua.html
│   ├── surat-keluar-sekretaris.html
│   ├── disposisi.html
│   ├── rekap.html
│   └── tambah-surat.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── config.js    ← ISI INI DULU sebelum pakai
│   │   ├── api.js
│   │   └── layout.js
│   └── img/
│       └── logo-kpu.png  ← Tambahkan logo KPU di sini
└── SETUP.md
```

## Tambahkan Logo KPU

Letakkan file logo KPU dengan nama `logo-kpu.png` di folder `assets/img/`.
Ukuran yang disarankan: 100x100 pixel, background transparan (PNG).

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Data tidak muncul | Periksa API Key dan Spreadsheet ID di config.js |
| Error 403 | Spreadsheet belum di-share public / API key salah |
| Error CORS | Jalankan via web server, bukan buka file langsung |
| Nama sheet tidak ditemukan | Sesuaikan nama di config.js dengan tab di Spreadsheet |
| Grafik tidak muncul | Pastikan ada koneksi internet (Chart.js dari CDN) |
