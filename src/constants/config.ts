/**
 * Balance + run configuration. Pure data, no react-native imports,
 * so the Jest logic tests can read it without a native runtime.
 */

/** The loader holds for exactly 8 s, driven by a timer (rule 2.1). */
export const LOADER_DURATION_MS = 8000;

export const GRID_COLS = 4;
export const GRID_ROWS = 5;
export const CELL_COUNT = GRID_COLS * GRID_ROWS;

export const SCORE_PER_MATCH = 120;
export const SCORE_PER_DAYLIGHT = 15;
export const NO_MISTAKE_BONUS = 200;
export const HINTS_OFF_MULTIPLIER = 1.25;

export const THORN_EXTRA_COST = 2;
export const SWEEP_COST = 1;
export const WRONG_ANSWER_COST = 3;
export const SCAN_COST = 6;
export const SCANS_PER_TRAIL = 2;

/** Three consecutive bad inputs (miss, thorn or wrong chip) lose the trail. */
export const MAX_CONSECUTIVE_BAD = 3;

/** Streak ladder: every correct match in a row moves one step up. */
export const STREAK_MULTIPLIERS = [1, 1.25, 1.5, 2];
/** Every third correct match in a row refunds daylight. */
export const STREAK_REFUND_EVERY = 3;
export const STREAK_REFUND_AMOUNT = 2;

/** Three correct matches of one species unlock its dossier. */
export const MASTERY_THRESHOLD = 3;

export type SpeciesId = 'TIGER' | 'CHITAL' | 'LANGUR' | 'PEACOCK' | 'BOAR';

export type TrailConfig = {
  index: number;
  id: string;
  name: string;
  tracksTotal: number;
  routeLength: number;
  daylight: number;
  speciesPool: SpeciesId[];
  thorns: number;
};

export const TRAILS: TrailConfig[] = [
  {
    index: 0,
    id: '01',
    name: 'FERN HOLLOW',
    tracksTotal: 4,
    routeLength: 4,
    daylight: 22,
    speciesPool: ['TIGER', 'CHITAL', 'LANGUR'],
    thorns: 0,
  },
  {
    index: 1,
    id: '02',
    name: 'RIVER BEND',
    tracksTotal: 5,
    routeLength: 5,
    daylight: 24,
    speciesPool: ['TIGER', 'CHITAL', 'PEACOCK'],
    thorns: 1,
  },
  {
    index: 2,
    id: '03',
    name: 'BAMBOO MAZE',
    tracksTotal: 6,
    routeLength: 6,
    daylight: 26,
    speciesPool: ['TIGER', 'CHITAL', 'LANGUR', 'PEACOCK'],
    thorns: 2,
  },
  {
    index: 3,
    id: '04',
    name: 'THORN RIDGE',
    tracksTotal: 6,
    routeLength: 6,
    daylight: 24,
    speciesPool: ['TIGER', 'LANGUR', 'PEACOCK', 'BOAR'],
    thorns: 3,
  },
  {
    index: 4,
    id: '05',
    name: 'MIST CLEARING',
    tracksTotal: 7,
    routeLength: 7,
    daylight: 26,
    speciesPool: ['TIGER', 'CHITAL', 'LANGUR', 'PEACOCK', 'BOAR'],
    thorns: 3,
  },
  {
    index: 5,
    id: '06',
    name: 'TIGER DEN',
    tracksTotal: 8,
    routeLength: 8,
    daylight: 28,
    speciesPool: ['TIGER', 'CHITAL', 'LANGUR', 'PEACOCK', 'BOAR'],
    thorns: 4,
  },
];

export const TOTAL_STARS = TRAILS.length * 3;

/** Settings — each option has a real, persisted effect. */
export type PaceId = 'RELAXED' | 'STANDARD' | 'EXPERT';
export type BoardSizeId = 'COMFORT' | 'COMPACT';

export const PACE_MULTIPLIER: Record<PaceId, number> = {
  RELAXED: 1.35,
  STANDARD: 1.0,
  EXPERT: 0.8,
};

export const BOARD_TILE: Record<BoardSizeId, number> = {
  COMFORT: 82,
  COMPACT: 74,
};

export type Settings = {
  hints: boolean;
  pace: PaceId;
  boardSize: BoardSizeId;
  reducedMotion: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  hints: true,
  pace: 'STANDARD',
  boardSize: 'COMFORT',
  reducedMotion: false,
};

export function daylightFor(trail: TrailConfig, pace: PaceId): number {
  return Math.max(6, Math.round(trail.daylight * PACE_MULTIPLIER[pace]));
}

/** Score grouping: 1 475 — a plain ASCII space, never a glyph that can tofu. */
export function formatNumber(value: number): string {
  const safe = Math.max(0, Math.round(value));
  return String(safe).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/** The screen ids of the App.tsx state machine (no navigation library). */
export const SCREEN_IDS = [
  'loader',
  'menu',
  'levels',
  'game',
  'result',
  'gameover',
  'collection',
  'progress',
  'settings',
] as const;

export type ScreenId = typeof SCREEN_IDS[number];

/** One-tap routes out of Menu; the labels are the words the UI harness taps. */
export const MENU_ROUTES: { label: string; screen: ScreenId }[] = [
  { label: 'LEVELS', screen: 'levels' },
  { label: 'COLLECTION', screen: 'collection' },
  { label: 'PROGRESS', screen: 'progress' },
  { label: 'SETTINGS', screen: 'settings' },
];
