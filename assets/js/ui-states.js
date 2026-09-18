// ============================================================
// UI-STATES.JS — Loading & Empty State Components
// ============================================================

const UIStates = {
  
  // Skeleton Loading untuk tabel
  tableLoading(columns = 7, rows = 10) {
    const skeletons = [];
    for (let i = 0; i < rows; i++) {
      const cols = [];
      for (let j = 0; j < columns; j++) {
        const width = j === 0 ? '30px' : ['80px', '120px', '150px', '100px'][Math.floor(Math.random() * 4)];
        cols.push(`<td><div class="skeleton" style="width:${width};height:14px;"></div></td>`);
      }
      skeletons.push(`<tr>${cols.join('')}</tr>`);
    }
    return skeletons.join('');
  },
  
  // Empty state dengan ilustrasi
  emptyState(message = 'Tidak ada data', submessage = '', icon = 'inbox') {
    const icons = {
      inbox: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>`,
      search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
      file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`
    };
    
    return `
      <div class="empty-state" style="text-align:center;padding:60px 20px;color:#9CA3AF;">
        <div class="empty-icon" style="width:80px;height:80px;margin:0 auto 20px;opacity:0.4;animation:float 3s ease-in-out infinite;">
          ${icons[icon] || icons.inbox}
        </div>
        <p style="font-size:16px;font-weight:600;color:#6B7280;margin-bottom:8px;">${message}</p>
        ${submessage ? `<p style="font-size:13px;color:#9CA3AF;">${submessage}</p>` : ''}
      </div>
    `;
  },
  
  // Spinner loading
  spinner(size = 'medium') {
    const sizes = { small: '20px', medium: '40px', large: '60px' };
    const dim = sizes[size] || sizes.medium;
    
    return `
      <div class="spinner-wrap" style="display:flex;align-items:center;justify-content:center;padding:40px;">
        <div class="spinner" style="width:${dim};height:${dim};border:3px solid rgba(37,99,235,0.2);border-top-color:#2563eb;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
      </div>
    `;
  },
  
  // Progress bar
  progressBar(percent = 0, color = '#2563eb') {
    return `
      <div class="progress-bar" style="width:100%;height:4px;background:#e5e7eb;border-radius:2px;overflow:hidden;">
        <div class="progress-fill" style="width:${percent}%;height:100%;background:${color};transition:width 0.3s ease;"></div>
      </div>
    `;
  }
};

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes shimmer {
    0% { background-position: -468px 0; }
    100% { background-position: 468px 0; }
  }
  
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    display: inline-block;
  }
  
  .empty-state {
    animation: fadeIn 0.5s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// Export
window.UIStates = UIStates;
