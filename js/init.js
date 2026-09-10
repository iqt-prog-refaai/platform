// ============================================
// init.js — App bootstrap (runs on DOMContentLoaded)
// Depends on: all modules loaded before this one
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  generateParticles();
  checkAuth();
});
