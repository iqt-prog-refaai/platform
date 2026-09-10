// ============================================
// utils.js — DOM helpers, toasts, particles,
//             confetti, formatting
// Depends on: config.js (ICONS)
// ============================================

/** Shorthand for getElementById */
function $(id) { return document.getElementById(id); }

function translateRole(role) {
  if (role === 'admin') return 'مدير';
  if (role === 'student') return 'طالب';
  return role;
}

function showToast(message, type = 'success') {
  const container = $('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? ICONS.check : ICONS.alert}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function hideLoading() {
  $('loadingScreen').style.display = 'none';
}

function showLoading() {
  $('loadingScreen').style.display = 'flex';
}

function formatDate(dateStr) {
  if (!dateStr) return 'غير متاح';
  return new Date(dateStr).toLocaleDateString('ar-SA', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

function generateParticles() {
  const container = $('particles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.right = Math.random() * 100 + '%';
    p.style.animationDuration = (10 + Math.random() * 20) + 's';
    p.style.animationDelay = Math.random() * 15 + 's';
    p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
    container.appendChild(p);
  }
}

function createConfetti() {
  const colors = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b'];
  for (let i = 0; i < 50; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.right = Math.random() * 100 + 'vw';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = (2 + Math.random() * 2) + 's';
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}

/**
 * Extracts the Google Drive file ID from various URL formats:
 *   /file/d/FILE_ID/view
 *   /file/d/FILE_ID/preview
 *   /d/FILE_ID/
 *   id=FILE_ID  (query param)
 */
function extractDriveFileId(url) {
  if (!url) return null;
  // Match /d/FILE_ID/ or /file/d/FILE_ID/
  let m = url.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
  if (m) return m[1];
  // Match id=FILE_ID query param
  m = url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if (m) return m[1];
  return null;
}

/**
 * Returns a reliable Google Drive embed (preview) URL from any Drive URL/ID.
 */
function getDrivePreviewUrl(urlOrId) {
  const id = extractDriveFileId(urlOrId) || urlOrId;
  return `https://drive.google.com/file/d/${id}/preview`;
}

/**
 * Returns a Google Drive direct download URL from any Drive URL/ID.
 */
function getDriveDownloadUrl(urlOrId) {
  const id = extractDriveFileId(urlOrId) || urlOrId;
  return `https://drive.google.com/uc?export=download&id=${id}`;
}

/**
 * Returns a Google Drive "open" URL from any Drive URL/ID.
 */
function getDriveOpenUrl(urlOrId) {
  const id = extractDriveFileId(urlOrId) || urlOrId;
  return `https://drive.google.com/file/d/${id}/view`;
}
