// ============================================
// api.js — HTTP layer for Google Apps Script
// Depends on: config.js (CONFIG)
// ============================================

const API = {
  async get(action, params = {}) {
    const query = new URLSearchParams({ action, ...params }).toString();
    const res = await fetch(`${CONFIG.API_URL}?${query}`);
    return res.json();
  },

  async post(action, data = {}) {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action, ...data })
    });
    return res.json();
  }
};
