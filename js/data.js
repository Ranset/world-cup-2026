// ============================================================
// WORLD CUP 2026 — OFFICIAL TOURNAMENT DATA
// ============================================================

const WC_TEAMS = {

  // GROUP A
  MEX: { id:'MEX', name:'México',                code:'MEX', flag:'🇲🇽', confederation:'CONCACAF', group:'A' },
  RSA: { id:'RSA', name:'Sudáfrica',             code:'RSA', flag:'🇿🇦', confederation:'CAF',      group:'A' },
  KOR: { id:'KOR', name:'Corea del Sur',         code:'KOR', flag:'🇰🇷', confederation:'AFC',      group:'A' },
  CZE: { id:'CZE', name:'República Checa',       code:'CZE', flag:'🇨🇿', confederation:'UEFA',     group:'A' },

  // GROUP B
  CAN: { id:'CAN', name:'Canadá',                code:'CAN', flag:'🇨🇦', confederation:'CONCACAF', group:'B' },
  BIH: { id:'BIH', name:'Bosnia y Herzegovina',  code:'BIH', flag:'🇧🇦', confederation:'UEFA',     group:'B' },
  QAT: { id:'QAT', name:'Qatar',                 code:'QAT', flag:'🇶🇦', confederation:'AFC',      group:'B' },
  SUI: { id:'SUI', name:'Suiza',                 code:'SUI', flag:'🇨🇭', confederation:'UEFA',     group:'B' },

  // GROUP C
  BRA: { id:'BRA', name:'Brasil',                code:'BRA', flag:'🇧🇷', confederation:'CONMEBOL', group:'C' },
  MAR: { id:'MAR', name:'Marruecos',             code:'MAR', flag:'🇲🇦', confederation:'CAF',      group:'C' },
  HAI: { id:'HAI', name:'Haití',                 code:'HAI', flag:'🇭🇹', confederation:'CONCACAF', group:'C' },
  SCO: { id:'SCO', name:'Escocia',               code:'SCO', flag:'🏴', confederation:'UEFA',     group:'C' },

  // GROUP D
  USA: { id:'USA', name:'Estados Unidos',        code:'USA', flag:'🇺🇸', confederation:'CONCACAF', group:'D' },
  PAR: { id:'PAR', name:'Paraguay',              code:'PAR', flag:'🇵🇾', confederation:'CONMEBOL', group:'D' },
  AUS: { id:'AUS', name:'Australia',             code:'AUS', flag:'🇦🇺', confederation:'AFC',      group:'D' },
  TUR: { id:'TUR', name:'Turquía',               code:'TUR', flag:'🇹🇷', confederation:'UEFA',     group:'D' },

  // GROUP E
  GER: { id:'GER', name:'Alemania',              code:'GER', flag:'🇩🇪', confederation:'UEFA',     group:'E' },
  CUW: { id:'CUW', name:'Curazao',               code:'CUW', flag:'🇨🇼', confederation:'CONCACAF', group:'E' },
  CIV: { id:'CIV', name:'Costa de Marfil',       code:'CIV', flag:'🇨🇮', confederation:'CAF',      group:'E' },
  ECU: { id:'ECU', name:'Ecuador',               code:'ECU', flag:'🇪🇨', confederation:'CONMEBOL', group:'E' },

  // GROUP F
  NED: { id:'NED', name:'Países Bajos',          code:'NED', flag:'🇳🇱', confederation:'UEFA',     group:'F' },
  JPN: { id:'JPN', name:'Japón',                 code:'JPN', flag:'🇯🇵', confederation:'AFC',      group:'F' },
  SWE: { id:'SWE', name:'Suecia',                code:'SWE', flag:'🇸🇪', confederation:'UEFA',     group:'F' },
  TUN: { id:'TUN', name:'Túnez',                 code:'TUN', flag:'🇹🇳', confederation:'CAF',      group:'F' },

  // GROUP G
  BEL: { id:'BEL', name:'Bélgica',               code:'BEL', flag:'🇧🇪', confederation:'UEFA',     group:'G' },
  EGY: { id:'EGY', name:'Egipto',                code:'EGY', flag:'🇪🇬', confederation:'CAF',      group:'G' },
  IRN: { id:'IRN', name:'Irán',                  code:'IRN', flag:'🇮🇷', confederation:'AFC',      group:'G' },
  NZL: { id:'NZL', name:'Nueva Zelanda',         code:'NZL', flag:'🇳🇿', confederation:'OFC',      group:'G' },

  // GROUP H
  ESP: { id:'ESP', name:'España',                code:'ESP', flag:'🇪🇸', confederation:'UEFA',     group:'H' },
  CPV: { id:'CPV', name:'Cabo Verde',            code:'CPV', flag:'🇨🇻', confederation:'CAF',      group:'H' },
  KSA: { id:'KSA', name:'Arabia Saudita',        code:'KSA', flag:'🇸🇦', confederation:'AFC',      group:'H' },
  URU: { id:'URU', name:'Uruguay',               code:'URU', flag:'🇺🇾', confederation:'CONMEBOL', group:'H' },

  // GROUP I
  FRA: { id:'FRA', name:'Francia',               code:'FRA', flag:'🇫🇷', confederation:'UEFA',     group:'I' },
  SEN: { id:'SEN', name:'Senegal',               code:'SEN', flag:'🇸🇳', confederation:'CAF',      group:'I' },
  IRQ: { id:'IRQ', name:'Irak',                  code:'IRQ', flag:'🇮🇶', confederation:'AFC',      group:'I' },
  NOR: { id:'NOR', name:'Noruega',               code:'NOR', flag:'🇳🇴', confederation:'UEFA',     group:'I' },

  // GROUP J
  ARG: { id:'ARG', name:'Argentina',             code:'ARG', flag:'🇦🇷', confederation:'CONMEBOL', group:'J' },
  ALG: { id:'ALG', name:'Argelia',               code:'ALG', flag:'🇩🇿', confederation:'CAF',      group:'J' },
  AUT: { id:'AUT', name:'Austria',               code:'AUT', flag:'🇦🇹', confederation:'UEFA',     group:'J' },
  JOR: { id:'JOR', name:'Jordania',              code:'JOR', flag:'🇯🇴', confederation:'AFC',      group:'J' },

  // GROUP K
  POR: { id:'POR', name:'Portugal',              code:'POR', flag:'🇵🇹', confederation:'UEFA',     group:'K' },
  COD: { id:'COD', name:'RD Congo',              code:'COD', flag:'🇨🇩', confederation:'CAF',      group:'K' },
  UZB: { id:'UZB', name:'Uzbekistán',            code:'UZB', flag:'🇺🇿', confederation:'AFC',      group:'K' },
  COL: { id:'COL', name:'Colombia',              code:'COL', flag:'🇨🇴', confederation:'CONMEBOL', group:'K' },

  // GROUP L
  ENG: { id:'ENG', name:'Inglaterra',            code:'ENG', flag:'🏴', confederation:'UEFA',     group:'L' },
  CRO: { id:'CRO', name:'Croacia',               code:'CRO', flag:'🇭🇷', confederation:'UEFA',     group:'L' },
  GHA: { id:'GHA', name:'Ghana',                 code:'GHA', flag:'🇬🇭', confederation:'CAF',      group:'L' },
  PAN: { id:'PAN', name:'Panamá',                code:'PAN', flag:'🇵🇦', confederation:'CONCACAF', group:'L' },

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
  NRG:      { name:'NRG Stadium',               city:'Houston',          country:'EE. UU.',       capacity:72220, flag:'🇺🇸' },
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
// Times in Cancún local (UTC-5)
// ============================================================
const WC_MATCHES_GROUP = [
  
  mkm('2026-06-11','14:00','MEX','RSA','AZTECA',  'A',1), // Sudáfrica
  mkm('2026-06-11','21:00','KOR','CZE','AKRON',   'A',1), // Corea del Sur vs Rep. Checa
  mkm('2026-06-12','14:00','CAN','BIH','BMO',     'B',1), // Canadá vs Bosnia
  mkm('2026-06-12','20:00','USA','PAR','SOFI',    'D',1), // EE.UU. vs Paraguay
  mkm('2026-06-13','14:00','QAT','SUI','LEVIS',   'B',1), // Catar vs Suiza
  mkm('2026-06-13','17:00','BRA','MAR','METLIFE', 'C',1), // Brasil vs Marruecos
  mkm('2026-06-13','20:00','HAI','SCO','GILLETTE','C',1), // Haití vs Escocia
  mkm('2026-06-13','23:00','AUS','TUR','BC',      'D',1), // Australia vs Turquía
  mkm('2026-06-14','12:00','GER','CUW','NRG',     'E',1), // Alemania vs Curazao
  mkm('2026-06-14','15:00','NED','JPN','ATT',     'F',1), // Países Bajos vs Japón
  mkm('2026-06-14','18:00','CIV','ECU','LINCOLN', 'E',1), // Costa de Marfil vs Ecuador
  mkm('2026-06-14','21:00','SWE','TUN','BBVA',    'F',1), // Suecia vs Túnez
  mkm('2026-06-15','11:00','ESP','CPV','MERCEDES','H',1), // España vs Cabo Verde
  mkm('2026-06-15','14:00','BEL','EGY','LUMEN',   'G',1), // Bélgica vs Egipto
  mkm('2026-06-15','17:00','KSA','URU','HARD',    'H',1), // Arabia Saudí vs Uruguay
  mkm('2026-06-15','20:00','IRN','NZL','SOFI',    'G',1), // Irán vs Nueva Zelanda
  mkm('2026-06-16','14:00','FRA','SEN','METLIFE', 'I',1), // Francia vs Senegal
  mkm('2026-06-16','17:00','IRQ','NOR','GILLETTE','I',1), // Irak vs Noruega
  mkm('2026-06-16','20:00','ARG','ALG','ARROW',   'J',1), // Argentina vs Argelia
  mkm('2026-06-16','23:00','AUT','JOR','LEVIS',   'J',1), // Austria vs Jordania
  mkm('2026-06-17','12:00','POR','COD','NRG',     'K',1), // Portugal vs RD Congo
  mkm('2026-06-17','15:00','ENG','CRO','ATT',     'L',1), // Inglaterra vs Croacia
  mkm('2026-06-17','18:00','GHA','PAN','BMO',     'L',1), // Ghana vs Panamá
  mkm('2026-06-17','21:00','UZB','COL','AZTECA',  'K',1), // Uzbekistán vs Colombia
  mkm('2026-06-18','11:00','CZE','RSA','MERCEDES','A',2),
  mkm('2026-06-18','14:00','SUI','BIH','SOFI',    'B',2),
  mkm('2026-06-18','17:00','CAN','QAT','BC',      'B',2),
  mkm('2026-06-18','20:00','MEX','KOR','AKRON',   'A',2),
  mkm('2026-06-19','14:00','USA','AUS','LUMEN',   'D',2),
  mkm('2026-06-19','17:00','SCO','MAR','GILLETTE','C',2),
  mkm('2026-06-19','20:00','BRA','HAI','LINCOLN', 'C',2),
  mkm('2026-06-19','23:00','TUR','PAR','LEVIS',   'D',2),
  mkm('2026-06-20','12:00','NED','SWE','NRG',     'F',2),
  mkm('2026-06-20','15:00','GER','CIV','BMO',     'E',2),
  mkm('2026-06-20','21:00','ECU','CUW','ARROW',   'E',2),
  mkm('2026-06-20','23:00','TUN','JPN','BBVA',    'F',2),
  mkm('2026-06-21','11:00','ESP','KSA','MERCEDES','H',2),
  mkm('2026-06-21','14:00','BEL','IRN','SOFI',    'G',2),
  mkm('2026-06-21','17:00','URU','CPV','HARD',    'H',2),
  mkm('2026-06-21','20:00','NZL','EGY','BC',      'G',2),
  mkm('2026-06-22','12:00','ARG','AUT','ATT',     'J',2),
  mkm('2026-06-22','16:00','FRA','IRQ','LINCOLN', 'I',2),
  mkm('2026-06-22','19:00','NOR','SEN','METLIFE', 'I',2),
  mkm('2026-06-22','22:00','JOR','ALG','LEVIS',   'J',2),
  mkm('2026-06-23','12:00','POR','UZB','NRG',     'K',2),
  mkm('2026-06-23','15:00','ENG','GHA','GILLETTE','L',2),
  mkm('2026-06-23','18:00','PAN','CRO','BMO',     'L',2),
  mkm('2026-06-23','21:00','COL','COD','AKRON',   'K',2),
  mkm('2026-06-24','14:00','SUI','CAN','BC',      'B',3),
  mkm('2026-06-24','14:00','BIH','QAT','LUMEN',   'B',3),
  mkm('2026-06-24','17:00','SCO','BRA','HARD',    'C',3),
  mkm('2026-06-24','17:00','MAR','HAI','MERCEDES','C',3),
  mkm('2026-06-24','20:00','CZE','MEX','AZTECA',  'A',3),
  mkm('2026-06-24','20:00','RSA','KOR','BBVA',    'A',3),
  mkm('2026-06-25','15:00','CUW','CIV','LINCOLN', 'E',3),
  mkm('2026-06-25','15:00','ECU','GER','METLIFE', 'E',3),
  mkm('2026-06-25','18:00','JPN','SWE','ATT',     'F',3),
  mkm('2026-06-25','18:00','TUN','NED','ARROW',   'F',3),
  mkm('2026-06-25','21:00','TUR','USA','SOFI',    'D',3),
  mkm('2026-06-25','21:00','PAR','AUS','LEVIS',   'D',3),
  mkm('2026-06-26','14:00','NOR','FRA','GILLETTE','I',3),
  mkm('2026-06-26','14:00','SEN','IRQ','BMO',     'I',3),
  mkm('2026-06-26','19:00','CPV','KSA','NRG',     'H',3),
  mkm('2026-06-26','19:00','URU','ESP','AKRON',   'H',3),
  mkm('2026-06-26','22:00','EGY','IRN','LUMEN',   'G',3),
  mkm('2026-06-26','22:00','NZL','BEL','BC',      'G',3),
  mkm('2026-06-27','16:00','PAN','ENG','METLIFE', 'L',3),
  mkm('2026-06-27','16:00','CRO','GHA','LINCOLN', 'L',3),
  mkm('2026-06-27','18:30','COL','POR','HARD',    'K',3),
  mkm('2026-06-27','18:30','COD','UZB','MERCEDES','K',3),
  mkm('2026-06-27','21:00','ALG','AUT','ARROW',   'J',3),
  mkm('2026-06-27','21:00','JOR','ARG','ATT',     'J',3),
];

// Los IDs de los partidos de Fase Eliminatoria empiezan en 73 según FIFA
_matchId = 73;

// ============================================================
// KNOCKOUT STAGE — IDs start at 73 (Official FIFA Match Numbers)
// Slot labels: '1A' = 1st Group A, 'W73' = winner match 73
// Horarios oficiales por definir ('TBD')
// ============================================================
const WC_MATCHES_KNOCKOUT = [
  // ── DIECISEISAVOS DE FINAL (16 matches) — Jun 28 – Jul 3 ────────────
  { id:73, date:'2026-06-28',time:'14:00',home:'2A', away:'2B',         venue:'SOFI',    phase:'r32',slot:'R32-1', homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:76, date:'2026-06-29',time:'12:00',home:'1C', away:'2F',         venue:'NRG',     phase:'r32',slot:'R32-4', homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:74, date:'2026-06-29',time:'15:30',home:'1E', away:'3ABCDF',     venue:'GILLETTE',phase:'r32',slot:'R32-2', homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:75, date:'2026-06-29',time:'20:00',home:'1F', away:'2C',         venue:'BBVA',    phase:'r32',slot:'R32-3', homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:78, date:'2026-06-30',time:'12:00',home:'2E', away:'2I',         venue:'ATT',     phase:'r32',slot:'R32-6', homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:77, date:'2026-06-30',time:'16:00',home:'1I', away:'3CDFGH',     venue:'METLIFE', phase:'r32',slot:'R32-5', homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:79, date:'2026-06-30',time:'20:00',home:'1A', away:'3CEFHI',     venue:'AZTECA',  phase:'r32',slot:'R32-7', homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:80, date:'2026-07-01',time:'11:00',home:'1L', away:'3EHIJK',     venue:'MERCEDES',phase:'r32',slot:'R32-8', homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:82, date:'2026-07-01',time:'15:00',home:'1G', away:'3AEHIJ',     venue:'LUMEN',   phase:'r32',slot:'R32-10',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:81, date:'2026-07-01',time:'19:00',home:'1D', away:'3BEFIJ',     venue:'LEVIS',   phase:'r32',slot:'R32-9', homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:84, date:'2026-07-02',time:'14:00',home:'1H', away:'2J',         venue:'SOFI',    phase:'r32',slot:'R32-12',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:83, date:'2026-07-02',time:'18:00',home:'2K', away:'2L',         venue:'BMO',     phase:'r32',slot:'R32-11',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:85, date:'2026-07-02',time:'22:00',home:'1B', away:'3EFGIJ',     venue:'BC',      phase:'r32',slot:'R32-13',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:88, date:'2026-07-03',time:'13:00',home:'2D', away:'2G',         venue:'ATT',     phase:'r32',slot:'R32-16',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:86, date:'2026-07-03',time:'17:00',home:'1J', away:'2H',         venue:'HARD',    phase:'r32',slot:'R32-14',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:87, date:'2026-07-03',time:'20:30',home:'1K', away:'3DEIJL',     venue:'ARROW',   phase:'r32',slot:'R32-15',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  
  // ── OCTAVOS DE FINAL (8 matches) — Jul 4–7 ───────────────
  { id:90, date:'2026-07-04',time:'12:00',home:'W73',away:'W75',venue:'NRG',     phase:'r16',slot:'R16-2',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:89, date:'2026-07-04',time:'16:00',home:'W74',away:'W77',venue:'LINCOLN', phase:'r16',slot:'R16-1',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:91, date:'2026-07-05',time:'15:00',home:'W76',away:'W78',venue:'METLIFE', phase:'r16',slot:'R16-3',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:92, date:'2026-07-05',time:'19:00',home:'W79',away:'W80',venue:'AZTECA',  phase:'r16',slot:'R16-4',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:93, date:'2026-07-06',time:'14:00',home:'W83',away:'W84',venue:'ATT',     phase:'r16',slot:'R16-5',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:94, date:'2026-07-06',time:'19:00',home:'W81',away:'W82',venue:'LUMEN',   phase:'r16',slot:'R16-6',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:95, date:'2026-07-07',time:'11:00',home:'W86',away:'W88',venue:'MERCEDES',phase:'r16',slot:'R16-7',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:96, date:'2026-07-07',time:'15:00',home:'W85',away:'W87',venue:'BC',      phase:'r16',slot:'R16-8',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  
  // ── CUARTOS DE FINAL (4 matches) — Jul 9–11 ─────────────
  { id:97, date:'2026-07-09',time:'15:00',home:'W89',away:'W90',venue:'GILLETTE',phase:'qf',slot:'QF-1',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:98, date:'2026-07-10',time:'14:00',home:'W93',away:'W94',venue:'SOFI',    phase:'qf',slot:'QF-2',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:99, date:'2026-07-11',time:'16:00',home:'W91',away:'W92',venue:'HARD',    phase:'qf',slot:'QF-3',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:100,date:'2026-07-11',time:'20:00',home:'W95',away:'W96',venue:'ARROW',   phase:'qf',slot:'QF-4',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  
  // ── SEMIFINALES (2 matches) — Jul 14–15 ──────────────────
  { id:101,date:'2026-07-14',time:'14:00',home:'W97',away:'W98',venue:'ATT',     phase:'sf',slot:'SF-1',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  { id:102,date:'2026-07-15',time:'14:00',home:'W99',away:'W100',venue:'MERCEDES',phase:'sf',slot:'SF-2',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  
  // ── TERCER PUESTO — Jul 18 ────────────────────────────────
  { id:103,date:'2026-07-18',time:'16:00',home:'L101',away:'L102',venue:'HARD',   phase:'3rd',slot:'3RD',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
  
  // ── GRAN FINAL — Jul 19 ──────────────────────────────────
  { id:104,date:'2026-07-19',time:'14:00',home:'W101',away:'W102',venue:'METLIFE',phase:'final',slot:'FINAL',homeScore:null,awayScore:null,status:'scheduled',homePens:null,awayPens:null },
];

const WC_MATCHES = [...WC_MATCHES_GROUP, ...WC_MATCHES_KNOCKOUT];
