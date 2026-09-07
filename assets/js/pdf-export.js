// ============================================================
// PDF-EXPORT.JS — Export halaman ke PDF menggunakan Print API
// Lebih reliable daripada library eksternal untuk konten dinamis
// ============================================================

const PDFExport = {

  /**
   * Export elemen ke PDF via print dialog
   * @param {string} title - Judul dokumen PDF
   * @param {string} containerId - ID elemen yang akan dicetak (opsional)
   */
  export(title = 'Laporan KPU Kabupaten Mesuji', containerId = null) {
    // Set judul dokumen
    const origTitle = document.title;
    document.title = title;

    // Jika ada container spesifik, sembunyikan sisanya
    if (containerId) {
      const style = document.createElement('style');
      style.id = 'pdf-print-style';
      style.textContent = `
        @media print {
          body > * { display: none !important; }
          .main-content { display: block !important; margin-left: 0 !important; }
          .sidebar, .topbar, .table-actions, .pagination,
          .btn-add, #alertContainer, .notif-panel { display: none !important; }
          .page-content { padding: 10px !important; }
          #${containerId} { display: block !important; }
          @page { size: A4; margin: 15mm; }
        }
      `;
      document.head.appendChild(style);
    }

    // Trigger print dialog (browser simpan sebagai PDF)
    window.print();

    // Restore
    setTimeout(() => {
      document.title = origTitle;
      const s = document.getElementById('pdf-print-style');
      if (s) s.remove();
    }, 1000);

    // Log
    if (typeof ActivityLog !== 'undefined') {
      ActivityLog.add(`Export PDF: ${title}`, 'export');
    }
  },

  /**
   * Export rekap tabel ke PDF
   */
  exportRekap(tahun = '') {
    const label = tahun ? `Rekap Surat ${tahun}` : 'Rekap Surat Semua Tahun';
    this.export(`${label} — KPU Kabupaten Mesuji`);
  },

  /**
   * Export statistik ke PDF
   */
  exportStatistik(tahun = '') {
    const label = tahun ? `Statistik Surat ${tahun}` : 'Statistik Surat Semua Tahun';
    this.export(`${label} — KPU Kabupaten Mesuji`);
  },

  /**
   * Export tabel ke format CSV (alternatif PDF)
   * @param {Array} headers - Array header kolom
   * @param {Array} rows - Array data rows
   * @param {string} filename - Nama file
   */
  exportCSV(headers, rows, filename = 'export') {
    const csv = [headers, ...rows].map(r =>
      r.map(cell => `"${String(cell||'').replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${filename}-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);

    if (typeof ActivityLog !== 'undefined') {
      ActivityLog.add(`Export CSV: ${filename}`, 'export', `${rows.length} baris`);
    }
  },
};


