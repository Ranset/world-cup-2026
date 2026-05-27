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
  // Slot examples: '1A', '2B', '3DEF', 'W101', 'L401'
  resolveSlot(slot) {
    if (!slot) return null;
    // Already a real team?
    if (WC_TEAMS[slot]) return slot;

    const results  = Storage.getResults();
    const stored   = Storage.getKnockout();

    // Cached resolution
    if (stored[slot]) return stored[slot];

    // Pattern: digit + letter(s) — e.g. '1A', '2B', '3DEF'
    const posMatch = slot.match(/^([123])([A-L]+)$/);
    if (posMatch) {
      const pos   = parseInt(posMatch[1]);
      const groups = posMatch[2].split('');

      if (pos === 3 && groups.length > 1) {
        // Best third among listed groups — pick highest ranked
        const candidates = [];
        groups.forEach(g => {
          const st = this.getGroupStandings(g);
          if (st.length >= 3) candidates.push({ teamId: st[2].team.id, ...st[2] });
        });
        if (!candidates.length) return null;
        candidates.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
        return candidates[0].teamId;
      } else {
        // Nth place in group G (single letter)
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
      const enriched = { ...match, ...r };
      const winnerId = this.getMatchWinner(enriched);
      if (!winnerId) return null;
      // If winnerId is itself a slot (e.g. '1A' or 'W73'), resolve recursively
      if (WC_TEAMS[winnerId]) return winnerId;
      return this.resolveSlot(winnerId);
    }

    // Pattern: L<id> — loser of match id (for 3rd place match)
    const loseMatch = slot.match(/^L(\d+)$/);
    if (loseMatch) {
      const mid   = parseInt(loseMatch[1]);
      const match = WC_MATCHES.find(m => m.id === mid);
      if (!match) return null;
      const r = results[mid];
      if (!r || r.status !== 'finished') return null;
      const enriched = { ...match, ...r };
      const winner   = this.getMatchWinner(enriched);
      if (!winner) return null;
      const loser = winner === enriched.home ? enriched.away : enriched.home;
      if (WC_TEAMS[loser]) return loser;
      return this.resolveSlot(loser);
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

  // ── Next upcoming match ───────────────────────────────────
  getNextMatch() {
    const results = Storage.getResults();
    const now     = new Date();

    // Find group-stage matches that haven't been played yet
    const upcoming = WC_MATCHES_GROUP.filter(m => {
      const r = results[m.id];
      if (r && r.status === 'finished') return false;
      const [y,mo,d] = m.date.split('-').map(Number);
      const [h,min]  = m.time.split(':').map(Number);
      return new Date(y, mo-1, d, h, min) > now;
    }).sort((a, b) => {
      return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
    });

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

  // ── Build and cache knockout resolutions ───────────────────
  // Produces an object that maps slot labels -> teamId and matchId -> {home, away}
  updateKnockout() {
    const results = Storage.getResults();
    const map = {}; // slotLabel -> teamId or null

    const resolveLabel = (label, seen = new Set()) => {
      if (!label) return null;
      if (WC_TEAMS[label]) return label;
      if (map[label]) return map[label];
      if (seen.has(label)) return null;
      seen.add(label);

      // digit+letter pattern (1A,2B,3ABC)
      const posMatch = label.match(/^([123])([A-L]+)$/);
      if (posMatch) {
        const pos = parseInt(posMatch[1]);
        const groups = posMatch[2].split('');
        if (pos === 3 && groups.length > 1) {
          const candidates = [];
          groups.forEach(g => {
            const st = this.getGroupStandings(g);
            if (st.length >= 3) candidates.push({ teamId: st[2].team.id, ...st[2] });
          });
          if (!candidates.length) return null;
          candidates.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
          map[label] = candidates[0].teamId;
          return map[label];
        } else {
          const g = posMatch[2][0];
          const st = this.getGroupStandings(g);
          if (st.length >= pos) { map[label] = st[pos-1].team.id; return map[label]; }
          return null;
        }
      }

      // W<number>
      const w = label.match(/^W(\d+)$/);
      if (w) {
        const mid = parseInt(w[1]);
        const match = WC_MATCHES.find(m => m.id === mid);
        if (!match) return null;
        const r = results[mid];
        if (!r || r.status !== 'finished') return null;
        const enriched = { ...match, ...r };
        const winner = this.getMatchWinner(enriched);
        if (!winner) return null;
        if (WC_TEAMS[winner]) { map[label] = winner; return winner; }
        const resolved = resolveLabel(winner, seen);
        map[label] = resolved;
        return resolved;
      }

      // L<number>
      const l = label.match(/^L(\d+)$/);
      if (l) {
        const mid = parseInt(l[1]);
        const match = WC_MATCHES.find(m => m.id === mid);
        if (!match) return null;
        const r = results[mid];
        if (!r || r.status !== 'finished') return null;
        const enriched = { ...match, ...r };
        const winner = this.getMatchWinner(enriched);
        if (!winner) return null;
        const loser = winner === enriched.home ? enriched.away : enriched.home;
        if (WC_TEAMS[loser]) { map[label] = loser; return loser; }
        const resolved = resolveLabel(loser, seen);
        map[label] = resolved;
        return resolved;
      }

      return null;
    };

    // Resolve all knockout slot labels and also build per-match entries
    WC_MATCHES.filter(m => m.phase && m.phase !== 'group').forEach(m => {
      const homeResolved = resolveLabel(m.home) || null;
      const awayResolved = resolveLabel(m.away) || null;
      // store both forms
      map[m.home] = homeResolved;
      map[m.away] = awayResolved;
      map[m.id] = { home: homeResolved, away: awayResolved };
    });

    Storage.saveKnockout(map);
    return map;
  },
};
