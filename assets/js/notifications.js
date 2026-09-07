// ============================================================
// NOTIFICATIONS.JS — Sistem Notifikasi & Deteksi Surat Baru
// ============================================================

const Notif = {

  // Ambil data notifikasi dari localStorage
  getAll() {
    return JSON.parse(localStorage.getItem('kpu_notifications') || '[]');
  },

  // Simpan notifikasi
  save(notifs) {
    localStorage.setItem('kpu_notifications', JSON.stringify(notifs.slice(0, 50)));
  },

  // Tandai semua sudah dibaca
  markAllRead() {
    const notifs = this.getAll().map(n => ({ ...n, read: true }));
    this.save(notifs);
    this.updateBadge();
  },

  // Hitung yang belum dibaca
  countUnread() {
    return this.getAll().filter(n => !n.read).length;
  },

  // Update badge di topbar
  updateBadge() {
    const count = this.countUnread();
    // Update dot indicator
    const dot = document.getElementById('notifDot');
    if (dot) dot.style.display = count > 0 ? 'block' : 'none';
    // Update topbar button title
    const btn = document.querySelector('[onclick*="Notif.togglePanel"]');
    if (btn) btn.title = count > 0 ? `Notifikasi (${count})` : 'Notifikasi';
    // Update sidebar badge
    const sbadge = document.getElementById('sidebarNotifBadge');
    if (sbadge) {
      sbadge.textContent = count > 9 ? '9+' : count;
      sbadge.style.display = count > 0 ? 'inline-block' : 'none';
    }
  },

  // Tambah notifikasi baru
  add(type, title, desc, link = '') {
    const notifs = this.getAll();
    notifs.unshift({
      id:    Date.now(),
      type,  // 'new_surat', 'urgent', 'disposisi', 'info'
      title,
      desc,
      link,
      read:  false,
      time:  new Date().toISOString(),
    });
    this.save(notifs);
    this.updateBadge();
  },

  // Deteksi surat baru (bandingkan dengan cache terakhir)
  detectNewSurat(smk, sms, skk, sks) {
    const cacheKey  = 'kpu_last_surat_count';
    const lastCache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    const current   = {
      smk: smk.length, sms: sms.length,
      skk: skk.length, sks: sks.length,
      ts:  Date.now(),
    };

    if (lastCache.smk !== undefined) {
      if (current.smk > lastCache.smk) {
        const diff = current.smk - lastCache.smk;
        this.add('new_surat', `${diff} Surat Masuk Ketua Baru`, `Total sekarang: ${current.smk} surat`, 'pages/surat-masuk-ketua.html');
      }
      if (current.sms > lastCache.sms) {
        const diff = current.sms - lastCache.sms;
        this.add('new_surat', `${diff} Surat Masuk Sekretaris Baru`, `Total sekarang: ${current.sms} surat`, 'pages/surat-masuk-sekretaris.html');
      }
      if (current.skk > lastCache.skk) {
        const diff = current.skk - lastCache.skk;
        this.add('new_surat', `${diff} Surat Keluar Ketua Baru`, `Total sekarang: ${current.skk} surat`, 'pages/surat-keluar-ketua.html');
      }
      if (current.sks > lastCache.sks) {
        const diff = current.sks - lastCache.sks;
        this.add('new_surat', `${diff} Surat Keluar Sekretaris Baru`, `Total sekarang: ${current.sks} surat`, 'pages/surat-keluar-sekretaris.html');
      }
    }
    localStorage.setItem(cacheKey, JSON.stringify(current));
  },

  // Deteksi surat urgent/perlu perhatian
  detectUrgent(smk, sms) {
    const all = [...smk, ...sms];
    const urgent = all.filter(d => {
      const sifat  = (d['Sifat']   || '').toLowerCase();
      const status = (d['Status']  || '').toLowerCase();
      return (sifat === 'penting' || sifat === 'segera') &&
             status !== 'sudah disposisi';
    });
    if (urgent.length > 0) {
      const lastUrg = localStorage.getItem('kpu_last_urgent_count');
      if (String(urgent.length) !== lastUrg) {
        this.add('urgent', `${urgent.length} Surat Perlu Perhatian`, 'Surat penting/segera belum didisposisi', 'pages/disposisi.html');
        localStorage.setItem('kpu_last_urgent_count', String(urgent.length));
      }
    }
  },

  // Render panel notifikasi
  renderPanel() {
    const notifs = this.getAll();
    const list   = document.getElementById('notifList');
    if (!list) return;

    if (!notifs.length) {
      list.innerHTML = '<div class="notif-empty">Tidak ada notifikasi</div>';
      return;
    }

    const icons = {
      new_surat: { bg:'rgba(43,108,176,0.1)',  color:'#2B6CB0', svg:'<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>' },
      urgent:    { bg:'rgba(229,62,62,0.1)',    color:'#E53E3E', svg:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },
      disposisi: { bg:'rgba(151,90,22,0.1)',    color:'#975A16', svg:'<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/>' },
      info:      { bg:'rgba(47,133,90,0.1)',    color:'#2F855A', svg:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },
    };

    list.innerHTML = notifs.slice(0, 20).map(n => {
      const ic   = icons[n.type] || icons.info;
      const time = this.timeAgo(n.time);
      const base = window.location.pathname.includes('/pages/') ? '../' : '';
      const href = n.link ? base + n.link : '#';
      return `<a class="notif-item ${n.read ? '' : 'unread'}" href="${href}">
        <div class="notif-icon" style="background:${ic.bg}">
          <svg viewBox="0 0 24 24" fill="none" stroke="${ic.color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ic.svg}</svg>
        </div>
        <div class="notif-content">
          <div class="notif-title">${n.title}</div>
          <div class="notif-desc">${n.desc}</div>
          <div class="notif-time">${time}</div>
        </div>
      </a>`;
    }).join('');
  },

  // Format waktu relatif
  timeAgo(iso) {
    const d    = new Date(iso);
    const diff = (Date.now() - d) / 1000;
    if (diff < 60)   return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff/60)} menit lalu`;
    if (diff < 86400)return `${Math.floor(diff/3600)} jam lalu`;
    return d.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
  },

  // Toggle panel
  togglePanel() {
    const panel = document.getElementById('notifPanel');
    if (!panel) return;
    const isOpen = panel.classList.contains('open');
    panel.classList.toggle('open');
    if (!isOpen) {
      this.renderPanel();
      this.markAllRead();
    }
  },
};
