// ============================================================
// WORLD CUP 2026 — MAIN APPLICATION
// ============================================================

/* ── App State ──────────────────────────────────────────── */
let currentView      = 'home';
let currentGroup     = 'all';
let currentPhase     = 'all';
let editingMatchId   = null;
let countdownTimer   = null;
let deferredInstall  = null;

/* ── Bootstrap ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(hideSplash, 2600);
  setupNavigation();
  setupPWAInstall();
  navigateTo('home');
});

function hideSplash() {
  document.getElementById('splash')?.classList.add('hidden');
}

/* ── Navigation ──────────────────────────────────────────── */
function setupNavigation() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.view));
  });
}

function navigateTo(view) {
  currentView = view;
  if (view !== 'calendar' && view !== 'predictions') {
    currentPhase = 'all';
    currentGroup = 'all';
  }
  document.querySelectorAll('.nav-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.view === view)
  );
  const container = document.getElementById('view-container');
  container.innerHTML = '';
  const views = { home, calendar, groups, bracket, predictions, stats };
  if (views[view]) views[view](container);
}

/* ── Toast ───────────────────────────────────────────────── */
function toast(msg, type = '', duration = 2800) {
  const tc = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  el.textContent = `${icon} ${msg}`;
  tc.appendChild(el);
  setTimeout(() => { el.style.opacity='0'; setTimeout(()=>el.remove(),300); }, duration);
}

/* ═══════════════════════════════════════════════════════════
   HOME VIEW
═══════════════════════════════════════════════════════════ */
function home(c) {
  const stats     = Tournament.getStats();
  const predStats = Tournament.getPredictionStats();
  const results   = Storage.getResults();
  const played    = Object.values(results).filter(r => r.status === 'finished').length;

  c.innerHTML = `
    <!-- Hero -->
    <div class="home-hero fade-in">
      <div class="home-hero-inner">
        <img class="home-hero-logo"
          src="https://upload.wikimedia.org/wikipedia/en/d/d1/2026_FIFA_World_Cup_emblem.svg"
          alt="FIFA World Cup 2026"
          onerror="this.src='./icons/icon.svg'">
        <div>
          <div class="home-hero-title">WORLD CUP <span>2026</span></div>
          <div class="home-hero-sub">🇲🇽 México &nbsp;·&nbsp; 🇺🇸 EE.UU. &nbsp;·&nbsp; 🇨🇦 Canadá</div>
          <div class="home-hero-dates">11 de Junio — 19 de Julio 2026</div>
        </div>
      </div>
    </div>

    <!-- PWA banner -->
    <div id="install-banner" class="install-banner fade-in">
      <div style="font-size:1.3rem">📲</div>
      <div style="flex:1">
        <div class="font-cond" style="font-weight:700">Instala la app</div>
        <div style="font-size:.75rem;opacity:.8">Acceso rápido desde tu pantalla de inicio</div>
      </div>
      <button class="btn btn-gold btn-sm" onclick="triggerInstall()">Instalar</button>
      <button onclick="dismissInstall()" style="color:rgba(255,255,255,.5);font-size:1.1rem;padding:4px">✕</button>
    </div>

    <!-- Countdown -->
    <div class="countdown-card fade-in" id="countdown-card">
      <div id="countdown-display"><div class="countdown-label">Cargando…</div></div>
    </div>

    <!-- Stats strip -->
    <div class="tstrip fade-in">
      <div class="tstrip-item"><div class="tstrip-num">${played}</div><div class="tstrip-lbl">Partidos</div></div>
      <div class="tstrip-item"><div class="tstrip-num">${stats.totalGoals}</div><div class="tstrip-lbl">Goles</div></div>
      <div class="tstrip-item"><div class="tstrip-num">${stats.avgGoals}</div><div class="tstrip-lbl">Goles/pt.</div></div>
      <div class="tstrip-sep"></div>
      <div class="tstrip-item"><div class="tstrip-num" style="color:var(--gold)">${predStats.percentage}%</div><div class="tstrip-lbl">Aciertos</div></div>
      <div class="tstrip-item"><div class="tstrip-num">${predStats.correct}</div><div class="tstrip-lbl">Correctos</div></div>
      <div class="tstrip-item"><div class="tstrip-num">${predStats.pending}</div><div class="tstrip-lbl">Pendientes</div></div>
    </div>

    <!-- Recent results -->
    <div class="section-sub fade-in">Últimos resultados</div>
    <div id="recent-list"></div>
    <div class="fade-in" style="margin-bottom:16px">
      <button class="btn btn-outline btn-full" onclick="navigateTo('calendar')">Ver calendario completo →</button>
    </div>

    <!-- Quick links -->
    <div class="quick-links fade-in">
      <button class="qlink" onclick="navigateTo('groups')">
        <span class="qlink-icon">📊</span>
        <span class="qlink-label">Grupos</span>
      </button>
      <button class="qlink" onclick="navigateTo('bracket')">
        <span class="qlink-icon">🏆</span>
        <span class="qlink-label">Llaves</span>
      </button>
      <button class="qlink" onclick="navigateTo('predictions')">
        <span class="qlink-icon">🎯</span>
        <span class="qlink-label">Pronóst.</span>
      </button>
      <button class="qlink" onclick="navigateTo('stats')">
        <span class="qlink-icon">📈</span>
        <span class="qlink-label">Stats</span>
      </button>
    </div>

    <!-- Export / extras -->
    <div class="section-sub fade-in" style="margin-top:8px">Opciones</div>
    <div class="menu-list fade-in">
      <div class="menu-item" onclick="exportPredictionsPDF()">
        <div class="menu-item-icon">📄</div>
        <div class="menu-item-body">
          <div class="menu-item-title">Exportar pronósticos PDF</div>
          <div class="menu-item-sub">Descarga tus predicciones en formato PDF</div>
        </div>
        <div class="menu-item-arrow">›</div>
      </div>
      <div class="menu-item" onclick="exportDataJSON()">
        <div class="menu-item-icon">💾</div>
        <div class="menu-item-body">
          <div class="menu-item-title">Exportar datos JSON</div>
          <div class="menu-item-sub">Copia de seguridad de resultados y pronósticos</div>
        </div>
        <div class="menu-item-arrow">›</div>
      </div>
      <div class="menu-item" onclick="document.getElementById('import-file').click()">
        <div class="menu-item-icon">📂</div>
        <div class="menu-item-body">
          <div class="menu-item-title">Importar datos JSON</div>
          <div class="menu-item-sub">Restaura una copia de seguridad</div>
        </div>
        <div class="menu-item-arrow">›</div>
      </div>
      <div class="menu-item" onclick="confirmClear()">
        <div class="menu-item-icon">🗑</div>
        <div class="menu-item-body">
          <div class="menu-item-title" style="color:var(--red)">Borrar todos los datos</div>
          <div class="menu-item-sub">Elimina resultados y pronósticos guardados</div>
        </div>
        <div class="menu-item-arrow">›</div>
      </div>
    </div>
    <input type="file" id="import-file" accept=".json" style="display:none" onchange="importJSON(event)">

    <!-- Venues section -->
    <div class="section-sub fade-in" style="margin-top:8px">🏟 Estadios sede</div>
    <div class="venues-grid fade-in">${venuesHTML()}</div>

    <!-- Footer -->
    <div style="text-align:center;padding:20px 0;font-family:var(--font-cond);
         font-size:.72rem;color:var(--text-3);letter-spacing:1px" class="fade-in">
      FIFA WORLD CUP 2026™ &nbsp;·&nbsp; 48 SELECCIONES &nbsp;·&nbsp; 104 PARTIDOS<br>
      Aplicación personal — Datos en localStorage
    </div>`;

  renderRecent();
  startCountdown();
  checkInstallBanner();
}

function renderRecent() {
  const el = document.getElementById('recent-list');
  if (!el) return;
  const results  = Storage.getResults();
  const finished = WC_MATCHES
    .filter(m => { const r = results[m.id]; return r && r.status === 'finished'; })
    .map(m => ({ ...m, ...results[m.id] }))
    .slice(-6).reverse();
  if (!finished.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">⚽</div>
      <div class="empty-text">No hay resultados aún</div>
      <div style="margin-top:8px;font-size:.8rem;color:var(--text-3)">
        Toca ➕ en la barra superior para agregar el primer resultado
      </div></div>`;
    return;
  }
  el.innerHTML = finished.map(m => matchCard(m, { compact:true })).join('');
}

function venuesHTML() {
  return Object.entries(WC_VENUES).map(([key, v]) => `
    <div class="venue-chip">
      <div class="venue-flag">${v.flag}</div>
      <div class="venue-info">
        <div class="venue-name">${v.name}</div>
        <div class="venue-city">${v.city} · ${v.capacity.toLocaleString('es-MX')}</div>
      </div>
    </div>`).join('');
}

/* ═══════════════════════════════════════════════════════════
   CALENDAR VIEW
═══════════════════════════════════════════════════════════ */
function calendar(c) {
  const phases = [
    { key:'all', label:'Todos' },
    { key:'group', label:'Grupos' },
    { key:'r32',  label:'Ronda 32' },
    { key:'r16',  label:'Octavos' },
    { key:'qf',   label:'Cuartos' },
    { key:'sf',   label:'Semis' },
    { key:'final',label:'Final' },
  ];
  const grps = ['all','A','B','C','D','E','F','G','H','I','J','K','L'];
  const showGroupFilter = currentPhase === 'all' || currentPhase === 'group';

  c.innerHTML = `
    <div class="section-header"><div class="section-title">CALENDARIO</div></div>
    <div class="filter-bar">
      ${phases.map(p => `<button class="filter-chip${currentPhase===p.key?' active':''}"
        onclick="calSetPhase('${p.key}')">${p.label}</button>`).join('')}
    </div>
    <div class="filter-bar" id="group-filter-bar" style="${showGroupFilter?'':'display:none'}">
      ${grps.map(g => `<button class="filter-chip${currentGroup===g?' active':''}"
        onclick="calSetGroup('${g}')">${g==='all'?'Todos los grupos':'Grupo '+g}</button>`).join('')}
    </div>
    <div id="cal-list" class="fade-in"></div>`;

  renderCalList();
}

window.calSetPhase = function(p) { currentPhase = p; if(p!=='group') currentGroup='all'; navigateTo('calendar'); };
window.calSetGroup = function(g) { currentGroup = g; navigateTo('calendar'); };

function renderCalList() {
  const el      = document.getElementById('cal-list');
  if (!el) return;
  const results = Storage.getResults();
  const preds   = Storage.getPredictions();

  let matches = WC_MATCHES.map(m => ({ ...m, ...(results[m.id]||{}) }));
  if (currentPhase !== 'all') matches = matches.filter(m => m.phase === currentPhase);
  if (currentGroup !== 'all') matches = matches.filter(m => m.group === currentGroup);

  if (!matches.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">📅</div>
      <div class="empty-text">Sin partidos en esta fase</div></div>`;
    return;
  }

  // Group by date
  const byDate = {};
  matches.forEach(m => (byDate[m.date] = byDate[m.date] || []).push(m));

  el.innerHTML = Object.entries(byDate).map(([date, ms]) => `
    <div class="date-group">
      <div class="date-header">
        <span class="date-line"></span>
        <span class="date-label">${fmtDate(date)}</span>
        <span class="date-line"></span>
      </div>
      ${ms.map(m => matchCard(m, { showEdit:true, pred: preds[m.id] })).join('')}
    </div>`).join('');
}

/* ═══════════════════════════════════════════════════════════
   GROUPS VIEW
═══════════════════════════════════════════════════════════ */
function groups(c) {
  c.innerHTML = `
    <div class="section-header">
      <div class="section-title">GRUPOS</div>
      <div class="section-badge">12 GRUPOS · 48 EQUIPOS</div>
    </div>
    <div class="groups-legend fade-in">
      <span class="legend-dot" style="background:var(--green)"></span> Clasifican automáticamente (1º y 2º)
      &nbsp;&nbsp;
      <span class="legend-dot" style="background:var(--gold)"></span> Posible clasificación (mejor 3º)
    </div>
    <div id="groups-wrap"></div>`;

  const wrap = document.getElementById('groups-wrap');
  WC_GROUPS.forEach(g => {
    const standings = Tournament.getGroupStandings(g);
    const gMatches  = Tournament.getGroupMatches(g);
    const played    = gMatches.filter(m => m.status === 'finished').length;
    wrap.insertAdjacentHTML('beforeend', groupCard(g, standings, gMatches, played));
  });
}

function groupCard(g, standings, matches, played) {
  const rows = standings.map((row, i) => {
    const cls = i < 2 ? 'qualify-auto' : i === 2 ? 'qualify-possible' : '';
    const rankCls = ['rank-1','rank-2','rank-3','rank-4'][i] || 'rank-4';
    return `<tr class="${cls}">
      <td><span class="rank ${rankCls}">${i+1}</span></td>
      <td>
        <div class="team-cell">
          <span class="flag-lg">${row.team.flag}</span>
          <div>
            <div class="team-cell-name">${row.team.name}</div>
            <div class="team-cell-conf">${row.team.confederation}</div>
          </div>
        </div>
      </td>
      <td>${row.p}</td>
      <td>${row.w}</td>
      <td>${row.d}</td>
      <td>${row.l}</td>
      <td>${row.gf}</td>
      <td>${row.ga}</td>
      <td class="${row.gd>0?'color-green':row.gd<0?'color-red':''}">${row.gd>0?'+':''}${row.gd}</td>
      <td class="pts-cell">${row.pts}</td>
    </tr>`;
  }).join('');

  const matchRows = matches.map(m => {
    const h = WC_TEAMS[m.home], a = WC_TEAMS[m.away];
    const done = m.status === 'finished' && m.homeScore !== null;
    return `<div class="group-match-row" onclick="openEditModal(${m.id})">
      <span class="group-match-team">${h?h.flag:''} ${h?h.code:m.home}</span>
      <span class="group-match-score">${done ? `${m.homeScore} – ${m.awayScore}` : `<span style='color:var(--text-3)'>${m.time}</span>`}</span>
      <span class="group-match-team right">${a?a.code:m.away} ${a?a.flag:''}</span>
      <span class="group-match-edit">✏️</span>
    </div>`;
  }).join('');

  return `<div class="group-card fade-in">
    <div class="group-card-header g-${g}">
      <span class="group-badge-large">GRUPO ${g}</span>
      <span class="group-progress">${played}/6 partidos</span>
    </div>
    <div style="overflow-x:auto">
      <table class="group-table">
        <thead>
          <tr>
            <th>#</th><th style="text-align:left;min-width:140px">Selección</th>
            <th title="Partidos jugados">PJ</th>
            <th title="Ganados">G</th>
            <th title="Empatados">E</th>
            <th title="Perdidos">P</th>
            <th title="Goles a favor">GF</th>
            <th title="Goles en contra">GC</th>
            <th title="Diferencia de goles">DG</th>
            <th title="Puntos">Pts</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="group-matches-section">
      <div class="group-matches-title">Partidos del Grupo ${g}</div>
      ${matchRows}
    </div>
  </div>`;
}

/* ═══════════════════════════════════════════════════════════
   BRACKET VIEW
═══════════════════════════════════════════════════════════ */
function bracket(c) {
  const results = Storage.getResults();
  const allM    = WC_MATCHES.map(m => ({ ...m, ...(results[m.id]||{}) }));

  const getPhase = ph => allM.filter(m => m.phase === ph);

  c.innerHTML = `
    <div class="section-header">
      <div class="section-title">ELIMINATORIAS</div>
    </div>
    <p class="bracket-note fade-in">Los equipos avanzan según los resultados registrados.
      Toca cualquier partido para editar el resultado.</p>

    ${bracketPhase('🔵 Ronda de 32', getPhase('r32'), 4)}
    ${bracketPhase('⚡ Octavos de Final', getPhase('r16'), 4)}
    ${bracketPhase('🔥 Cuartos de Final', getPhase('qf'), 2)}
    ${bracketPhase('🏟 Semifinales', getPhase('sf'), 2)}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
      ${bracketPhaseInner('🥉 Tercer Lugar', getPhase('3rd'))}
      ${bracketPhaseInner('🏆 GRAN FINAL', getPhase('final'))}
    </div>`;
}

function bracketPhase(title, matches, cols) {
  if (!matches.length) return '';
  return `
    <div class="bracket-section fade-in">
      <div class="bracket-phase-title">${title}</div>
      <div class="bracket-grid" style="grid-template-columns:repeat(${Math.min(cols, matches.length)},1fr)">
        ${matches.map(m => bracketMatch(m)).join('')}
      </div>
    </div>`;
}

function bracketPhaseInner(title, matches) {
  return `
    <div class="bracket-section">
      <div class="bracket-phase-title" style="font-size:.75rem">${title}</div>
      ${matches.map(m => bracketMatch(m)).join('')}
    </div>`;
}

function bracketMatch(m) {
  const hId = Tournament.resolveSlot(m.home);
  const aId = Tournament.resolveSlot(m.away);
  const h   = WC_TEAMS[hId];
  const a   = WC_TEAMS[aId];
  const winner = Tournament.getMatchWinner(m);

  const teamRow = (teamObj, teamSlot, score, pens, isHome) => {
    const isWinner = winner && winner === (isHome ? m.home : m.away);
    return `<div class="bracket-team-row${isWinner?' btr-winner':''}">
      <div class="btr-info">
        <span class="btr-flag">${teamObj ? teamObj.flag : '?'}</span>
        <span class="btr-name">${teamObj ? teamObj.code : teamSlot}</span>
      </div>
      <div class="btr-score">
        ${score !== null && score !== undefined ? score : ''}
        ${pens !== null && pens !== undefined && score !== null ? `<span class="btr-pens">(${pens})</span>` : ''}
      </div>
    </div>`;
  };

  return `<div class="bracket-match-card" onclick="openEditModal(${m.id})">
    ${teamRow(h, m.home, m.homeScore, m.homePens, true)}
    <div class="bracket-divider"></div>
    ${teamRow(a, m.away, m.awayScore, m.awayPens, false)}
    <div class="bracket-meta">${WC_VENUES[m.venue]?.city||''} · ${m.date}</div>
  </div>`;
}

/* ═══════════════════════════════════════════════════════════
   PREDICTIONS VIEW
═══════════════════════════════════════════════════════════ */
function predictions(c) {
  const predStats = Tournament.getPredictionStats();
  const preds     = Storage.getPredictions();
  const results   = Storage.getResults();

  const phases = [
    { key:'all',  label:'Todos' },
    { key:'group',label:'Grupos' },
    { key:'r32',  label:'Ronda 32' },
    { key:'r16',  label:'Octavos' },
    { key:'qf',   label:'Cuartos' },
    { key:'sf',   label:'Semis' },
    { key:'final',label:'Final' },
  ];

  // Ring calc
  const R   = 38, circ = 2 * Math.PI * R;
  const pct = predStats.percentage / 100;

  c.innerHTML = `
    <div class="section-header"><div class="section-title">MI PRONÓSTICO</div></div>

    <!-- Score card -->
    <div class="pred-score-card fade-in">
      <div class="pred-score-left">
        <div class="pred-score-pct">${predStats.percentage}<span style="font-size:1.5rem">%</span></div>
        <div class="pred-score-label">de aciertos</div>
        <div class="pred-score-detail">
          <span class="color-green">✅ ${predStats.correct} correctos</span> &nbsp;
          <span class="color-red">❌ ${predStats.total - predStats.correct} incorrectos</span><br>
          <span style="color:var(--text-3)">⏳ ${predStats.pending} pendientes de resultado</span>
        </div>
      </div>
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r="${R}" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="10"/>
        <circle cx="48" cy="48" r="${R}" fill="none" stroke="${predStats.percentage>=70?'#00A651':predStats.percentage>=40?'#D4AF37':'#E30613'}"
          stroke-width="10" stroke-linecap="round" stroke-dasharray="${circ}"
          stroke-dashoffset="${circ * (1 - pct)}" transform="rotate(-90 48 48)"/>
        <text x="48" y="54" text-anchor="middle" fill="white"
          font-family="'Bebas Neue',sans-serif" font-size="22">${predStats.percentage}%</text>
      </svg>
    </div>

    <!-- Filters -->
    <div class="filter-bar fade-in">
      ${phases.map(p => `<button class="filter-chip${currentPhase===p.key?' active':''}"
        onclick="predSetPhase('${p.key}')">${p.label}</button>`).join('')}
    </div>

    <!-- Action bar -->
    <div class="pred-actions fade-in">
      <button class="btn btn-gold btn-sm" onclick="exportPredictionsPDF()">📄 Exportar PDF</button>
      <button class="btn btn-outline btn-sm" onclick="clearPredictions()">🗑 Limpiar todo</button>
    </div>

    <div id="pred-list" class="fade-in"></div>`;

  renderPredList(preds, results);
}

window.predSetPhase = function(p) { currentPhase = p; navigateTo('predictions'); };

function renderPredList(preds, results) {
  const el = document.getElementById('pred-list');
  if (!el) return;
  let matches = WC_MATCHES.map(m => ({ ...m, ...(results[m.id]||{}) }));
  if (currentPhase !== 'all') matches = matches.filter(m => m.phase === currentPhase);

  if (!matches.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">🎯</div>
      <div class="empty-text">Sin partidos en esta fase</div></div>`;
    return;
  }

  el.innerHTML = matches.map(m => predCard(m, preds, results)).join('');
}

function predCard(m, preds, results) {
  const h       = WC_TEAMS[m.home];
  const a       = WC_TEAMS[m.away];
  const pred    = preds[m.id];
  const r       = results[m.id];
  const done    = r && r.status === 'finished' && r.homeScore !== null;
  const winner  = done ? Tournament.getMatchWinner({ ...m, ...r }) : null;
  const actual  = winner || (done ? 'draw' : null);
  const correct = pred && actual && pred.winner === actual;

  const scoreDisp = done
    ? `<div class="pred-vs-score">${r.homeScore} – ${r.awayScore}</div>`
    : `<div class="pred-vs-time">${m.time}<br><span style="font-size:.65rem">${fmtDateShort(m.date)}</span></div>`;

  const selHome  = pred?.winner === m.home  ? ' pred-sel-home'  : '';
  const selDraw  = pred?.winner === 'draw'  ? ' pred-sel-draw'  : '';
  const selAway  = pred?.winner === m.away  ? ' pred-sel-away'  : '';
  const disabled = done ? ' pred-disabled' : '';

  let resultStrip = '';
  if (pred && done) {
    resultStrip = `<div class="pred-result-strip ${correct?'prs-ok':'prs-bad'}">
      <span>${correct ? '✅ Correcto' : '❌ Incorrecto'}</span>
      <span>Pronosticaste: <strong>${pred.winner==='draw'?'Empate':(WC_TEAMS[pred.winner]?.name||pred.winner)}</strong>
      &nbsp;·&nbsp; Resultado real: <strong>${actual==='draw'?'Empate':(WC_TEAMS[actual]?.name||actual)}</strong></span>
    </div>`;
  } else if (pred && !done) {
    resultStrip = `<div class="pred-result-strip prs-pending">
      <span>⏳ Pronóstico guardado</span>
      <span><strong>${pred.winner==='draw'?'Empate':(WC_TEAMS[pred.winner]?.name||pred.winner)}</strong></span>
    </div>`;
  }

  return `<div class="pred-card fade-in">
    <div class="pred-card-top">
      <span class="pred-phase-lbl">${PHASE_LABELS[m.phase]||m.phase}${m.group?' · Grupo '+m.group:''}</span>
      <span class="pred-venue-lbl">📍 ${WC_VENUES[m.venue]?.city||''}</span>
    </div>
    <div class="pred-match">
      <div class="pred-team">
        <div class="pred-flag">${h?h.flag:'🏳'}</div>
        <div class="pred-team-name">${h?h.name:m.home}</div>
      </div>
      <div class="pred-center">${scoreDisp}</div>
      <div class="pred-team pred-team-away">
        <div class="pred-flag">${a?a.flag:'🏳'}</div>
        <div class="pred-team-name">${a?a.name:m.away}</div>
      </div>
    </div>
    <div class="pred-btns${disabled}">
      <button class="pred-btn pred-btn-home${selHome}" onclick="savePred(${m.id},'${m.home}')">
        ${h?h.flag:''} ${h?h.code:'?'}
        <span class="pred-btn-sub">GANA</span>
      </button>
      <button class="pred-btn pred-btn-draw${selDraw}" onclick="savePred(${m.id},'draw')">
        🤝
        <span class="pred-btn-sub">EMPATE</span>
      </button>
      <button class="pred-btn pred-btn-away${selAway}" onclick="savePred(${m.id},'${m.away}')">
        ${a?a.flag:''} ${a?a.code:'?'}
        <span class="pred-btn-sub">GANA</span>
      </button>
    </div>
    ${resultStrip}
  </div>`;
}

window.savePred = function(matchId, winner) {
  Storage.savePrediction(matchId, winner);
  toast('Pronóstico guardado', 'success');
  const preds   = Storage.getPredictions();
  const results = Storage.getResults();
  renderPredList(preds, results);
};

window.clearPredictions = function() {
  if (!confirm('¿Eliminar TODOS los pronósticos? Esta acción no se puede deshacer.')) return;
  localStorage.removeItem('wc2026_predictions');
  toast('Pronósticos eliminados');
  navigateTo('predictions');
};

/* ═══════════════════════════════════════════════════════════
   STATS VIEW
═══════════════════════════════════════════════════════════ */
function stats(c) {
  const s      = Tournament.getStats();
  const ps     = Tournament.getPredictionStats();
  const total  = s.matchesPlayed || 1;

  c.innerHTML = `
    <div class="section-header"><div class="section-title">ESTADÍSTICAS</div></div>

    <!-- Big numbers -->
    <div class="stats-big fade-in">
      <div class="stat-big"><div class="stat-big-num">${s.matchesPlayed}</div><div class="stat-big-lbl">Partidos jugados</div></div>
      <div class="stat-big"><div class="stat-big-num">${s.totalGoals}</div><div class="stat-big-lbl">Total goles</div></div>
      <div class="stat-big"><div class="stat-big-num">${s.avgGoals}</div><div class="stat-big-lbl">Goles/partido</div></div>
      <div class="stat-big"><div class="stat-big-num" style="color:var(--gold)">${ps.percentage}%</div><div class="stat-big-lbl">Mis aciertos</div></div>
    </div>

    <!-- Results breakdown -->
    <div class="card fade-in" style="margin-bottom:14px">
      <div class="card-header"><h3>📊 Distribución de resultados</h3></div>
      <div style="padding:16px">
        ${resultBar('🟢 Victoria local', s.homeWins, total, 'var(--green)')}
        ${resultBar('🟡 Empate',         s.draws,     total, 'var(--gold)')}
        ${resultBar('🔴 Victoria visitante', s.awayWins, total, 'var(--red)')}
      </div>
    </div>

    <!-- Top goal teams -->
    <div class="card fade-in" style="margin-bottom:14px">
      <div class="card-header"><h3>⚽ Goles por selección</h3></div>
      <div>
        ${s.topScorers.length ? s.topScorers.map((row, i) => `
          <div class="scorer-row">
            <span class="scorer-rank">${i+1}</span>
            <span class="scorer-flag">${row.team.flag}</span>
            <span class="scorer-name">${row.team.name}</span>
            <span class="scorer-bar-wrap">
              <span class="scorer-bar" style="width:${s.topScorers[0].goals>0?Math.round(row.goals/s.topScorers[0].goals*100):0}%"></span>
            </span>
            <span class="scorer-num">${row.goals}</span>
          </div>`).join('')
        : '<div class="empty-state" style="padding:20px"><div class="empty-icon">⚽</div><div class="empty-text">Sin goles registrados</div></div>'}
      </div>
    </div>

    <!-- Predictions detail -->
    <div class="card fade-in" style="margin-bottom:14px">
      <div class="card-header"><h3>🎯 Detalle de pronósticos</h3></div>
      <div style="padding:16px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;text-align:center">
        <div>
          <div style="font-family:var(--font-head);font-size:2rem;color:var(--green)">${ps.correct}</div>
          <div style="font-family:var(--font-cond);font-size:.72rem;color:var(--text-3);text-transform:uppercase">Correctos</div>
        </div>
        <div>
          <div style="font-family:var(--font-head);font-size:2rem;color:var(--red)">${ps.total - ps.correct}</div>
          <div style="font-family:var(--font-cond);font-size:.72rem;color:var(--text-3);text-transform:uppercase">Incorrectos</div>
        </div>
        <div>
          <div style="font-family:var(--font-head);font-size:2rem;color:var(--text-3)">${ps.pending}</div>
          <div style="font-family:var(--font-cond);font-size:.72rem;color:var(--text-3);text-transform:uppercase">Pendientes</div>
        </div>
      </div>
      ${ps.details.length ? `<div style="border-top:1px solid var(--border)">
        ${ps.details.slice(0,10).map(d => {
          const h = WC_TEAMS[d.match.home], a = WC_TEAMS[d.match.away];
          const r = Storage.getResults()[d.match.id];
          return `<div style="display:flex;align-items:center;gap:8px;padding:8px 14px;
                  border-bottom:1px solid var(--border);font-size:.82rem">
            <span>${d.correct ? '✅' : '❌'}</span>
            <span style="flex:1;font-family:var(--font-cond)">${h?h.flag:''} ${h?h.code:d.match.home} ${r?r.homeScore:''} – ${r?r.awayScore:''} ${a?a.code:d.match.away} ${a?a.flag:''}</span>
            <span style="color:var(--text-3)">→ ${d.predicted==='draw'?'Empate':(WC_TEAMS[d.predicted]?.code||d.predicted)}</span>
          </div>`;
        }).join('')}
        ${ps.details.length > 10 ? `<div style="padding:8px 14px;font-size:.78rem;color:var(--text-3);text-align:center">
          y ${ps.details.length-10} más…
        </div>` : ''}
      </div>` : ''}
    </div>`;
}

function resultBar(label, val, total, color) {
  const pct = total > 0 ? Math.round(val / total * 100) : 0;
  return `<div style="margin-bottom:12px">
    <div style="display:flex;justify-content:space-between;font-family:var(--font-cond);font-size:.82rem;margin-bottom:4px">
      <span>${label}</span>
      <span style="color:var(--text-2)">${val} <span style="color:var(--text-3)">(${pct}%)</span></span>
    </div>
    <div style="height:8px;background:var(--border);border-radius:4px;overflow:hidden">
      <div style="width:${pct}%;height:100%;background:${color};border-radius:4px;transition:width .6s ease"></div>
    </div>
  </div>`;
}

/* ═══════════════════════════════════════════════════════════
   MATCH CARD (shared renderer)
═══════════════════════════════════════════════════════════ */
function matchCard(m, opts = {}) {
  const h       = WC_TEAMS[m.home];
  const a       = WC_TEAMS[m.away];
  const venue   = WC_VENUES[m.venue];
  const done    = m.status === 'finished' && m.homeScore !== null && m.homeScore !== undefined;
  const live    = m.status === 'live';
  const pred    = opts.pred;
  const winner  = done ? Tournament.getMatchWinner(m) : null;
  const phaseLbl = PHASE_LABELS[m.phase] || m.phase;

  let scorePart = '';
  if (done) {
    scorePart = `<div class="mc-score-done">${m.homeScore} <span class="mc-score-dash">–</span> ${m.awayScore}</div>
      ${m.homePens !== null ? `<div class="mc-score-pens">Pen: ${m.homePens}–${m.awayPens}</div>` : ''}`;
  } else if (live) {
    scorePart = `<div class="mc-score-done">${m.homeScore??0} – ${m.awayScore??0}</div>
      <div class="live-badge">EN VIVO</div>`;
  } else {
    scorePart = `<div class="mc-score-time">${m.time}</div>`;
  }

  // Prediction badge
  let predBadge = '';
  if (pred) {
    const predName = pred.winner === 'draw' ? 'Empate' : (WC_TEAMS[pred.winner]?.name || pred.winner);
    const correct  = done && winner && pred.winner === (winner || 'draw');
    const wrong    = done && !correct && winner !== null;
    predBadge = `<div class="mc-pred-badge ${done?(correct?'mpb-ok':'mpb-bad'):'mpb-pending'}">
      🎯 ${predName}${done?(correct?' ✅':' ❌'):''}
    </div>`;
  }

  const editBtn = opts.showEdit
    ? `<button class="mc-edit-btn" onclick="openEditModal(${m.id})">✏️ Resultado</button>` : '';

  return `<div class="match-card mc-${m.status||'scheduled'} fade-in">
    <div class="mc-meta">
      <div>
        <span class="mc-phase">${phaseLbl}${m.group?' · Grupo '+m.group:''}</span>
        <span class="mc-date"> · ${fmtDate(m.date)}</span>
      </div>
      <span class="mc-venue">📍 ${venue?.city||''}</span>
    </div>
    <div class="mc-teams">
      <div class="mc-team">
        <span class="mc-flag">${h?h.flag:'🏳'}</span>
        <div class="mc-team-names">
          <div class="mc-code">${h?h.code:m.home}</div>
          <div class="mc-name">${h?h.name:''}</div>
        </div>
      </div>
      <div class="mc-score">${scorePart}</div>
      <div class="mc-team mc-team-away">
        <span class="mc-flag">${a?a.flag:'🏳'}</span>
        <div class="mc-team-names">
          <div class="mc-code">${a?a.code:m.away}</div>
          <div class="mc-name">${a?a.name:''}</div>
        </div>
      </div>
    </div>
    ${!opts.compact ? `<div class="mc-stadium">🏟 ${venue?venue.name+' · '+venue.city+', '+venue.country:''}</div>` : ''}
    ${predBadge}
    ${editBtn ? `<div class="mc-actions">${editBtn}</div>` : ''}
  </div>`;
}

/* ═══════════════════════════════════════════════════════════
   SCORE EDITOR MODAL
═══════════════════════════════════════════════════════════ */
window.openEditModal = function(matchId) {
  editingMatchId = matchId;
  const match  = WC_MATCHES.find(m => m.id === matchId);
  const stored = Storage.getResults()[matchId] || {};
  const h = WC_TEAMS[match.home], a = WC_TEAMS[match.away];

  document.getElementById('modal-title').textContent =
    `${h?h.flag:''} ${h?h.name:match.home}  vs  ${a?a.flag:''} ${a?a.name:match.away}`;
  document.getElementById('modal-home-flag').textContent  = h?h.flag:'🏳';
  document.getElementById('modal-home-name').textContent  = h?h.name:match.home;
  document.getElementById('modal-away-flag').textContent  = a?a.flag:'🏳';
  document.getElementById('modal-away-name').textContent  = a?a.name:match.away;
  document.getElementById('score-home').value  = stored.homeScore ?? '';
  document.getElementById('score-away').value  = stored.awayScore ?? '';
  document.getElementById('pens-home').value   = stored.homePens  ?? '';
  document.getElementById('pens-away').value   = stored.awayPens  ?? '';
  document.getElementById('match-status').value = stored.status || 'finished';

  // Update penalty label text with short team codes
  const hlbl = document.getElementById('pens-home-label');
  const albl = document.getElementById('pens-away-label');
  if (hlbl) hlbl.textContent = h ? h.code : 'Local';
  if (albl) albl.textContent = a ? a.code : 'Visit.';

  const withPens = ['r32','r16','qf','sf','3rd','final'];
  document.getElementById('pens-section').classList.toggle('show', withPens.includes(match.phase));

  document.getElementById('edit-modal').classList.add('open');
  setTimeout(() => document.getElementById('score-home').focus(), 120);
};

window.closeEditModal = function() {
  document.getElementById('edit-modal').classList.remove('open');
  editingMatchId = null;
};

window.saveMatchResult = function() {
  const hs = document.getElementById('score-home').value;
  const as = document.getElementById('score-away').value;
  if (hs === '' || as === '') { toast('Ingresa ambos marcadores', 'error'); return; }
  const homeScore = parseInt(hs), awayScore = parseInt(as);
  if (isNaN(homeScore) || isNaN(awayScore) || homeScore < 0 || awayScore < 0) {
    toast('Marcadores inválidos', 'error'); return;
  }
  const phv = document.getElementById('pens-home').value;
  const pav = document.getElementById('pens-away').value;
  const homePens = phv !== '' ? parseInt(phv) : null;
  const awayPens = pav !== '' ? parseInt(pav) : null;
  const status   = document.getElementById('match-status').value;

  Storage.saveResult(editingMatchId, homeScore, awayScore, homePens, awayPens, status);
  closeEditModal();
  toast('Resultado guardado ⚽', 'success');
  navigateTo(currentView);
};

window.deleteMatchResult = function() {
  if (!confirm('¿Eliminar este resultado?')) return;
  Storage.deleteResult(editingMatchId);
  closeEditModal();
  toast('Resultado eliminado');
  navigateTo(currentView);
};

window.handleModalOverlayClick = function(e) {
  if (e.target.id === 'edit-modal') closeEditModal();
};

/* ═══════════════════════════════════════════════════════════
   QUICK-ADD MODAL
═══════════════════════════════════════════════════════════ */
window.openQuickAdd = function() {
  document.getElementById('quick-search').value = '';
  renderQuickList('');
  document.getElementById('quick-modal').classList.add('open');
  setTimeout(() => document.getElementById('quick-search').focus(), 300);
};

window.closeQuickModal = function() {
  document.getElementById('quick-modal').classList.remove('open');
};

window.handleQuickOverlayClick = function(e) {
  if (e.target.id === 'quick-modal') closeQuickModal();
};

window.filterQuickList = function(q) { renderQuickList(q); };

function renderQuickList(q) {
  const el      = document.getElementById('quick-list');
  if (!el) return;
  const query   = (q||'').toLowerCase();
  const results = Storage.getResults();

  let matches = WC_MATCHES.filter(m => {
    if (!query) return true;
    const h = WC_TEAMS[m.home], a = WC_TEAMS[m.away];
    return (h && (h.name.toLowerCase().includes(query) || h.code.toLowerCase().includes(query)))
        || (a && (a.name.toLowerCase().includes(query) || a.code.toLowerCase().includes(query)))
        || m.date.includes(query)
        || (PHASE_LABELS[m.phase]||'').toLowerCase().includes(query);
  }).slice(0, 40);

  if (!matches.length) {
    el.innerHTML = `<div style="text-align:center;padding:24px;font-family:var(--font-cond);color:var(--text-3)">Sin resultados</div>`;
    return;
  }

  el.innerHTML = matches.map(m => {
    const h = WC_TEAMS[m.home], a = WC_TEAMS[m.away];
    const r = results[m.id];
    const done = r && r.homeScore !== null;
    return `<div class="quick-item" onclick="closeQuickModal();openEditModal(${m.id})">
      <div class="quick-item-teams">
        <span>${h?h.flag:''} ${h?h.code:m.home}</span>
        <span style="color:var(--text-3);font-size:.8rem">vs</span>
        <span>${a?a.code:m.away} ${a?a.flag:''}</span>
      </div>
      <div class="quick-item-meta">${PHASE_LABELS[m.phase]||m.phase}${m.group?' · G'+m.group:''} · ${m.date}</div>
      <div class="quick-item-score">${done?`${r.homeScore}–${r.awayScore}`:m.time}</div>
      <span style="color:var(--text-3)">✏️</span>
    </div>`;
  }).join('');
}

/* ═══════════════════════════════════════════════════════════
   COUNTDOWN
═══════════════════════════════════════════════════════════ */
function startCountdown() {
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTick();
  countdownTimer = setInterval(countdownTick, 1000);
}

function countdownTick() {
  const el = document.getElementById('countdown-display');
  if (!el) { clearInterval(countdownTimer); return; }

  const next = Tournament.getNextMatch();
  if (!next) {
    el.innerHTML = `<div class="countdown-label">🏆 El torneo ha concluido</div>`;
    return;
  }

  const [y,mo,d] = next.date.split('-').map(Number);
  const [h,min]  = next.time.split(':').map(Number);
  const target   = new Date(y, mo-1, d, h, min);
  const diff     = target - new Date();

  const ht = WC_TEAMS[next.home], at = WC_TEAMS[next.away];
  const vn = WC_VENUES[next.venue];

  if (diff <= 0) {
    el.innerHTML = `<div class="countdown-label">Próximo partido</div>
      <div class="countdown-match">${ht?ht.flag:''} ${ht?ht.name:next.home} <span style="opacity:.5">vs</span> ${at?at.flag:''} ${at?at.name:next.away}</div>
      <div class="live-badge" style="display:inline-block;font-size:.9rem;margin-top:8px;padding:5px 18px">EN VIVO AHORA</div>`;
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hrs  = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000)  / 60000);
  const secs = Math.floor((diff % 60000)    / 1000);

  el.innerHTML = `
    <div class="countdown-label">⏱ Próximo partido</div>
    <div class="countdown-match">
      ${ht?ht.flag:'🏳'} ${ht?ht.name:next.home}
      <span style="opacity:.4;margin:0 6px">vs</span>
      ${at?at.flag:'🏳'} ${at?at.name:next.away}
    </div>
    <div class="countdown-venue">📍 ${vn?vn.name+', '+vn.city:''} &nbsp;·&nbsp; ${fmtDate(next.date)} ${next.time} hrs (hora MX)</div>
    <div class="countdown-timer">
      ${[['días',days],['horas',hrs],['min',mins],['seg',secs]].map(([lbl,val])=>`
        <div class="cu"><span class="cu-num">${String(val).padStart(2,'0')}</span><span class="cu-lbl">${lbl}</span></div>
      `).join('')}
    </div>`;
}

/* ═══════════════════════════════════════════════════════════
   PWA INSTALL
═══════════════════════════════════════════════════════════ */
function setupPWAInstall() {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstall = e;
  });
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
  }
}

function checkInstallBanner() {
  const banner = document.getElementById('install-banner');
  if (banner && deferredInstall) banner.classList.add('show');
}

window.triggerInstall = async function() {
  if (!deferredInstall) return;
  deferredInstall.prompt();
  const { outcome } = await deferredInstall.userChoice;
  if (outcome === 'accepted') toast('¡App instalada!', 'success');
  deferredInstall = null;
  document.getElementById('install-banner')?.classList.remove('show');
};

window.dismissInstall = function() {
  document.getElementById('install-banner')?.classList.remove('show');
};

/* ═══════════════════════════════════════════════════════════
   EXPORT / IMPORT
═══════════════════════════════════════════════════════════ */
window.exportPredictionsPDF = function() {
  if (!window.jspdf?.jsPDF) { toast('PDF no disponible, verifica la conexión', 'error'); return; }
  const { jsPDF } = window.jspdf;
  const doc       = new jsPDF({ unit:'mm', format:'a4' });
  const preds     = Storage.getPredictions();
  const results   = Storage.getResults();
  const ps        = Tournament.getPredictionStats();

  // Header
  doc.setFillColor(27,20,100); doc.rect(0,0,210,42,'F');
  doc.setTextColor(212,175,55); doc.setFont('helvetica','bold'); doc.setFontSize(24);
  doc.text('WORLD CUP 2026', 105, 18, {align:'center'});
  doc.setTextColor(255,255,255); doc.setFont('helvetica','normal'); doc.setFontSize(11);
  doc.text('Mis Pronósticos Personales', 105, 27, {align:'center'});
  doc.setFontSize(9);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-MX')}  |  Aciertos: ${ps.percentage}% (${ps.correct}/${ps.total})  |  Pendientes: ${ps.pending}`, 105, 35, {align:'center'});

  let y = 52;
  // Table header
  doc.setFillColor(240,242,248); doc.rect(10,y-5,190,8,'F');
  doc.setTextColor(27,20,100); doc.setFont('helvetica','bold'); doc.setFontSize(9);
  ['#','Partido','Fase','Mi Pronóstico','Resultado'].forEach((h,i) => {
    doc.text(h, [14,20,85,130,165][i], y);
  });
  y += 6; doc.setDrawColor(200,205,230); doc.line(10,y,200,y); y += 5;
  doc.setFont('helvetica','normal'); doc.setFontSize(8);

  WC_MATCHES.forEach((m, idx) => {
    const pred = preds[m.id]; if (!pred) return;
    if (y > 270) { doc.addPage(); y = 20; }
    const h = WC_TEAMS[m.home], a = WC_TEAMS[m.away];
    const r = results[m.id];
    const done = r && r.status === 'finished';
    const winner = done ? Tournament.getMatchWinner({...m,...r}) : null;
    const actual = winner || (done ? 'draw' : null);
    const correct = pred && actual && pred.winner === actual;

    doc.setTextColor(120,120,120); doc.text(String(idx+1), 14, y);
    doc.setTextColor(30,30,30);
    const matchStr = `${h?h.name:m.home} vs ${a?a.name:m.away}`;
    doc.text(matchStr.length > 36 ? matchStr.substring(0,34)+'…' : matchStr, 20, y);
    doc.setTextColor(100,100,120);
    doc.text((PHASE_LABELS[m.phase]||m.phase).substring(0,14), 85, y);
    doc.setTextColor(27,20,100); doc.setFont('helvetica','bold');
    const predLabel = pred.winner==='draw'?'Empate':(WC_TEAMS[pred.winner]?.name||pred.winner);
    doc.text(predLabel.substring(0,16), 130, y);
    doc.setFont('helvetica','normal');
    if (done) {
      if (correct) { doc.setTextColor(0,150,80); doc.text('✓ Correcto', 165, y); }
      else         { doc.setTextColor(220,0,20); doc.text('✗ Incorrecto', 165, y); }
    } else { doc.setTextColor(160,160,160); doc.text('— Pendiente', 165, y); }
    y += 7;
    doc.setDrawColor(230,232,240); doc.line(10, y-2, 200, y-2);
  });

  // Footer
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setTextColor(180,180,200); doc.setFontSize(7);
    doc.text(`World Cup 2026 App  ·  Página ${i} de ${pages}`, 105, 288, {align:'center'});
  }

  doc.save('WorldCup2026_Pronosticos.pdf');
  toast('PDF exportado correctamente', 'success');
};

window.exportDataJSON = function() {
  const data = Storage.exportAll();
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `WC2026_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click(); URL.revokeObjectURL(url);
  toast('Datos exportados', 'success');
};

window.importJSON = function(event) {
  const file = event.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!confirm('¿Importar datos? Esto sobreescribirá los actuales.')) return;
      Storage.importAll(data);
      toast('Datos importados correctamente', 'success');
      navigateTo(currentView);
    } catch {
      toast('Archivo JSON inválido', 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
};

window.confirmClear = function() {
  if (!confirm('¿BORRAR TODOS LOS DATOS? Esto eliminará resultados y pronósticos. Esta acción no se puede deshacer.')) return;
  Storage.clearAll();
  toast('Todos los datos eliminados');
  navigateTo('home');
};

/* ═══════════════════════════════════════════════════════════
   DATE HELPERS
═══════════════════════════════════════════════════════════ */
function fmtDate(dateStr) {
  const [y,mo,d] = dateStr.split('-').map(Number);
  return new Date(y, mo-1, d).toLocaleDateString('es-MX', {
    weekday:'short', day:'numeric', month:'short'
  });
}

function fmtDateShort(dateStr) {
  const [y,mo,d] = dateStr.split('-').map(Number);
  return new Date(y, mo-1, d).toLocaleDateString('es-MX', {
    day:'numeric', month:'short'
  });
}
