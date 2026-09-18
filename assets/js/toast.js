// ============================================================
// TOAST.JS — Modern Toast Notification System
// ============================================================

const Toast = {
  container: null,
  
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(this.container);
    }
  },
  
  show(message, type = 'info', duration = 4000) {
    this.init();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
      success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
      error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
      warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
    };
    
    const colors = {
      success: { bg: 'rgba(34, 197, 94, 0.95)', border: '#22c55e' },
      error: { bg: 'rgba(239, 68, 68, 0.95)', border: '#ef4444' },
      warning: { bg: 'rgba(251, 146, 60, 0.95)', border: '#fb923c' },
      info: { bg: 'rgba(59, 130, 246, 0.95)', border: '#3b82f6' }
    };
    
    const color = colors[type] || colors.info;
    
    toast.style.cssText = `
      background: ${color.bg};
      color: white;
      padding: 14px 18px;
      border-radius: 10px;
      border-left: 4px solid ${color.border};
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 300px;
      max-width: 400px;
      font-size: 14px;
      font-weight: 500;
      pointer-events: auto;
      animation: slideInRight 0.3s ease, fadeOut 0.3s ease ${duration - 300}ms forwards;
      backdrop-filter: blur(10px);
    `;
    
    toast.innerHTML = `
      <div style="width:20px;height:20px;flex-shrink:0;">${icons[type]}</div>
      <div style="flex:1;line-height:1.4;">${message}</div>
      <button onclick="this.parentElement.remove()" style="background:none;border:none;color:white;opacity:0.7;cursor:pointer;padding:0;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:20px;line-height:1;">×</button>
    `;
    
    this.container.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, duration);
    
    return toast;
  },
  
  success(message, duration) {
    return this.show(message, 'success', duration);
  },
  
  error(message, duration) {
    return this.show(message, 'error', duration);
  },
  
  warning(message, duration) {
    return this.show(message, 'warning', duration);
  },
  
  info(message, duration) {
    return this.show(message, 'info', duration);
  }
};

// Add animations to stylesheet
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    to {
      opacity: 0;
      transform: translateX(400px) scale(0.8);
    }
  }
  
  .toast:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4) !important;
  }
`;
document.head.appendChild(style);

// Export untuk digunakan global
window.Toast = Toast;
