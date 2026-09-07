// ============================================================
// LOG.JS — Activity Log & Auth Guard
// ============================================================

const ActivityLog = {

  // Tambah log
  add(action, type = 'info', detail = '') {
    const user = JSON.parse(localStorage.getItem('kpu_user') || '{}');
    const logs = JSON.parse(localStorage.getItem('kpu_activity_log') || '[]');
    logs.unshift({
      id:     Date.now(),
      time:   new Date().toISOString(),
      action,
      detail,
      type,   // 'login', 'logout', 'view', 'export', 'disposisi', 'info', 'warning'
      user:   user.name || 'Unknown',
      role:   user.role || '',
    });
    localStorage.setItem('kpu_activity_log', JSON.stringify(logs.slice(0, 200)));
  },

  // Ambil semua log
  getAll() {
    return JSON.parse(localStorage.getItem('kpu_activity_log') || '[]');
  },

  // Hapus semua log
  clear() {
    localStorage.removeItem('kpu_activity_log');
  },

  // Render ke element
  render(containerId, limit = 50) {
    const el   = document.getElementById(containerId);
    if (!el) return;
    const logs = this.getAll().slice(0, limit);

    if (!logs.length) {
      el.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;">Belum ada aktivitas</div>';
      return;
    }

    const colors = {
      login:     '#2B6CB0',
      logout:    '#6B7280',
      view:      '#2F855A',
      export:    '#975A16',
      disposisi: '#C0392B',
      info:      '#4A5568',
      warning:   '#DD6B20',
    };

    el.innerHTML = logs.map(l => `
      <div class="log-item">
        <div class="log-dot" style="background:${colors[l.type] || '#9CA3AF'}"></div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:500;color:var(--text-main)">${l.action}</div>
          ${l.detail ? `<div style="font-size:11.5px;color:var(--text-muted);margin-top:2px">${l.detail}</div>` : ''}
          <div class="log-time">${this.formatTime(l.time)} · ${l.user}</div>
        </div>
      </div>`).join('');
  },

  formatTime(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' }) +
           ' ' + d.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
  },
};

// ── AUTH GUARD ────────────────────────────────────────────
const Auth = {
  // Cek apakah sudah login, redirect ke login jika belum
  guard() {
    if (localStorage.getItem('kpu_logged_in') !== 'true') {
      const base = window.location.pathname.includes('/pages/') ? '../' : '';
      window.location.replace(base + 'login.html');
      return false;
    }
    return true;
  },

  // Ambil data user saat ini
  getUser() {
    return JSON.parse(localStorage.getItem('kpu_user') || '{}');
  },

  // Logout
  logout() {
    const user = this.getUser();
    ActivityLog.add(`Logout: ${user.name || 'User'}`, 'logout');
    localStorage.removeItem('kpu_logged_in');
    localStorage.removeItem('kpu_user');
    const base = window.location.pathname.includes('/pages/') ? '../' : '';
    window.location.replace(base + 'login.html');
  },
};

// Auto guard saat file di-load (kecuali di login.html)
if (!window.location.pathname.includes('login.html')) {
  Auth.guard();
}
