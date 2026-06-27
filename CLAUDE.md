# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

World Cup 2026 PWA — a single-page app for tracking matches, group standings, knockout brackets, and user predictions for the 2026 FIFA World Cup. Pure HTML/CSS/JS, no build step, no frameworks, no package manager. Spanish-language UI.

## Running / developing

There is no build process. Serve the directory with any static file server and open `index.html` (a service worker is registered, so `file://` won't work reliably — use e.g. `npx serve` or VS Code's Live Server). There are no tests or lint configs in this repo.

## Architecture

Five plain `<script>` files loaded in order via `index.html`, each attaching globals (no modules/bundler):

1. **`js/data.js`** — Static tournament data: `WC_TEAMS` (48 teams), `WC_GROUPS` (A–L), `WC_VENUES` (16 stadiums), `WC_MATCHES_GROUP` + `WC_MATCHES_KNOCKOUT` combined into `WC_MATCHES` (104 matches total, built via the `mkm()` helper). Knockout matches reference unresolved slots (e.g. group position or bracket winner/loser placeholders) rather than fixed team IDs, since those depend on group results. The 8 Round-of-32 matches that pair a group winner against a best third-placed team use an away slot like `'3ABCDF'` — the letters are the *candidate* groups that could supply that opponent, not the resolved one.

2. **`js/thirdPlaceMatrix.js`** — `WC_THIRD_PLACE_MATRIX`: FIFA's official 495-row table (`C(12,8)`) mapping every possible combination of 8 qualified third-placed groups to which group-winner each one faces, so no team meets a group-stage opponent again in the Round of 32. Generated from `scripts/FWC26_matriz_emparejamientos.csv` via `scripts/gen-third-place-matrix.cjs` (which also validates the data — 495 distinct combinations, no self-pairings); regenerate rather than hand-edit if FIFA revises the table.

3. **`js/storage.js`** — Thin `Storage` object wrapping `localStorage`. Four keys: `wc2026_results` (entered scores), `wc2026_predictions` (user's predicted winners), `wc2026_knockout` (resolved team IDs for knockout slots), `wc2026_settings`. Also provides `exportAll()`/`importAll()`/`clearAll()` for JSON backup.

4. **`js/tournament.js`** — `Tournament` object, the core domain logic. `getMatches()` merges static `WC_MATCHES` with stored results. `getGroupStandings()` computes the standard pts/gd/gf sort. `getBestThirds()` picks the 8 best third-place teams. `resolveSlot()` walks the bracket to turn a knockout slot placeholder into an actual team using real results — including, for the `'3ABCDF'`-style slots, looking up `WC_THIRD_PLACE_MATRIX` via `resolveBestThirdSlot()`/`findThirdPlaceRow()` so the 8 thirds-to-winners pairing is resolved as one consistent set rather than per-slot (per-slot "best of candidates" picking caused the same team to be double-booked into multiple matches). `resolveSlotByPredictions()` mirrors all of this using the user's predictions instead, so the bracket/predictions UI can show a fully projected tournament even before matches are played. `updateKnockout()` just snapshots `resolveSlot()` results into `Storage` for export/import — it is not itself a source of truth, so don't reintroduce a second copy of the resolution logic there.

5. **`js/app.js`** — All views/rendering and event handling (~1100 lines, no router library). `currentView`/`currentGroup`/`currentPhase` are module-level state; `navigateTo(view)` switches the rendered view. Views are plain functions returning HTML strings (`home`, `calendar`, `groups`, `bracket`, `predictions`, `stats`). Inline `onclick` handlers in the generated HTML call functions explicitly attached to `window` (e.g. `window.saveMatchResult`, `window.savePred`, `window.openEditModal`) since there's no event delegation framework — when adding new interactive elements, follow this same `window.fn = function(){}` pattern so inline handlers can find them.

## Key conventions

- Match/team/venue IDs and shapes are defined once in `data.js` — don't duplicate tournament data elsewhere.
- Any new persisted state should go through `Storage`, with a new key added to `STORAGE_KEYS` in `js/storage.js`, and wired into `exportAll()`/`importAll()`/`clearAll()`.
- Knockout bracket logic is order-dependent (later rounds resolve via earlier ones) — see `resolveSlot`/`resolveSlotByPredictions` in `js/tournament.js` before changing bracket structure. Always resolve knockout slots live via `resolveSlot()`/`resolveSlotByPredictions()`, never from the `wc2026_knockout` cache directly — that cache is a point-in-time export snapshot and goes stale as soon as group results change.
- PDF export (`exportPredictionsPDF` in `js/app.js`) depends on the jsPDF UMD bundle loaded via CDN `<script>` in `index.html`.
- `sw.js` is a service worker for offline caching; bump its cache name/version when changing cached assets so users get updates.
