// ============================================================
// WORLD CUP 2026 — TOURNAMENT LOGIC
// ============================================================

const Tournament = {

  // ── Enrich matches with stored results ───────────────────
  getMatches() {
    const results = Storage.getResults();
    return WC_MATCHES.map(m => {
      const r = results[m.id];
      return r ? { ...m, ...r } : { ...m };
    });
  },

  getGroupMatches(group) {
    return this.getMatches().filter(m => m.group === group);
  },

  // ── Group standings ───────────────────────────────────────
  getGroupStandings(group) {
    const matches = this.getGroupMatches(group);
    const teams   = Object.values(WC_TEAMS).filter(t => t.group === group);
    const table   = {};

    teams.forEach(t => {
      table[t.id] = { team:t, p:0, w:0, d:0, l:0, gf:0, ga:0, gd:0, pts:0 };
    });

    matches.forEach(m => {
      if (m.status !== 'finished' || m.homeScore === null || m.homeScore === undefined) return;
      const h = table[m.home], a = table[m.away];
      if (!h || !a) return;
      h.p++; a.p++;
      h.gf += m.homeScore; h.ga += m.awayScore;
      a.gf += m.awayScore; a.ga += m.homeScore;
      if (m.homeScore > m.awayScore)      { h.w++; h.pts += 3; a.l++; }
      else if (m.homeScore < m.awayScore) { a.w++; a.pts += 3; h.l++; }
      else                                { h.d++; h.pts++;    a.d++; a.pts++; }
    });

    Object.values(table).forEach(r => r.gd = r.gf - r.ga);

    return Object.values(table).sort((a, b) =>
      b.pts - a.pts ||
      b.gd  - a.gd  ||
      b.gf  - a.gf  ||
      a.team.name.localeCompare(b.team.name)
    );
  },

  getAllStandings() {
    const out = {};
    WC_GROUPS.forEach(g => out[g] = this.getGroupStandings(g));
    return out;
  },

  // ── 8 best third-placed teams ────────────────────────────
  getBestThirds() {
    const thirds = [];
    WC_GROUPS.forEach(g => {
      const st = this.getGroupStandings(g);
      if (st.length >= 3) thirds.push({ ...st[2], group: g });
    });
    return thirds
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
      .slice(0, 8);
  },

  // ── Resolve slot label → team ID ─────────────────────────
  // Slot examples: '1A', '2B', '3DEF', 'W101', 'L101'
  // FIX: recursively resolves nested slot strings so bracket
  //      shows real team names once group/KO results are entered.
  resolveSlot(slot) {
    if (!slot) return null;
    // Already a real team?
    if (WC_TEAMS[slot]) return slot;

    const results = Storage.getResults();
    const stored  = Storage.getKnockout();

    // Cached resolution
    if (stored[slot]) return stored[slot];

    // Pattern: digit + letter(s) — e.g. '1A', '2B', '3ABCDF'
    const posMatch = slot.match(/^([123])([A-L]+)$/);
    if (posMatch) {
      const pos    = parseInt(posMatch[1]);
      const groups = posMatch[2].split('');

      if (pos === 3 && groups.length > 1) {
        // Best third among listed groups
        const candidates = [];
        groups.forEach(g => {
          const st = this.getGroupStandings(g);
          if (st.length >= 3) candidates.push({ teamId: st[2].team.id, ...st[2] });
        });
        if (!candidates.length) return null;
        candidates.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
        return candidates[0].teamId;
      } else {
        const g  = groups[0];
        const st = this.getGroupStandings(g);
        if (st.length >= pos) return st[pos - 1].team.id;
        return null;
      }
    }

    // Pattern: W<id> — winner of match id
    const winMatch = slot.match(/^W(\d+)$/);
    if (winMatch) {
      const mid   = parseInt(winMatch[1]);
      const match = WC_MATCHES.find(m => m.id === mid);
      if (!match) return null;
      const r = results[mid];
      if (!r || r.status !== 'finished') return null;
      const enriched   = { ...match, ...r };
      const winnerSlot = this.getMatchWinner(enriched);
      if (!winnerSlot) return null;
      // KEY FIX: the home/away stored in match may itself be a slot string
      // (e.g. '2A', 'W73'). Resolve recursively until we get a real team ID.
      if (WC_TEAMS[winnerSlot]) return winnerSlot;
      return this.resolveSlot(winnerSlot);
    }

    // Pattern: L<id> — loser of match id (3rd-place match)
    const loseMatch = slot.match(/^L(\d+)$/);
    if (loseMatch) {
      const mid   = parseInt(loseMatch[1]);
      const match = WC_MATCHES.find(m => m.id === mid);
      if (!match) return null;
      const r = results[mid];
      if (!r || r.status !== 'finished') return null;
      const enriched   = { ...match, ...r };
      const winnerSlot = this.getMatchWinner(enriched);
      if (!winnerSlot) return null;
      // Loser is whichever side is NOT the winner
      const loserSlot = winnerSlot === enriched.home ? enriched.away : enriched.home;
      if (WC_TEAMS[loserSlot]) return loserSlot;
      return this.resolveSlot(loserSlot);
    }

    return null;
  },

  // ── Winner of a single match ─────────────────────────────
  getMatchWinner(match) {
    if (match.status !== 'finished') return null;
    if (match.homeScore === null || match.homeScore === undefined) return null;
    if (match.homeScore > match.awayScore) return match.home;
    if (match.awayScore > match.homeScore) return match.away;
    // Penalty shootout tiebreak
    if (match.homePens !== null && match.awayPens !== null && match.homePens !== undefined) {
      return match.homePens > match.awayPens ? match.home : match.away;
    }
    return null;
  },

  // ── Prediction accuracy ───────────────────────────────────
  getPredictionStats() {
    const results     = Storage.getResults();
    const predictions = Storage.getPredictions();
    const matches     = this.getMatches();
    let total = 0, correct = 0, pending = 0;
    const details = [];

    matches.forEach(m => {
      const pred   = predictions[m.id];
      const result = results[m.id];
      if (!pred) return;
      if (!result || result.status !== 'finished') { pending++; return; }
      total++;
      const winner        = this.getMatchWinner({ ...m, ...result });
      const actualOutcome = winner || 'draw';
      const isCorrect     = pred.winner === actualOutcome;
      if (isCorrect) correct++;
      details.push({ match: m, predicted: pred.winner, actual: actualOutcome, correct: isCorrect });
    });

    return {
      total, correct, pending,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
      details
    };
  },

  // ── Next upcoming match (ALL phases, including knockout) ──
  // FIX: original only searched WC_MATCHES_GROUP, causing
  //      "EL TORNEO HA CONCLUIDO" after group stage ended.
  getNextMatch() {
    const results = Storage.getResults();
    const now     = new Date();

    const getMatchTime = (m) => {
      const [y, mo, d] = m.date.split('-').map(Number);
      // TBD times: use noon as placeholder so they sort correctly
      if (!m.time || m.time === 'TBD') return new Date(y, mo - 1, d, 12, 0);
      const [h, min] = m.time.split(':').map(Number);
      return new Date(y, mo - 1, d, h, min);
    };

    const upcoming = WC_MATCHES.filter(m => {
      const r = results[m.id];
      if (r && r.status === 'finished') return false;
      return getMatchTime(m) > now;
    }).sort((a, b) => getMatchTime(a) - getMatchTime(b));

    return upcoming[0] || null;
  },

  // ── Tournament statistics ─────────────────────────────────
  getStats() {
    const results = Storage.getResults();
    const matches = WC_MATCHES
      .filter(m => { const r = results[m.id]; return r && r.status === 'finished'; })
      .map(m => ({ ...m, ...results[m.id] }));

    let totalGoals = 0, draws = 0, homeWins = 0, awayWins = 0;
    const teamGoals   = {};
    const teamMatches = {};

    matches.forEach(m => {
      const hs = Number(m.homeScore), as = Number(m.awayScore);
      totalGoals += hs + as;
      if (hs > as) homeWins++;
      else if (as > hs) awayWins++;
      else draws++;

      [m.home, m.away].forEach((t, i) => {
        const g = i === 0 ? hs : as;
        teamGoals[t]   = (teamGoals[t]   || 0) + g;
        teamMatches[t] = (teamMatches[t] || 0) + 1;
      });
    });

    const topScorers = Object.entries(teamGoals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([id, goals]) => ({ team: WC_TEAMS[id], goals, played: teamMatches[id] || 0 }))
      .filter(s => s.team);

    return {
      matchesPlayed: matches.length,
      totalGoals,
      avgGoals: matches.length ? (totalGoals / matches.length).toFixed(2) : '0.00',
      homeWins, awayWins, draws,
      topScorers,
    };
  },
};