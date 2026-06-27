# ⚽ World Cup 2026 — App de Resultados y Pronósticos

Aplicación web progresiva (PWA) para seguir el Mundial de Fútbol 2026 que se celebrará en México, Estados Unidos y Canadá del 11 de junio al 19 de julio de 2026.

## 🌟 Características

- **Resultados en tiempo real (manual)** — Actualiza marcadores con una interfaz visual intuitiva
- **Tabla de 12 grupos** — Posiciones actualizadas automáticamente (PJ, G, E, P, GF, GC, DG, Pts)
- **Eliminatorias completas** — Ronda de 32 → Octavos → Cuartos → Semis → Final
- **Mi Pronóstico** — Predice el ganador de cada partido y ve tu % de aciertos
- **Estadísticas** — Goles, resultados, equipos más goleadores
- **Exportar PDF** — Descarga tus pronósticos como PDF
- **Cuenta regresiva** — Al próximo partido en hora de México
- **PWA instalable** — Funciona sin internet, instálala como app nativa
- **48 selecciones** con banderas oficiales
- **16 estadios** de México, USA y Canadá

## 📁 Estructura
```
world-cup-2026/
├── index.html          ← App principal (SPA)
├── manifest.json       ← PWA manifest
├── sw.js               ← Service Worker (offline)
├── css/
│   └── style.css       ← Diseño FIFA+ completo
├── js/
│   ├── data.js              ← 48 selecciones, 104 partidos, 16 estadios
│   ├── thirdPlaceMatrix.js  ← Matriz oficial FIFA (495 combinaciones) de mejores terceros
│   ├── storage.js           ← Capa de localStorage
│   ├── tournament.js        ← Lógica de posiciones y bracket
│   └── app.js               ← Vistas y navegación
└── icons/
    ├── icon.svg
    ├── icon-192.png
    └── icon-512.png
```

## 🛠 Uso

### Ingresar resultados
1. Ve a **Partidos** → toca ✏️ en cualquier partido  
   — ó —  
   Toca ➕ en la barra superior para buscarlo
2. Escribe el marcador y toca **Guardar**
3. Las tablas de grupo y las llaves se actualizan solos

### Hacer pronósticos
1. Ve a **Pronóst.** en el menú inferior
2. Para cada partido, toca el equipo que crees que ganará (o Empate)
3. Al terminar el partido, verás si acertaste ✅ o fallaste ❌
4. Tu % de aciertos aparece en la pantalla de inicio

### Instalar como PWA
- **Android**: Toca "Agregar a pantalla de inicio" en Chrome
- **iOS**: Safari → Compartir → "Agregar a inicio"
- **Escritorio**: Ícono de instalación en la barra de Chrome

## ⚙️ Tecnología
- HTML5 / CSS3 / JavaScript puro (sin frameworks)
- localStorage para persistencia
- Service Worker para funcionamiento offline
- jsPDF para exportación de pronósticos

## 📋 Datos del torneo
- **48 selecciones** en 12 grupos (A–L)
- **104 partidos**: 72 de grupo + 16 (R32) + 8 (R16) + 4 (QF) + 2 (SF) + Tercer lugar + Final
- Grupos y calendario basados en el sorteo oficial de diciembre 2024
