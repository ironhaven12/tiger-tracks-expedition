/**
 * TROPICAL preset — claymorphism surfaces over a deep jungle palette.
 * Copied from design-system/presets.ts; `name` stays TROPICAL.
 */
export const THEME = {
  name: 'TROPICAL',

  colors: {
    bg: {
      deep: '#0D2818',
      deeper: '#0A1F14',
      deepest: '#050F0A',
      sheet: '#132D1E',
      raised: '#1A3A28',
      sunken: '#0F3024',
      cell: '#14301F',
      cellLight: '#1E4531',
      thorn: '#2A1A14',
    },
    green: '#00E676',
    greenDark: '#00B85C',
    orange: '#FF6D00',
    orangeLight: '#FF8A2B',
    gold: '#FFC247',
    error: '#FF3B30',
    text: {
      primary: '#F2FFF7',
      secondary: '#9FBFAE',
      muted: '#7FA68F',
      disabled: '#5E7A6B',
      onAccent: '#0D2818',
    },
    ui: {
      border: 'rgba(255,255,255,0.10)',
      borderSoft: 'rgba(255,255,255,0.07)',
      glass: 'rgba(255,255,255,0.06)',
      innerLight: 'rgba(255,255,255,0.10)',
      scrim: 'rgba(5,15,10,0.86)',
      boardScrim: 'rgba(0,0,0,0.55)',
    },
  },

  gradients: {
    loader: ['#050F0A', '#0A1F14', '#0D2818'],
    menuScrim: ['rgba(13,40,24,0)', 'rgba(13,40,24,0.55)', '#0D2818'],
    panel: ['#0D2818', '#0F3024', '#0A1F14'],
    cta: ['#FF8A2B', '#FF6D00'],
    scan: ['#00E676', '#00B85C'],
    progress: ['#00E676', '#FFC247', '#FF6D00'],
    cellClosed: ['#1E4531', '#14301F'],
    win: ['#0F3024', '#13402A', '#0D2818'],
    lose: ['#1A1410', '#15241A', '#0D2818'],
  },

  typography: {
    hero: { fontSize: 40, fontWeight: '900' as const, letterSpacing: 3 },
    title: { fontSize: 32, fontWeight: '900' as const, letterSpacing: 2 },
    section: { fontSize: 18, fontWeight: '800' as const, letterSpacing: 1.6 },
    body: { fontSize: 15, fontWeight: '600' as const, letterSpacing: 0.2 },
    label: { fontSize: 13, fontWeight: '800' as const, letterSpacing: 1 },
    caption: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.6 },
    score: {
      fontSize: 28,
      fontWeight: '900' as const,
      letterSpacing: 0.5,
      fontVariant: ['tabular-nums' as const],
    },
  },

  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },

  radius: { chip: 18, cell: 18, panel: 26, sheet: 32, cta: 24, pill: 100 },

  shadows: {
    clay: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 22,
      elevation: 10,
    },
    clayDeep: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.55,
      shadowRadius: 28,
      elevation: 12,
    },
    cta: {
      shadowColor: '#FF6D00',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.45,
      shadowRadius: 22,
      elevation: 12,
    },
  },

  animation: {
    soft: { tension: 38, friction: 7 },
    snappy: { tension: 60, friction: 9 },
    press: { tension: 300, friction: 12 },
    fade: 250,
  },
} as const;

export type Theme = typeof THEME;
export default THEME;
