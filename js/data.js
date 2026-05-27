// ============================================================
// WORLD CUP 2026 — TOURNAMENT DATA (Complete)
// ============================================================

const WC_TEAMS = {
  // GROUP A — MEXICO (host)
  MEX: { id:'MEX', name:'México',           code:'MEX', flag:'🇲🇽', confederation:'CONCACAF', group:'A' },
  ECU: { id:'ECU', name:'Ecuador',          code:'ECU', flag:'🇪🇨', confederation:'CONMEBOL', group:'A' },
  VEN: { id:'VEN', name:'Venezuela',        code:'VEN', flag:'🇻🇪', confederation:'CONMEBOL', group:'A' },
  JAM: { id:'JAM', name:'Jamaica',          code:'JAM', flag:'🇯🇲', confederation:'CONCACAF', group:'A' },
  // GROUP B — USA (host)
  USA: { id:'USA', name:'Estados Unidos',   code:'USA', flag:'🇺🇸', confederation:'CONCACAF', group:'B' },
  PAN: { id:'PAN', name:'Panamá',           code:'PAN', flag:'🇵🇦', confederation:'CONCACAF', group:'B' },
  UKR: { id:'UKR', name:'Ucrania',          code:'UKR', flag:'🇺🇦', confederation:'UEFA',     group:'B' },
  ALB: { id:'ALB', name:'Albania',          code:'ALB', flag:'🇦🇱', confederation:'UEFA',     group:'B' },
  // GROUP C — CANADA (host)
  CAN: { id:'CAN', name:'Canadá',           code:'CAN', flag:'🇨🇦', confederation:'CONCACAF', group:'C' },
  MAR: { id:'MAR', name:'Marruecos',        code:'MAR', flag:'🇲🇦', confederation:'CAF',      group:'C' },
  ALG: { id:'ALG', name:'Argelia',          code:'ALG', flag:'🇩🇿', confederation:'CAF',      group:'C' },
  HON: { id:'HON', name:'Honduras',         code:'HON', flag:'🇭🇳', confederation:'CONCACAF', group:'C' },
  // GROUP D
  FRA: { id:'FRA', name:'Francia',          code:'FRA', flag:'🇫🇷', confederation:'UEFA',     group:'D' },
  NED: { id:'NED', name:'Países Bajos',     code:'NED', flag:'🇳🇱', confederation:'UEFA',     group:'D' },
  BEL: { id:'BEL', name:'Bélgica',          code:'BEL', flag:'🇧🇪', confederation:'UEFA',     group:'D' },
  SRB: { id:'SRB', name:'Serbia',           code:'SRB', flag:'🇷🇸', confederation:'UEFA',     group:'D' },
  // GROUP E
  ESP: { id:'ESP', name:'España',           code:'ESP', flag:'🇪🇸', confederation:'UEFA',     group:'E' },
  GER: { id:'GER', name:'Alemania',         code:'GER', flag:'🇩🇪', confederation:'UEFA',     group:'E' },
  POR: { id:'POR', name:'Portugal',         code:'POR', flag:'🇵🇹', confederation:'UEFA',     group:'E' },
  SCO: { id:'SCO', name:'Escocia',          code:'SCO', flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation:'UEFA',     group:'E' },
  // GROUP F
  ARG: { id:'ARG', name:'Argentina',        code:'ARG', flag:'🇦🇷', confederation:'CONMEBOL', group:'F' },
  CHI: { id:'CHI', name:'Chile',            code:'CHI', flag:'🇨🇱', confederation:'CONMEBOL', group:'F' },
  PER: { id:'PER', name:'Perú',             code:'PER', flag:'🇵🇪', confederation:'CONMEBOL', group:'F' },
  AUS: { id:'AUS', name:'Australia',        code:'AUS', flag:'🇦🇺', confederation:'AFC',      group:'F' },
  // GROUP G
  BRA: { id:'BRA', name:'Brasil',           code:'BRA', flag:'🇧🇷', confederation:'CONMEBOL', group:'G' },
  COL: { id:'COL', name:'Colombia',         code:'COL', flag:'🇨🇴', confederation:'CONMEBOL', group:'G' },
  URU: { id:'URU', name:'Uruguay',          code:'URU', flag:'🇺🇾', confederation:'CONMEBOL', group:'G' },
  KOR: { id:'KOR', name:'Corea del Sur',    code:'KOR', flag:'🇰🇷', confederation:'AFC',      group:'G' },
  // GROUP H
  ENG: { id:'ENG', name:'Inglaterra',       code:'ENG', flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation:'UEFA',     group:'H' },
  SEN: { id:'SEN', name:'Senegal',          code:'SEN', flag:'🇸🇳', confederation:'CAF',      group:'H' },
  NGA: { id:'NGA', name:'Nigeria',          code:'NGA', flag:'🇳🇬', confederation:'CAF',      group:'H' },
  TUN: { id:'TUN', name:'Túnez',            code:'TUN', flag:'🇹🇳', confederation:'CAF',      group:'H' },
  // GROUP I
  TUR: { id:'TUR', name:'Turquía',          code:'TUR', flag:'🇹🇷', confederation:'UEFA',     group:'I' },
  ITA: { id:'ITA', name:'Italia',           code:'ITA', flag:'🇮🇹', confederation:'UEFA',     group:'I' },
  SUI: { id:'SUI', name:'Suiza',            code:'SUI', flag:'🇨🇭', confederation:'UEFA',     group:'I' },
  ROU: { id:'ROU', name:'Rumanía',          code:'ROU', flag:'🇷🇴', confederation:'UEFA',     group:'I' },
  // GROUP J
  CRO: { id:'CRO', name:'Croacia',          code:'CRO', flag:'🇭🇷', confederation:'UEFA',     group:'J' },
  DEN: { id:'DEN', name:'Dinamarca',        code:'DEN', flag:'🇩🇰', confederation:'UEFA',     group:'J' },
  HUN: { id:'HUN', name:'Hungría',          code:'HUN', flag:'🇭🇺', confederation:'UEFA',     group:'J' },
  CZE: { id:'CZE', name:'Chequia',          code:'CZE', flag:'🇨🇿', confederation:'UEFA',     group:'J' },
  // GROUP K
  JPN: { id:'JPN', name:'Japón',            code:'JPN', flag:'🇯🇵', confederation:'AFC',      group:'K' },
  IRN: { id:'IRN', name:'Irán',             code:'IRN', flag:'🇮🇷', confederation:'AFC',      group:'K' },
  KSA: { id:'KSA', name:'Arabia Saudita',   code:'KSA', flag:'🇸🇦', confederation:'AFC',      group:'K' },
  NZL: { id:'NZL', name:'Nueva Zelanda',    code:'NZL', flag:'🇳🇿', confederation:'OFC',      group:'K' },
  // GROUP L
  RSA: { id:'RSA', name:'Sudáfrica',        code:'RSA', flag:'🇿🇦', confederation:'CAF',      group:'L' },
  COD: { id:'COD', name:'RD Congo',         code:'COD', flag:'🇨🇩', confederation:'CAF',      group:'L' },
  CIV: { id:'CIV', name:'Costa de Marfil',  code:'CIV', flag:'🇨🇮', confederation:'CAF',      group:'L' },
  EGY: { id:'EGY', name:'Egipto',           code:'EGY', flag:'🇪🇬', confederation:'CAF',      group:'L' },
};

const WC_GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

const WC_VENUES = {
  AZTECA:   { name:'Estadio Azteca',            city:'Ciudad de México', country:'México',        capacity:87523, flag:'🇲🇽' },
  BBVA:     { name:'Estadio BBVA',              city:'Monterrey',        country:'México',        capacity:53500, flag:'🇲🇽' },
  AKRON:    { name:'Estadio Akron',             city:'Guadalajara',      country:'México',        capacity:46732, flag:'🇲🇽' },
  METLIFE:  { name:'MetLife Stadium',           city:'Nueva York/NJ',    country:'EE. UU.',       capacity:82500, flag:'🇺🇸' },
  ATT:      { name:'AT&T Stadium',              city:'Dallas',           country:'EE. UU.',       capacity:80000, flag:'🇺🇸' },
  SOFI:     { name:'SoFi Stadium',              city:'Los Ángeles',      country:'EE. UU.',       capacity:70240, flag:'🇺🇸' },
  LEVIS:    { name:"Levi's Stadium",            city:'San Francisco',    country:'EE. UU.',       capacity:68500, flag:'🇺🇸' },
  HARD:     { name:'Hard Rock Stadium',         city:'Miami',            country:'EE. UU.',       capacity:65326, flag:'🇺🇸' },
  ARROW:    { name:'Arrowhead Stadium',         city:'Kansas City',      country:'EE. UU.',       capacity:76416, flag:'🇺🇸' },
  GILLETTE: { name:'Gillette Stadium',          city:'Boston',           country:'EE. UU.',       capacity:65878, flag:'🇺🇸' },
  LINCOLN:  { name:'Lincoln Financial Field',   city:'Filadelfia',       country:'EE. UU.',       capacity:69328, flag:'🇺🇸' },
  LUMEN:    { name:'Lumen Field',               city:'Seattle',          country:'EE. UU.',       capacity:69000, flag:'🇺🇸' },
  MERCEDES: { name:'Mercedes-Benz Stadium',     city:'Atlanta',          country:'EE. UU.',       capacity:71000, flag:'🇺🇸' },
  BC:       { name:'BC Place',                  city:'Vancouver',        country:'Canadá',        capacity:54500, flag:'🇨🇦' },
  BMO:      { name:'BMO Field',                 city:'Toronto',          country:'Canadá',        capacity:45736, flag:'🇨🇦' },
};

// Labels for each phase
const PHASE_LABELS = {
  group: 'Fase de Grupos',
  r32:   'Ronda de 32',
  r16:   'Octavos de Final',
  qf:    'Cuartos de Final',
  sf:    'Semifinales',
  '3rd': 'Tercer Lugar',
  final: 'Gran Final',
};

// ─── Match helper ───────────────────────────────────────────
let _matchId = 1;
function mkm(date, time, home, away, venueKey, group, matchday) {
  return {
    id: _matchId++,
    date, time, home, away,
    venue: venueKey,
    group: group || null,
    matchday: matchday || null,
    phase: group ? 'group' : null,
    homeScore: null, awayScore: null,
    status: 'scheduled',
    homePens: null, awayPens: null
  };
}

// ============================================================
// GROUP STAGE — 72 matches  (Matchday 1: Jun 11-17 | MD2: Jun 18-24 | MD3: Jun 25-27)
// Times in Mexico City local (UTC-6)
// ============================================================
const WC_MATCHES_GROUP = [
  // ── GRUPO A ──────────────────────────────────────────────
  mkm('2026-06-11','19:00','MEX','ECU','AZTECA',  'A',1),
  mkm('2026-06-11','22:00','VEN','JAM','BBVA',    'A',1),
  mkm('2026-06-18','19:00','MEX','VEN','AKRON',   'A',2),
  mkm('2026-06-18','22:00','ECU','JAM','AZTECA',  'A',2),
  mkm('2026-06-25','18:00','MEX','JAM','BBVA',    'A',3),
  mkm('2026-06-25','18:00','ECU','VEN','AKRON',   'A',3),
  // ── GRUPO B ──────────────────────────────────────────────
  mkm('2026-06-12','19:00','USA','PAN','METLIFE', 'B',1),
  mkm('2026-06-12','22:00','UKR','ALB','GILLETTE','B',1),
  mkm('2026-06-19','19:00','USA','UKR','ATT',     'B',2),
  mkm('2026-06-19','22:00','PAN','ALB','LINCOLN', 'B',2),
  mkm('2026-06-25','22:00','USA','ALB','METLIFE', 'B',3),
  mkm('2026-06-25','22:00','PAN','UKR','GILLETTE','B',3),
  // ── GRUPO C ──────────────────────────────────────────────
  mkm('2026-06-12','16:00','CAN','MAR','BC',      'C',1),
  mkm('2026-06-12','13:00','ALG','HON','BMO',     'C',1),
  mkm('2026-06-19','16:00','CAN','ALG','BC',      'C',2),
  mkm('2026-06-19','13:00','MAR','HON','BMO',     'C',2),
  mkm('2026-06-26','15:00','CAN','HON','BC',      'C',3),
  mkm('2026-06-26','15:00','MAR','ALG','BMO',     'C',3),
  // ── GRUPO D ──────────────────────────────────────────────
  mkm('2026-06-13','16:00','FRA','BEL','METLIFE', 'D',1),
  mkm('2026-06-13','19:00','NED','SRB','HARD',    'D',1),
  mkm('2026-06-20','16:00','FRA','NED','LINCOLN', 'D',2),
  mkm('2026-06-20','19:00','BEL','SRB','MERCEDES','D',2),
  mkm('2026-06-26','18:00','FRA','SRB','METLIFE', 'D',3),
  mkm('2026-06-26','18:00','NED','BEL','HARD',    'D',3),
  // ── GRUPO E ──────────────────────────────────────────────
  mkm('2026-06-14','16:00','ESP','SCO','SOFI',    'E',1),
  mkm('2026-06-14','19:00','GER','POR','ATT',     'E',1),
  mkm('2026-06-21','16:00','ESP','GER','LEVIS',   'E',2),
  mkm('2026-06-21','19:00','POR','SCO','SOFI',    'E',2),
  mkm('2026-06-27','18:00','ESP','POR','ATT',     'E',3),
  mkm('2026-06-27','18:00','GER','SCO','SOFI',    'E',3),
  // ── GRUPO F ──────────────────────────────────────────────
  mkm('2026-06-14','22:00','ARG','CHI','METLIFE', 'F',1),
  mkm('2026-06-14','13:00','PER','AUS','LEVIS',   'F',1),
  mkm('2026-06-21','22:00','ARG','PER','ARROW',   'F',2),
  mkm('2026-06-21','13:00','CHI','AUS','LEVIS',   'F',2),
  mkm('2026-06-27','21:00','ARG','AUS','METLIFE', 'F',3),
  mkm('2026-06-27','21:00','CHI','PER','ARROW',   'F',3),
  // ── GRUPO G ──────────────────────────────────────────────
  mkm('2026-06-15','19:00','BRA','COL','SOFI',    'G',1),
  mkm('2026-06-15','22:00','URU','KOR','LUMEN',   'G',1),
  mkm('2026-06-22','19:00','BRA','URU','ATT',     'G',2),
  mkm('2026-06-22','22:00','COL','KOR','SOFI',    'G',2),
  mkm('2026-06-27','21:00','BRA','KOR','LEVIS',   'G',3),
  mkm('2026-06-27','21:00','URU','COL','ATT',     'G',3),
  // ── GRUPO H ──────────────────────────────────────────────
  mkm('2026-06-15','13:00','ENG','NGA','METLIFE', 'H',1),
  mkm('2026-06-15','16:00','SEN','TUN','LINCOLN', 'H',1),
  mkm('2026-06-22','13:00','ENG','SEN','ARROW',   'H',2),
  mkm('2026-06-22','16:00','NGA','TUN','MERCEDES','H',2),
  mkm('2026-06-26','21:00','ENG','TUN','METLIFE', 'H',3),
  mkm('2026-06-26','21:00','SEN','NGA','LINCOLN', 'H',3),
  // ── GRUPO I ──────────────────────────────────────────────
  mkm('2026-06-16','16:00','TUR','ROU','ATT',     'I',1),
  mkm('2026-06-16','19:00','ITA','SUI','HARD',    'I',1),
  mkm('2026-06-23','16:00','TUR','ITA','LUMEN',   'I',2),
  mkm('2026-06-23','19:00','ROU','SUI','MERCEDES','I',2),
  mkm('2026-06-27','15:00','TUR','SUI','ATT',     'I',3),
  mkm('2026-06-27','15:00','ITA','ROU','HARD',    'I',3),
  // ── GRUPO J ──────────────────────────────────────────────
  mkm('2026-06-16','13:00','CRO','CZE','LEVIS',   'J',1),
  mkm('2026-06-16','22:00','DEN','HUN','LINCOLN', 'J',1),
  mkm('2026-06-23','13:00','CRO','DEN','MERCEDES','J',2),
  mkm('2026-06-23','22:00','CZE','HUN','ATT',     'J',2),
  mkm('2026-06-26','15:00','CRO','HUN','LEVIS',   'J',3),
  mkm('2026-06-26','15:00','DEN','CZE','LINCOLN', 'J',3),
  // ── GRUPO K ──────────────────────────────────────────────
  mkm('2026-06-17','16:00','JPN','IRN','SOFI',    'K',1),
  mkm('2026-06-17','19:00','KSA','NZL','LEVIS',   'K',1),
  mkm('2026-06-24','16:00','JPN','KSA','LUMEN',   'K',2),
  mkm('2026-06-24','19:00','IRN','NZL','SOFI',    'K',2),
  mkm('2026-06-27','12:00','JPN','NZL','SOFI',    'K',3),
  mkm('2026-06-27','12:00','IRN','KSA','LUMEN',   'K',3),
  // ── GRUPO L ──────────────────────────────────────────────
  mkm('2026-06-17','13:00','RSA','EGY','GILLETTE','L',1),
  mkm('2026-06-17','22:00','COD','CIV','ARROW',   'L',1),
  mkm('2026-06-24','13:00','RSA','COD','MERCEDES','L',2),
  mkm('2026-06-24','22:00','EGY','CIV','GILLETTE','L',2),
  mkm('2026-06-26','12:00','RSA','CIV','GILLETTE','L',3),
  mkm('2026-06-26','12:00','EGY','COD','ARROW',   'L',3),
];
// _matchId is now 73 — knockout IDs start at 101 to avoid collision
_matchId = 101;

// ============================================================
// KNOCKOUT STAGE — IDs start at 101
// Slot labels: '1A' = 1st Group A, 'W101' = winner match 101
// ============================================================
const WC_MATCHES_KNOCKOUT = [
  // ── RONDA DE 32 (16 matches) — Jun 29 – Jul 5 ────────────
  { id:101,date:'2026-06-29',time:'16:00',home:'1A', away:'3DEF',venue:'AZTECA',  phase:'r32',slot:'R32-1', homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:102,date:'2026-06-29',time:'19:00',home:'1C', away:'3ABF',venue:'BC',      phase:'r32',slot:'R32-2', homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:103,date:'2026-06-30',time:'16:00',home:'1B', away:'3ACD',venue:'METLIFE', phase:'r32',slot:'R32-3', homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:104,date:'2026-06-30',time:'19:00',home:'2A', away:'2B',  venue:'BBVA',    phase:'r32',slot:'R32-4', homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:105,date:'2026-07-01',time:'16:00',home:'1D', away:'3EFG',venue:'LINCOLN', phase:'r32',slot:'R32-5', homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:106,date:'2026-07-01',time:'19:00',home:'1F', away:'3GHI',venue:'HARD',    phase:'r32',slot:'R32-6', homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:107,date:'2026-07-02',time:'16:00',home:'1E', away:'3IJK',venue:'ATT',     phase:'r32',slot:'R32-7', homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:108,date:'2026-07-02',time:'19:00',home:'2C', away:'2D',  venue:'BMO',     phase:'r32',slot:'R32-8', homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:109,date:'2026-07-02',time:'22:00',home:'1G', away:'3JKL',venue:'SOFI',    phase:'r32',slot:'R32-9', homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:110,date:'2026-07-03',time:'16:00',home:'1H', away:'3ABG',venue:'ARROW',   phase:'r32',slot:'R32-10',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:111,date:'2026-07-03',time:'19:00',home:'2E', away:'2F',  venue:'MERCEDES',phase:'r32',slot:'R32-11',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:112,date:'2026-07-03',time:'22:00',home:'1I', away:'3BHK',venue:'LUMEN',   phase:'r32',slot:'R32-12',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:113,date:'2026-07-04',time:'16:00',home:'1J', away:'3ACL',venue:'LEVIS',   phase:'r32',slot:'R32-13',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:114,date:'2026-07-04',time:'19:00',home:'2G', away:'2H',  venue:'METLIFE', phase:'r32',slot:'R32-14',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:115,date:'2026-07-04',time:'22:00',home:'1K', away:'3BIL',venue:'GILLETTE',phase:'r32',slot:'R32-15',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:116,date:'2026-07-05',time:'19:00',home:'2I', away:'2J',  venue:'AZTECA',  phase:'r32',slot:'R32-16',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  // ── OCTAVOS DE FINAL (8 matches) — Jul 5–8 ───────────────
  { id:201,date:'2026-07-05',time:'12:00',home:'W101',away:'W102',venue:'BBVA',    phase:'r16',slot:'R16-1',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:202,date:'2026-07-05',time:'22:00',home:'W103',away:'W104',venue:'METLIFE', phase:'r16',slot:'R16-2',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:203,date:'2026-07-06',time:'16:00',home:'W105',away:'W106',venue:'ATT',     phase:'r16',slot:'R16-3',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:204,date:'2026-07-06',time:'19:00',home:'W107',away:'W108',venue:'SOFI',    phase:'r16',slot:'R16-4',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:205,date:'2026-07-07',time:'16:00',home:'W109',away:'W110',venue:'BC',      phase:'r16',slot:'R16-5',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:206,date:'2026-07-07',time:'19:00',home:'W111',away:'W112',venue:'LINCOLN', phase:'r16',slot:'R16-6',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:207,date:'2026-07-08',time:'16:00',home:'W113',away:'W114',venue:'MERCEDES',phase:'r16',slot:'R16-7',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:208,date:'2026-07-08',time:'19:00',home:'W115',away:'W116',venue:'LUMEN',   phase:'r16',slot:'R16-8',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  // ── CUARTOS DE FINAL (4 matches) — Jul 11–12 ─────────────
  { id:301,date:'2026-07-11',time:'15:00',home:'W201',away:'W202',venue:'AZTECA',  phase:'qf',slot:'QF-1',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:302,date:'2026-07-11',time:'19:00',home:'W203',away:'W204',venue:'METLIFE', phase:'qf',slot:'QF-2',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:303,date:'2026-07-12',time:'15:00',home:'W205',away:'W206',venue:'ATT',     phase:'qf',slot:'QF-3',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:304,date:'2026-07-12',time:'19:00',home:'W207',away:'W208',venue:'SOFI',    phase:'qf',slot:'QF-4',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  // ── SEMIFINALES (2 matches) — Jul 15–16 ──────────────────
  { id:401,date:'2026-07-15',time:'19:00',home:'W301',away:'W302',venue:'METLIFE', phase:'sf',slot:'SF-1',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:402,date:'2026-07-16',time:'19:00',home:'W303',away:'W304',venue:'AZTECA',  phase:'sf',slot:'SF-2',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  // ── TERCER LUGAR — Jul 18 ────────────────────────────────
  { id:501,date:'2026-07-18',time:'15:00',home:'L401',away:'L402',venue:'ATT',     phase:'3rd',slot:'3RD',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  // ── GRAN FINAL — Jul 19 ──────────────────────────────────
  { id:502,date:'2026-07-19',time:'18:00',home:'W401',away:'W402',venue:'METLIFE', phase:'final',slot:'FINAL',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
];

const WC_MATCHES = [...WC_MATCHES_GROUP, ...WC_MATCHES_KNOCKOUT];
