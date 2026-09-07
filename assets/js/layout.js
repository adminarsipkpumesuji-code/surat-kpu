// ============================================================
// LAYOUT.JS — Sidebar, Topbar, Dark Mode, Notif Panel
// ============================================================

const ICONS = {
  dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  inbox:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>`,
  send:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  clipboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>`,
  plus:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
  chart:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
  search:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  bell:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`,
  moon:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`,
  sun:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  settings:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
  logout:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  addBtn:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  statistic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  print:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`,
};

const NAV_ITEMS = [
  { id:'dashboard',  label:'Dashboard',               icon:'dashboard', href:'index.html',                          section:'Menu Utama' },
  { id:'smk',        label:'Surat Masuk Ketua',        icon:'inbox',     href:'pages/surat-masuk-ketua.html',        section:'Surat Masuk' },
  { id:'sms',        label:'Surat Masuk Sekretaris',   icon:'inbox',     href:'pages/surat-masuk-sekretaris.html' },
  { id:'skk',        label:'Surat Keluar Ketua',       icon:'send',      href:'pages/surat-keluar-ketua.html',       section:'Surat Keluar' },
  { id:'sks',        label:'Surat Keluar Sekretaris',  icon:'send',      href:'pages/surat-keluar-sekretaris.html' },
  { id:'disposisi',  label:'Lembar Disposisi',          icon:'clipboard', href:'pages/disposisi.html',               section:'Tools' },
  { id:'print',      label:'Cetak Disposisi',            icon:'print',     href:'pages/print-disposisi.html' },
  { id:'statistik',  label:'Statistik',                  icon:'statistic', href:'pages/statistik.html' },
  { id:'search',     label:'Pencarian Lanjutan',        icon:'search',    href:'pages/search.html' },
  { id:'rekap',      label:'Rekapitulasi',              icon:'chart',     href:'pages/rekap.html' },
  { id:'tambah',     label:'Input Surat',               icon:'plus',      href:'pages/tambah-surat.html',            section:'Lainnya' },
  { id:'settings',   label:'Pengaturan',               icon:'settings',  href:'pages/settings.html' },
];

function _base() {
  return window.location.pathname.includes('/pages/') ? '../' : '';
}

function _resolvePath(href) {
  const base = _base();
  if (href === 'index.html') return base + 'index.html';
  return base + href;
}

function _logoPath() {
  return _base() + 'assets/img/logo-kpu.png';
}

function renderSidebar(activeId) {
  const user = JSON.parse(localStorage.getItem('kpu_user') || '{}');
  const initials = (user.name || 'A').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);

  let navHtml = '';
  NAV_ITEMS.forEach(item => {
    if (item.section) {
      navHtml += `<span class="nav-label">${item.section}</span>`;
    }
    const isActive = activeId === item.id;
    navHtml += `
      <a href="${_resolvePath(item.href)}" class="nav-item ${isActive ? 'active' : ''}">
        ${ICONS[item.icon] || ''}
        <span>${item.label}</span>
        ${item.id === 'disposisi' ? `<span class="nav-badge" id="sidebarNotifBadge" style="display:none">0</span>` : ''}
      </a>`;
  });

  return `
    <a class="sidebar-brand" href="${_resolvePath('index.html')}">
      <img src="${_logoPath()}" alt="KPU"
        onerror="this.style.display='none'">
      <div class="sidebar-brand-text">
        <h2>KPU Kab. Mesuji</h2>
        <span>Administrasi Surat</span>
      </div>
    </a>
    <nav class="sidebar-nav">${navHtml}</nav>
    <div class="sidebar-footer">
      <a class="sidebar-user" href="${_resolvePath('pages/settings.html')}">
        <div class="sidebar-avatar">${initials}</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">${user.name || 'Administrator'}</div>
          <div class="sidebar-user-role">${user.role || 'admin'}</div>
        </div>
      </a>
    </div>`;
}

function renderTopbar(title, subtitle) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const isDark  = document.documentElement.getAttribute('data-theme') === 'dark';

  return `
    <div class="topbar-left">
      <h1>${title}</h1>
      <p>${subtitle || (typeof CONFIG !== 'undefined' ? CONFIG.INSTANSI : 'KPU Kabupaten Mesuji')}</p>
    </div>
    <div class="topbar-right">
      <span class="topbar-date">${dateStr}</span>
      <div class="search-box">
        ${ICONS.search}
        <input type="text" id="globalSearch" placeholder="Cari surat..."
          oninput="handleGlobalSearch(this.value)">
      </div>
      <!-- Notif button -->
      <button class="topbar-btn" onclick="typeof Notif !== 'undefined' && Notif.togglePanel()" title="Notifikasi">
        ${ICONS.bell}
        <span class="notif-dot" id="notifDot" style="display:none"></span>
      </button>
      <!-- Dark mode toggle -->
      <button class="topbar-btn" id="darkToggle" onclick="toggleDarkMode()" title="Dark Mode">
        <span id="darkIcon">${isDark ? ICONS.sun : ICONS.moon}</span>
      </button>
      <!-- Settings -->
      <a href="${_resolvePath('pages/settings.html')}" class="topbar-btn" title="Pengaturan">
        ${ICONS.settings}
      </a>
      <!-- Logout -->
      <button class="topbar-btn" onclick="typeof Auth !== 'undefined' && Auth.logout()" title="Keluar">
        ${ICONS.logout}
      </button>
      <!-- Add surat -->
      <a href="${_resolvePath('pages/tambah-surat.html')}" class="btn-add">
        ${ICONS.addBtn} Input Surat
      </a>
    </div>`;
}

function renderNotifPanel() {
  return `
    <div class="notif-panel" id="notifPanel">
      <div class="notif-panel-head">
        <h3>Notifikasi</h3>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="btn-icon" onclick="if(typeof Notif!=='undefined'){Notif.markAllRead();Notif.renderPanel();}"
            style="font-size:11px;padding:4px 10px">
            Tandai dibaca
          </button>
          <button class="topbar-btn" onclick="if(typeof Notif!=='undefined')Notif.togglePanel()" style="border:none;background:none">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <div class="notif-list" id="notifList">
        <div class="notif-empty">Memuat notifikasi...</div>
      </div>
    </div>`;
}

// ── DARK MODE ─────────────────────────────────────────────
function applyDarkMode(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem('kpu_dark_mode', dark ? '1' : '0');
  const icon = document.getElementById('darkIcon');
  if (icon) icon.innerHTML = dark ? ICONS.sun : ICONS.moon;
}

function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  applyDarkMode(!isDark);
}

// Init dark mode dari preferensi
function initDarkMode() {
  const saved = localStorage.getItem('kpu_dark_mode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const useDark = saved !== null ? saved === '1' : prefersDark;
  applyDarkMode(useDark);
}

// ── GLOBAL SEARCH ─────────────────────────────────────────
function handleGlobalSearch(val) {
  const kw = val.toLowerCase().trim();
  const rows = document.querySelectorAll('table tbody tr');

  if (rows.length) {
    rows.forEach(r => {
      // Jika kw kosong → tampilkan semua, jika ada kw → filter
      r.style.display = (!kw || r.textContent.toLowerCase().includes(kw)) ? '' : 'none';
    });
    return;
  }

  // Redirect ke halaman search jika tidak ada tabel
  if (kw.length > 1) {
    const base = window.location.pathname.includes('/pages/') ? '../' : '';
    window.location.href = `${base}pages/search.html?q=${encodeURIComponent(val)}`;
  }
}

// ── MAIN INIT ─────────────────────────────────────────────
// Flag agar event listener hanya ditambah SEKALI
let _layoutInitialized = false;

function initLayout(activeId, title, subtitle) {
  // Apply dark mode first (prevent flash)
  initDarkMode();

  const sidebarEl = document.getElementById('sidebar');
  const topbarEl  = document.getElementById('topbar');
  if (sidebarEl) sidebarEl.innerHTML  = renderSidebar(activeId);
  if (topbarEl)  topbarEl.innerHTML   = renderTopbar(title, subtitle);

  // Append notif panel
  if (!document.getElementById('notifPanel')) {
    document.body.insertAdjacentHTML('beforeend', renderNotifPanel());
  }

  // Append loading overlay
  if (!document.getElementById('loadingOverlay')) {
    const div = document.createElement('div');
    div.className = 'loading-overlay';
    div.id = 'loadingOverlay';
    div.style.display = 'none';
    div.innerHTML = `<div class="spinner"></div><p class="loading-text">Memuat data...</p>`;
    document.body.appendChild(div);
  }

  // Update notif badge
  if (typeof Notif !== 'undefined') {
    Notif.updateBadge();
  }

  // Log page view
  if (typeof ActivityLog !== 'undefined') {
    ActivityLog.add(`Membuka halaman: ${title}`, 'view');
  }

  // Event listener hanya ditambah SEKALI — cegah double listener
  if (!_layoutInitialized) {
    _layoutInitialized = true;

    // Close notif panel on outside click
    document.addEventListener('click', e => {
      const panel    = document.getElementById('notifPanel');
      const notifBtn = e.target.closest('[onclick*="Notif.togglePanel"]');
      if (panel && panel.classList.contains('open') && !panel.contains(e.target) && !notifBtn) {
        panel.classList.remove('open');
      }
    });

    // Mobile sidebar toggle
    document.addEventListener('click', e => {
      if (e.target.closest('#mobileSidebarToggle')) {
        document.getElementById('sidebar')?.classList.toggle('mobile-open');
      }
    });
  }
}
