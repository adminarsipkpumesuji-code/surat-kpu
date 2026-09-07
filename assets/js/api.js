// ============================================================
// API.JS - Koneksi ke Google Sheets
// Menggunakan Google Visualization Query API (tanpa API Key)
// Bekerja selama spreadsheet di-share "Anyone with the link"
// ============================================================

const SheetsAPI = {

  /**
   * Ambil data dari sheet menggunakan Google Visualization API
   * Tidak memerlukan API Key - cukup spreadsheet public
   * @param {string} sheetName - Nama tab sheet
   * @returns {Promise<Array>} - Array of objects
   */
  async fetchSheet(sheetName) {
    const url = `https://docs.google.com/spreadsheets/d/${CONFIG.SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const text = await res.text();
      // Response format: /*O_o*/\ngoogle.visualization.Query.setResponse({...});
      const jsonStr = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/)?.[1];
      if (!jsonStr) throw new Error("Format response tidak dikenali");

      const json = JSON.parse(jsonStr);
      if (json.status !== "ok") throw new Error(json.errors?.[0]?.message || "Query error");

      return this.parseGvizTable(json.table);
    } catch (e) {
      console.error(`Error fetching sheet "${sheetName}":`, e);
      throw e;
    }
  },

  /**
   * Parse tabel dari format Google Visualization ke array of objects
   */
  parseGvizTable(table) {
    if (!table || !table.cols || !table.rows) return [];

    // Ambil nama kolom dari label atau id
    const headers = table.cols.map(c => (c.label || c.id || "").trim());

    // DEBUG: log 1 baris pertama untuk cek format tanggal
    if (table.rows[0]) {
      console.log('[DEBUG] Row 0 raw cells:', JSON.stringify(table.rows[0].c?.slice(0,5)));
    }

    return table.rows.map(row => {
      const obj = {};
      headers.forEach((h, i) => {
        const cell = row.c?.[i];
        let val = "";
        if (cell && cell.v !== null && cell.v !== undefined) {
          // Tangani format tanggal dari gviz: Date(year,month,day)
          if (typeof cell.v === "string" && cell.v.startsWith("Date(")) {
            const parts = cell.v.match(/Date\((\d+),(\d+),(\d+)\)/);
            if (parts) {
              const y = parts[1];
              const m = String(parseInt(parts[2]) + 1).padStart(2, '0');
              const day = String(parts[3]).padStart(2, '0');
              val = `${y}-${m}-${day}`; // format YYYY-MM-DD tanpa konversi UTC
            } else {
              val = cell.f || String(cell.v);
            }
          } else if (cell.f && /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}/.test(cell.f)) {
            // Format dari cell.f seperti "03/09/2026" atau "3-9-2026"
            const sep = cell.f.includes('/') ? '/' : '-';
            const parts = cell.f.split(sep);
            if (parts.length === 3) {
              // Coba deteksi apakah dd/mm/yyyy atau mm/dd/yyyy
              // Google Sheets Indonesia biasanya dd/mm/yyyy
              const d2 = parts[0].padStart(2,'0');
              const m2 = parts[1].padStart(2,'0');
              const y2 = parts[2].length === 4 ? parts[2] : '20'+parts[2];
              val = `${y2}-${m2}-${d2}`; // konversi ke YYYY-MM-DD
            } else {
              val = cell.f || String(cell.v);
            }
          } else {
            val = cell.f || String(cell.v);
          }
        }
        obj[h] = val.trim();
      });
      return obj;
    });
  },

  /**
   * Filter data berdasarkan kolom Jenis Surat
   * Mencocokkan nama jenis (case-insensitive, toleran typo sekertaris/sekretaris)
   */
  filterByJenis(data, jenisTarget) {
    const normalize = s => (s || "").toLowerCase()
      .replace(/sekertaris/g, "sekretaris")  // perbaiki typo umum
      .replace(/\s+/g, " ")
      .trim();
    const target = normalize(jenisTarget);
    return data.filter(d => {
      const jenis = normalize(d["Jenis Surat"] || d["Jenis Surat "] || "");
      return jenis === target;
    });
  },

  /**
   * Ambil semua data surat masuk ketua
   * Sheet "Surat Masuk Ketua" sudah berisi data yang benar (67 baris)
   */
  async getSuratMasukKetua() {
    const data = await this.fetchSheet(CONFIG.SHEETS.SURAT_MASUK_KETUA);
    // Jika sheet sudah berisi data murni (semua Surat Masuk Ketua), return langsung
    // Jika sheet berisi data gabungan, filter berdasarkan Jenis Surat
    const mixed = data.some(d => {
      const j = (d["Jenis Surat"] || d["Jenis Surat "] || "").toLowerCase();
      return j && !j.includes("masuk ketua");
    });
    return mixed ? this.filterByJenis(data, "Surat Masuk Ketua") : data;
  },

  /**
   * Ambil semua data surat masuk sekretaris
   * Sheet berisi data gabungan — filter berdasarkan Jenis Surat
   */
  async getSuratMasukSekretaris() {
    const data = await this.fetchSheet(CONFIG.SHEETS.SURAT_MASUK_SEKRETARIS);
    return this.filterByJenis(data, "Surat Masuk Sekretaris");
  },

  /**
   * Ambil semua data surat keluar ketua
   * Sheet "Surat Keluar Ketua" sudah berisi data yang benar (33 baris)
   */
  async getSuratKeluarKetua() {
    const data = await this.fetchSheet(CONFIG.SHEETS.SURAT_KELUAR_KETUA);
    const mixed = data.some(d => {
      const j = (d["Jenis Surat"] || d["Jenis Surat "] || "").toLowerCase();
      return j && !j.includes("keluar ketua");
    });
    return mixed ? this.filterByJenis(data, "Surat Keluar Ketua") : data;
  },

  /**
   * Ambil semua data surat keluar sekretaris
   * Sheet berisi data gabungan — filter berdasarkan Jenis Surat
   */
  async getSuratKeluarSekretaris() {
    const data = await this.fetchSheet(CONFIG.SHEETS.SURAT_KELUAR_SEKRETARIS);
    return this.filterByJenis(data, "Surat Keluar Sekretaris");
  },

  /**
   * Ambil data disposisi ketua
   */
  async getDisposisiKetua() {
    return await this.fetchSheet(CONFIG.SHEETS.DISPOSISI_KETUA);
  },

  /**
   * Ambil data disposisi sekretaris
   */
  async getDisposisiSekretaris() {
    return await this.fetchSheet(CONFIG.SHEETS.DISPOSISI_SEKRETARIS);
  },

  /**
   * Ambil semua data sekaligus (untuk dashboard)
   */
  async getAllData() {
    const [smk, sms, skk, sks] = await Promise.all([
      this.getSuratMasukKetua(),
      this.getSuratMasukSekretaris(),
      this.getSuratKeluarKetua(),
      this.getSuratKeluarSekretaris(),
    ]);
    return { smk, sms, skk, sks };
  },
};

// ============================================================
// UTILS - Fungsi bantu
// ============================================================
const Utils = {

  /** Format tanggal ke dd Mmm yyyy */
  formatDate(str) {
    if (!str) return "-";
    // Parse manual YYYY-MM-DD agar tidak kena konversi UTC
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      const [y, m, d] = str.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
    }
    const d = new Date(str);
    if (isNaN(d)) return str;
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  },

  /** Format tanggal panjang */
  formatDateLong(str) {
    if (!str) return "-";
    // Parse manual YYYY-MM-DD agar tidak kena konversi UTC
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      const [y, m, d] = str.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    }
    const d = new Date(str);
    if (isNaN(d)) return str;
    return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  },

  /** Mapping status ke badge class */
  badgeStatus(status) {
    const map = {
      "Diterima":       "badge-diterima",
      "Terkirim":       "badge-terkirim",
      "Sudah Disposisi":"badge-disposisi",
      "Pending":        "badge-pending",
      "Disposisi":      "badge-disposisi",
    };
    return map[status] || "badge-biasa";
  },

  /** Mapping sifat ke badge class */
  badgeSifat(sifat) {
    const map = {
      "Penting": "badge-penting",
      "Segera":  "badge-segera",
      "Rahasia": "badge-rahasia",
      "Biasa":   "badge-biasa",
    };
    return map[sifat] || "badge-biasa";
  },

  /** Truncate teks */
  truncate(str, len = 50) {
    if (!str) return "-";
    return str.length > len ? str.substring(0, len) + "..." : str;
  },

  /** Tampilkan loading overlay */
  showLoading(msg = "Memuat data...") {
    const el = document.getElementById("loadingOverlay");
    if (el) {
      el.querySelector(".loading-text").textContent = msg;
      el.style.display = "flex";
    }
  },

  /** Sembunyikan loading overlay */
  hideLoading() {
    const el = document.getElementById("loadingOverlay");
    if (el) el.style.display = "none";
  },

  /** Tampilkan alert */
  showAlert(msg, type = "info", container = "alertContainer") {
    const el = document.getElementById(container);
    if (!el) return;
    const icons = { info: "ℹ️", warning: "⚠️", success: "✅", danger: "❌" };
    el.innerHTML = `<div class="alert alert-${type}">${icons[type] || ""} ${msg}</div>`;
    setTimeout(() => { if (el) el.innerHTML = ""; }, 5000);
  },

  /** Filter tabel berdasar kata kunci */
  filterTable(tableId, keyword) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const rows = table.querySelectorAll("tbody tr");
    const kw = keyword.toLowerCase();
    let visible = 0;
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const show = text.includes(kw);
      row.style.display = show ? "" : "none";
      if (show) visible++;
    });
    return visible;
  },

  /** Nama bulan Bahasa Indonesia */
  namaBulan(angka) {
    const bulan = ["","Januari","Februari","Maret","April","Mei","Juni",
                   "Juli","Agustus","September","Oktober","November","Desember"];
    return bulan[parseInt(angka)] || angka;
  },

  /** Hitung surat yang perlu perhatian (status pending/belum disposisi) */
  countPerluPerhatian(data) {
    return data.filter(d => {
      const s = (d["Status"] || "").toLowerCase();
      return s === "pending" || s === "" || s === "belum disposisi";
    }).length;
  },

  /** Hitung yang sudah terdisposisi */
  countTerdisposisi(data) {
    return data.filter(d => {
      const s = (d["Status"] || "").toLowerCase();
      return s.includes("disposisi") || s === "sudah disposisi";
    }).length;
  },
};
