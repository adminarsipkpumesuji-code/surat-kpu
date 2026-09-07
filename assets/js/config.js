// ============================================================
// CONFIG.JS — Konfigurasi Sistem SIAS KPU
//
// CARA GANTI UNTUK SATKER LAIN:
// 1. Buka website → Login → Pengaturan → Konfigurasi Koneksi Sistem
// 2. Isi Spreadsheet ID, Nama Instansi, dll.
// 3. Klik "Test Koneksi" untuk memastikan terhubung
// 4. Klik "Simpan & Terapkan"
//
// ATAU edit langsung nilai di bawah ini:
// ============================================================

const CONFIG = {
  // ── SPREADSHEET UTAMA ──────────────────────────────────
  // Ambil ID dari URL: docs.google.com/spreadsheets/d/[ID INI]/edit
  SPREADSHEET_ID: "1JdMfzSbzlqA44etCQ5RayYIFJChvsb2JzL7ai3y7ICM",

  // ── API KEY ────────────────────────────────────────────
  // Buat di: console.cloud.google.com → APIs & Services → Credentials
  API_KEY: "AIzaSyCyiJcjwl0t-PvfwzqH5sp_D7APVqKraH8",

  // ── NAMA SHEET (jangan diubah kecuali nama tab berubah) ─
  SHEETS: {
    FORM_RESPONSES:         "Form Responses 3",
    SURAT_MASUK_KETUA:      "Surat Masuk Ketua",
    SURAT_MASUK_SEKRETARIS: "Surat Masuk Sekretaris",
    SURAT_KELUAR_KETUA:     "Surat Keluar Ketua",
    SURAT_KELUAR_SEKRETARIS:"Surat Keluar Sekretaris",
    DISPOSISI_KETUA:        "Lembar Disposisi Ketua",
    DISPOSISI_SEKRETARIS:   "Lembar Disposisi Sekretaris",
  },

  // ── GOOGLE FORM INPUT SURAT ────────────────────────────
  FORM_URL: "https://docs.google.com/forms/d/e/1FAIpQLSeJJKU2JNqGX-s7xXRjzek3fsVENCMHWCgeSZjwRKghIwBvHg/viewform",

  // ── SPREADSHEET LEMBAR DISPOSISI ───────────────────────
  DISPOSISI_SHEET_ID: "1CygIm3S5yq2m0cA9DgHm9L6doKMGM-HL2mVhGgavv2I",
  DISPOSISI_KODE_CELL: "K1",

  // ── IDENTITAS INSTANSI ─────────────────────────────────
  INSTANSI: "KPU Kabupaten Mesuji",
  SISTEM:   "Sistem Informasi Administrasi Surat",

  // ── RANGE KOLOM ────────────────────────────────────────
  RANGE: "A:N",
};

// ============================================================
// AUTO-LOAD OVERRIDE DARI PENGATURAN (settings.html)
// Jika admin sudah mengubah konfigurasi lewat halaman Pengaturan,
// nilai dari localStorage akan menimpa nilai default di atas.
// ============================================================
(function applyConfigOverride() {
  try {
    const override = localStorage.getItem('kpu_config_override');
    if (!override) return;
    const cfg = JSON.parse(override);
    // Terapkan setiap key yang ada di override
    ['SPREADSHEET_ID','API_KEY','FORM_URL','DISPOSISI_SHEET_ID','INSTANSI','SISTEM']
      .forEach(key => {
        if (cfg[key] && cfg[key].trim()) CONFIG[key] = cfg[key].trim();
      });
    console.log('[CONFIG] Override aktif untuk:', CONFIG.INSTANSI);
  } catch(e) {
    console.warn('[CONFIG] Gagal load override:', e.message);
  }
})();

// ============================================================
// INDEX KOLOM (0-based) sesuai struktur spreadsheet
// ============================================================
const COL = {
  TIMESTAMP:        0,
  JENIS_SURAT:      1,
  KODE_KLASIFIKASI: 2,
  TANGGAL_SURAT:    3,
  ASAL:             4,
  TUJUAN:           5,
  PERIHAL:          6,
  SIFAT:            7,
  STATUS:           8,
  FILE:             9,
  KODE_SURAT:       10,
  BULAN:            11,
  TAHUN:            12,
  LINK_FILE:        13,
};
