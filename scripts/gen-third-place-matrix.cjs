// One-off generator: converts FWC26_matriz_emparejamientos.csv (FIFA's official
// 495-row best-third-place ↔ group-winner pairing matrix) into js/thirdPlaceMatrix.js.
// Run with: node scripts/gen-third-place-matrix.cjs <path-to-csv>
const fs   = require('fs');
const path = require('path');

const csvPath = process.argv[2] || path.join(__dirname, 'FWC26_matriz_emparejamientos.csv');

const raw   = fs.readFileSync(csvPath, 'utf8');
const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);

const header = lines[0].split(',').map(s => s.trim());
// header: Opcion,1A,1B,1D,1E,1G,1I,1K,1L
const winnerGroups = header.slice(1).map(h => h.replace(/^1/, ''));

const rows = lines.slice(1).map((line, idx) => {
  const cells = line.split(',').map(s => s.trim());
  const opcion = cells[0];
  const values = cells.slice(1);
  if (values.length !== winnerGroups.length) {
    throw new Error(`Row ${idx + 2} (Opcion ${opcion}) has ${values.length} values, expected ${winnerGroups.length}`);
  }
  const entry = {};
  winnerGroups.forEach((g, i) => {
    entry[g] = values[i].replace(/^3/, '');
  });
  return entry;
});

// ── Validation ───────────────────────────────────────────────
const ALL_GROUPS = 'ABCDEFGHIJKL'.split('');
let problems = [];

if (rows.length !== 495) problems.push(`Expected 495 rows, got ${rows.length}`);

const seenSets = new Set();
rows.forEach((row, i) => {
  const vals = Object.values(row);
  const uniq = new Set(vals);
  if (uniq.size !== vals.length) problems.push(`Row ${i + 1}: duplicate third-place group within row (${vals.join(',')})`);
  vals.forEach(v => { if (!ALL_GROUPS.includes(v)) problems.push(`Row ${i + 1}: unknown group letter "${v}"`); });
  winnerGroups.forEach(g => { if (row[g] === g) problems.push(`Row ${i + 1}: winner group ${g} paired against its own group's third place (self-pairing)`); });

  const setKey = vals.slice().sort().join('');
  if (seenSets.has(setKey)) problems.push(`Row ${i + 1}: third-place set ${setKey} duplicates an earlier row`);
  seenSets.add(setKey);
});

if (seenSets.size !== 495) problems.push(`Expected 495 distinct third-place combinations, got ${seenSets.size}`);

if (problems.length) {
  console.error('VALIDATION FAILED:\n' + problems.slice(0, 30).join('\n'));
  process.exit(1);
}
console.log(`Validation OK: ${rows.length} rows, ${seenSets.size} distinct combinations, winner groups = [${winnerGroups.join(',')}]`);

// ── Emit js/thirdPlaceMatrix.js ────────────────────────────────
const outPath = path.join(__dirname, '..', 'js', 'thirdPlaceMatrix.js');
const lines_out = rows.map(row => {
  const inner = winnerGroups.map(g => `${g}:'${row[g]}'`).join(',');
  return `  {${inner}},`;
});

const content = `// ============================================================
// WORLD CUP 2026 — OFFICIAL THIRD-PLACE / GROUP-WINNER MATRIX
// ============================================================
// Source: FIFA's published 495-combination matrix (C(12,8) = 495) pairing
// the 8 best third-placed teams with the 8 group winners who face a third
// place team in the Round of 32 (1A, 1B, 1D, 1E, 1G, 1I, 1K, 1L), arranged
// so no team meets a group-stage opponent again at this stage.
//
// Each entry maps winnerGroup -> thirdPlaceGroup, e.g. {A:'E', ...} means
// "the winner of Group A faces the 3rd-placed team of Group E". There is
// exactly one entry per possible set of 8 qualified third-placed groups.
// Regenerate with: node scripts/gen-third-place-matrix.cjs <csv>

const WC_THIRD_PLACE_MATRIX = [
${lines_out.join('\n')}
];
`;

fs.writeFileSync(outPath, content, 'utf8');
console.log(`Wrote ${outPath} (${rows.length} entries)`);
