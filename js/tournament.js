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

  // ── Official best-thirds ↔ group-winner pairing (FIFA matrix) ───────────
  // Reverse lookup built once from the official fixture: candidate-letters
  // string (e.g. 'ABCDF') -> the group whose winner sits in that Round-of-32
  // slot (e.g. 'E', from match 74: 1E vs 3ABCDF). This pairing is a fixed
  // property of the bracket, independent of which thirds actually qualify.
  _thirdPlaceSlotOwner: (() => {
    const map = {};
    WC_MATCHES_KNOCKOUT.forEach(m => {
      const home = typeof m.home === 'string' && m.home.match(/^1([A-L])$/);
      const away = typeof m.away === 'string' && m.away.match(/^3([A-L]{2,})$/);
      if (home && away) map[away[1]] = home[1];
    });
    return map;
  })(),

  // Finds the one matrix row whose 8 values are exactly this set of qualified
  // third-place groups (order-independent). There's exactly one row per
  // possible combination (495 = C(12,8)), so the match is unambiguous.
  findThirdPlaceRow(qualifiedGroups) {
    if (qualifiedGroups.length !== 8) return null;
    const key = qualifiedGroups.slice().sort().join('');
    return WC_THIRD_PLACE_MATRIX.find(row => Object.values(row).slice().sort().join('') === key) || null;
  },

  // Resolves a '3<groups>' slot (e.g. '3ABCDF') to an actual team id via the
  // official matrix, so each of the 8 best thirds is assigned to exactly one
  // group-winner and nobody re-meets a group-stage opponent.
  // bestThirds: array of { group } for the 8 qualified third-placed teams.
  // standingsFn: group -> standings array (real or predicted-with-fallback).
  resolveBestThirdSlot(candidateGroups, bestThirds, standingsFn) {
    const winnerGroup = this._thirdPlaceSlotOwner[candidateGroups];
    if (!winnerGroup) return null;
    const row = this.findThirdPlaceRow(bestThirds.map(t => t.group));
    if (!row) return null;
    const thirdGroup = row[winnerGroup];
    if (!thirdGroup) return null;
    const st = standingsFn(thirdGroup);
    return st.length >= 3 ? st[2].team.id : null;
  },

  // ── Predicted group standings from match predictions ──────
  getPredictedGroupStandings(group, predictions = {}) {
    const matches = this.getGroupMatches(group);
    const teams   = Object.values(WC_TEAMS).filter(t => t.group === group);
    const table   = {};
    let hasPredictions = false;

    teams.forEach(t => {
      table[t.id] = { team:t, p:0, w:0, d:0, l:0, gf:0, ga:0, gd:0, pts:0 };
    });

    matches.forEach(m => {
      const pred = predictions[m.id];
      if (!pred || !pred.winner) return;
      const h = table[m.home], a = table[m.away];
      if (!h || !a) return;

      const homeWin = pred.winner === m.home;
      const awayWin = pred.winner === m.away;
      const draw    = pred.winner === 'draw';
      if (!homeWin && !awayWin && !draw) return;

      hasPredictions = true;
      h.p++; a.p++;
      let homeGoals = 0, awayGoals = 0;
      if (draw) {
        h.d++; a.d++; h.pts++; a.pts++;
      } else if (homeWin) {
        h.w++; h.pts += 3; a.l++; homeGoals = 1;
      } else {
        a.w++; a.pts += 3; h.l++; awayGoals = 1;
      }

      h.gf += homeGoals; h.ga += awayGoals;
      a.gf += awayGoals; a.ga += homeGoals;
    });

    if (!hasPredictions) return [];

    Object.values(table).forEach(r => r.gd = r.gf - r.ga);

    return Object.values(table).sort((a, b) =>
      b.pts - a.pts ||
      b.gd  - a.gd  ||
      b.gf  - a.gf  ||
      a.team.name.localeCompare(b.team.name)
    );
  },

  // ── Predicted best third-placed teams ─────────────────────
  getPredictedBestThirds(predictions = {}) {
    const thirds = [];
    WC_GROUPS.forEach(g => {
      let st = this.getPredictedGroupStandings(g, predictions);
      if (!st.length) st = this.getGroupStandings(g);
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

    const results = Storage.getResults();

    // Pattern: digit + letter(s) — e.g. '1A', '2B', '3DEF'
    const posMatch = slot.match(/^([123])([A-L]+)$/);
    if (posMatch) {
      const pos   = parseInt(posMatch[1]);
      const groups = posMatch[2];

      if (pos === 3 && groups.length > 1) {
        return this.resolveBestThirdSlot(groups, this.getBestThirds(), g => this.getGroupStandings(g));
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
  // Snapshots resolveSlot() for every knockout slot, for export/import only —
  // live views always call resolveSlot() directly so they reflect the latest
  // results rather than this snapshot.
  // Produces an object that maps slot labels -> teamId and matchId -> {home, away}
  updateKnockout() {
    const map = {}; // slotLabel -> teamId or null

    WC_MATCHES.filter(m => m.phase && m.phase !== 'group').forEach(m => {
      const homeResolved = this.resolveSlot(m.home);
      const awayResolved = this.resolveSlot(m.away);
      map[m.home] = homeResolved;
      map[m.away] = awayResolved;
      map[m.id] = { home: homeResolved, away: awayResolved };
    });

    Storage.saveKnockout(map);
    return map;
  },

  // ── Resolve slot based on predictions (for predictions view) ─────────
  // Similar to resolveSlot but uses predicted winners/losers instead of actual results
  resolveSlotByPredictions(slot, predictions = {}) {
    if (!slot) return null;
    if (WC_TEAMS[slot]) return slot;

    const map = {}; // cache within this call

    const resolveLabel = (label, seen = new Set()) => {
      if (!label) return null;
      if (WC_TEAMS[label]) return label;
      if (map[label]) return map[label];
      if (seen.has(label)) return null;
      seen.add(label);

      // digit+letter pattern (1A,2B,3ABC) — use predicted group standings when available
      const posMatch = label.match(/^([123])([A-L]+)$/);
      if (posMatch) {
        const pos = parseInt(posMatch[1]);
        const groups = posMatch[2].split('');
        if (pos === 3 && groups.length > 1) {
          const bestThirds = this.getPredictedBestThirds(predictions);
          const standingsFn = g => {
            let st = this.getPredictedGroupStandings(g, predictions);
            return st.length ? st : this.getGroupStandings(g);
          };
          map[label] = this.resolveBestThirdSlot(posMatch[2], bestThirds, standingsFn);
          return map[label];
        } else {
          const g = posMatch[2][0];
          let st = this.getPredictedGroupStandings(g, predictions);
          if (!st.length) st = this.getGroupStandings(g);
          if (st.length >= pos) { map[label] = st[pos-1].team.id; return map[label]; }
          return null;
        }
      }

      // W<number> — winner based on prediction
      const w = label.match(/^W(\d+)$/);
      if (w) {
        const mid = parseInt(w[1]);
        const pred = predictions[mid];
        if (!pred || !pred.winner) return null;
        const winner = pred.winner;
        if (WC_TEAMS[winner]) { map[label] = winner; return winner; }
        // If winner is a slot, resolve it recursively
        const resolved = resolveLabel(winner, seen);
        map[label] = resolved;
        return resolved;
      }

      // L<number> — loser based on prediction (predict opposite winner)
      const l = label.match(/^L(\d+)$/);
      if (l) {
        const mid = parseInt(l[1]);
        const match = WC_MATCHES.find(m => m.id === mid);
        if (!match) return null;
        const pred = predictions[mid];
        if (!pred || !pred.winner) return null;
        // Predict the loser: opposite of predicted winner
        const predictedWinner = pred.winner;
        const loser = predictedWinner === 'draw' ? null : 
                      (predictedWinner === match.home ? match.away : match.home);
        if (!loser) return null;
        if (WC_TEAMS[loser]) { map[label] = loser; return loser; }
        // If loser is a slot, resolve it recursively
        const resolved = resolveLabel(loser, seen);
        map[label] = resolved;
        return resolved;
      }

      return null;
    };

    return resolveLabel(slot);
  },
};
