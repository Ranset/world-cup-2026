// ============================================================
// WORLD CUP 2026 — STORAGE LAYER (localStorage)
// ============================================================

const STORAGE_KEYS = {
  RESULTS:     'wc2026_results',
  PREDICTIONS: 'wc2026_predictions',
  KNOCKOUT:    'wc2026_knockout',   // resolved team IDs in knockout slots
  SETTINGS:    'wc2026_settings',
};

const Storage = {
  // ── Results ─────────────────────────────────────────────
  getResults() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS)) || {}; }
    catch { return {}; }
  },
  saveResult(matchId, homeScore, awayScore, homePens = null, awayPens = null, status = 'finished') {
    const results = this.getResults();
    results[matchId] = { homeScore, awayScore, homePens, awayPens, status };
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
  },
  deleteResult(matchId) {
    const results = this.getResults();
    delete results[matchId];
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
  },

  // ── Predictions ─────────────────────────────────────────
  getPredictions() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.PREDICTIONS)) || {}; }
    catch { return {}; }
  },
  savePrediction(matchId, predictedWinner) {
    // predictedWinner: team code or 'draw'
    const preds = this.getPredictions();
    preds[matchId] = { winner: predictedWinner };
    localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(preds));
  },
  deletePrediction(matchId) {
    const preds = this.getPredictions();
    delete preds[matchId];
    localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(preds));
  },

  // ── Knockout resolved teams ──────────────────────────────
  getKnockout() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.KNOCKOUT)) || {}; }
    catch { return {}; }
  },
  saveKnockout(data) {
    localStorage.setItem(STORAGE_KEYS.KNOCKOUT, JSON.stringify(data));
  },

  // ── Settings ────────────────────────────────────────────
  getSettings() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || {}; }
    catch { return {}; }
  },
  saveSetting(key, value) {
    const s = this.getSettings();
    s[key] = value;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(s));
  },

  // ── Export / Import ─────────────────────────────────────
  exportAll() {
    return {
      results:     this.getResults(),
      predictions: this.getPredictions(),
      knockout:    this.getKnockout(),
      settings:    this.getSettings(),
      exportedAt:  new Date().toISOString(),
    };
  },
  importAll(data) {
    if (data.results)     localStorage.setItem(STORAGE_KEYS.RESULTS,     JSON.stringify(data.results));
    if (data.predictions) localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(data.predictions));
    if (data.knockout)    localStorage.setItem(STORAGE_KEYS.KNOCKOUT,    JSON.stringify(data.knockout));
    if (data.settings)    localStorage.setItem(STORAGE_KEYS.SETTINGS,    JSON.stringify(data.settings));
  },
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }
};
