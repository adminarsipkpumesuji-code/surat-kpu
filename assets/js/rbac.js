// ============================================================
// RBAC.JS — Role-Based Access Control
// ============================================================

const RBAC = {
  
  // Role definitions
  ROLES: {
    ADMIN: 'Admin',
    ADMIN_SUBAG: 'Admin Subag',
    KETUA: 'Ketua',
    SEKRETARIS: 'Sekretaris'
  },
  
  // Menu access rules
  ACCESS_RULES: {
    // Dashboard - semua bisa akses
    'dashboard': ['Admin', 'Admin Subag', 'Ketua', 'Sekretaris'],
    
    // Surat Masuk
    'smk': ['Admin', 'Admin Subag', 'Ketua'],
    'sms': ['Admin', 'Admin Subag', 'Sekretaris'],
    
    // Surat Keluar
    'skk': ['Admin', 'Admin Subag', 'Ketua'],
    'sks': ['Admin', 'Admin Subag', 'Sekretaris'],
    
    // Tools
    'print': ['Admin', 'Admin Subag', 'Ketua', 'Sekretaris'],
    'statistik': ['Admin', 'Admin Subag', 'Ketua', 'Sekretaris'],
    'rekap': ['Admin', 'Admin Subag', 'Ketua', 'Sekretaris'],
    'search': ['Admin', 'Admin Subag', 'Ketua', 'Sekretaris'],
    
    // Settings - hanya Admin
    'settings': ['Admin']
  },
  
  // Get current user
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('kpu_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  },
  
  // Get current user role
  getCurrentRole() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  },
  
  // Check if user has access to a menu
  hasAccess(menuId) {
    const role = this.getCurrentRole();
    if (!role) return false;
    
    // Admin has access to everything
    if (role === this.ROLES.ADMIN) return true;
    
    // Check specific access rules
    const allowedRoles = this.ACCESS_RULES[menuId];
    return allowedRoles ? allowedRoles.includes(role) : false;
  },
  
  // Filter menu items based on role
  filterMenuItems(menuItems) {
    return menuItems.filter(item => this.hasAccess(item.id));
  },
  
  // Check page access and redirect if not allowed
  checkPageAccess(pageId) {
    if (!this.hasAccess(pageId)) {
      this.redirectToAccessDenied();
      return false;
    }
    return true;
  },
  
  // Redirect to access denied page
  redirectToAccessDenied() {
    const base = window.location.pathname.includes('/pages/') ? '../' : '';
    
    // Show toast if available
    if (typeof Toast !== 'undefined') {
      Toast.error('Anda tidak memiliki akses ke halaman ini', 3000);
    }
    
    // Redirect to dashboard after delay
    setTimeout(() => {
      window.location.href = base + 'index.html';
    }, 1500);
  },
  
  // Get accessible pages for current role
  getAccessiblePages() {
    const role = this.getCurrentRole();
    if (!role) return [];
    
    const pages = [];
    for (const [pageId, roles] of Object.entries(this.ACCESS_RULES)) {
      if (roles.includes(role)) {
        pages.push(pageId);
      }
    }
    return pages;
  },
  
  // Check if current role is admin
  isAdmin() {
    return this.getCurrentRole() === this.ROLES.ADMIN;
  },
  
  // Check if current role is admin subag
  isAdminSubag() {
    return this.getCurrentRole() === this.ROLES.ADMIN_SUBAG;
  },
  
  // Check if current role is ketua
  isKetua() {
    return this.getCurrentRole() === this.ROLES.KETUA;
  },
  
  // Check if current role is sekretaris
  isSekretaris() {
    return this.getCurrentRole() === this.ROLES.SEKRETARIS;
  },
  
  // Get role display name
  getRoleDisplayName() {
    const role = this.getCurrentRole();
    return role || 'Unknown';
  }
};

// Auto-check page access on load (except login page)
if (typeof window !== 'undefined' && !window.location.pathname.includes('login.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    // Get page ID from current URL
    const path = window.location.pathname;
    let pageId = 'dashboard';
    
    if (path.includes('surat-masuk-ketua')) pageId = 'smk';
    else if (path.includes('surat-masuk-sekretaris')) pageId = 'sms';
    else if (path.includes('surat-keluar-ketua')) pageId = 'skk';
    else if (path.includes('surat-keluar-sekretaris')) pageId = 'sks';
    else if (path.includes('print-disposisi')) pageId = 'print';
    else if (path.includes('statistik')) pageId = 'statistik';
    else if (path.includes('settings')) pageId = 'settings';
    else if (path.includes('rekap')) pageId = 'rekap';
    else if (path.includes('search')) pageId = 'search';
    
    // Check access
    RBAC.checkPageAccess(pageId);
  });
}

// Export for use
window.RBAC = RBAC;
