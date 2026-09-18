// ============================================================
// SESSION.JS — Session Management & Auto Logout
// ============================================================

// Konfigurasi
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 jam
const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 menit idle
const CHECK_INTERVAL = 60 * 1000; // Check setiap 1 menit

let lastActivity = new Date().getTime();
let sessionCheckInterval = null;

// Cek session validity
function checkSessionValidity() {
  const isLoggedIn = localStorage.getItem('kpu_logged_in') === 'true';
  
  if (!isLoggedIn) {
    redirectToLogin('Sesi belum dimulai');
    return false;
  }

  const expiryTime = parseInt(localStorage.getItem('kpu_login_expiry') || '0');
  const now = new Date().getTime();

  // Cek session expired
  if (expiryTime <= now) {
    logoutDueToExpiry('Sesi telah berakhir. Silakan login kembali.');
    return false;
  }

  // Cek idle timeout
  const timeSinceLastActivity = now - lastActivity;
  if (timeSinceLastActivity > IDLE_TIMEOUT) {
    logoutDueToExpiry('Sesi berakhir karena tidak ada aktivitas selama 30 menit.');
    return false;
  }

  return true;
}

// Redirect ke login
function redirectToLogin(message) {
  if (message) sessionStorage.setItem('kpu_login_message', message);
  const currentPath = window.location.pathname;
  const loginPath = currentPath.includes('/pages/') ? '../login.html' : 'login.html';
  window.location.replace(loginPath);
}

// Logout karena expiry
function logoutDueToExpiry(message) {
  localStorage.removeItem('kpu_logged_in');
  localStorage.removeItem('kpu_login_time');
  localStorage.removeItem('kpu_login_expiry');
  localStorage.removeItem('kpu_user');
  redirectToLogin(message);
}

// Update last activity & extend session
function updateLastActivity() {
  lastActivity = new Date().getTime();
  const newExpiry = lastActivity + SESSION_DURATION;
  localStorage.setItem('kpu_login_expiry', newExpiry.toString());
}

// Track user activity
function trackActivity() {
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
  events.forEach(event => {
    document.addEventListener(event, updateLastActivity, { passive: true });
  });
}

// Start session monitoring
function startSessionMonitoring() {
  if (!checkSessionValidity()) return;
  
  trackActivity();
  
  sessionCheckInterval = setInterval(() => {
    if (!checkSessionValidity()) {
      clearInterval(sessionCheckInterval);
    }
  }, CHECK_INTERVAL);
}

// Auto-start
if (typeof window !== 'undefined' && !window.location.pathname.includes('login.html')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startSessionMonitoring);
  } else {
    startSessionMonitoring();
  }
}
