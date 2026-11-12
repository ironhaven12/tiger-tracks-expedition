import {
  DEFAULT_SETTINGS,
  Settings,
  SpeciesId,
  TRAILS,
} from '../constants/config';
import { Outcome } from './scoring';

const KEY = 'tigertracks.profile.v1';

export type Profile = {
  unlockedTrails: number;
  stars: number[];
  trailBest: number[];
  bestScore: number;
  matched: Partial<Record<SpeciesId, number>>;
  expeditions: number;
  wins: number;
  tracksFound: number;
  answers: number;
  correctAnswers: number;
  bestStreakStep: number;
  finishedInTime: number;
  settings: Settings;
};

export function defaultProfile(): Profile {
  return {
    unlockedTrails: 1,
    stars: TRAILS.map(() => 0),
    trailBest: TRAILS.map(() => 0),
    bestScore: 0,
    matched: {},
    expeditions: 0,
    wins: 0,
    tracksFound: 0,
    answers: 0,
    correctAnswers: 0,
    bestStreakStep: 0,
    finishedInTime: 0,
    settings: { ...DEFAULT_SETTINGS },
  };
}

type Adapter = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

function memoryAdapter(): Adapter {
  const store: Record<string, string> = {};
  return {
    getItem: key => Promise.resolve(Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null),
    setItem: (key, value) => {
      store[key] = value;
      return Promise.resolve();
    },
    removeItem: key => {
      delete store[key];
      return Promise.resolve();
    },
  };
}

/**
 * AsyncStorage is used when the native module happens to be linked; otherwise
 * the in-memory adapter keeps the app (and the pure Jest tests) running.
 */
function resolveAdapter(): Adapter {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('@react-native-async-storage/async-storage');
    const native = mod && (mod.default || mod);
    if (native && typeof native.getItem === 'function') {
      return native as Adapter;
    }
  } catch (err) {
    // no native storage in this build — fall through
  }
  return memoryAdapter();
}

let adapter: Adapter = resolveAdapter();

export function __setAdapterForTests(next: Adapter) {
  adapter = next;
}

function merge(raw: unknown): Profile {
  const base = defaultProfile();
  if (!raw || typeof raw !== 'object') {
    return base;
  }
  const input = raw as Partial<Profile>;
  return {
    ...base,
    ...input,
    stars: Array.isArray(input.stars) ? padTo(input.stars, TRAILS.length) : base.stars,
    trailBest: Array.isArray(input.trailBest)
      ? padTo(input.trailBest, TRAILS.length)
      : base.trailBest,
    matched: input.matched && typeof input.matched === 'object' ? input.matched : {},
    settings: { ...base.settings, ...(input.settings || {}) },
  };
}

function padTo(list: number[], length: number): number[] {
  const out = list.slice(0, length);
  while (out.length < length) {
    out.push(0);
  }
  return out.map(v => (typeof v === 'number' && isFinite(v) ? v : 0));
}

export async function loadProfile(): Promise<Profile> {
  try {
    const raw = await adapter.getItem(KEY);
    if (!raw) {
      return defaultProfile();
    }
    return merge(JSON.parse(raw));
  } catch (err) {
    return defaultProfile();
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  try {
    await adapter.setItem(KEY, JSON.stringify(profile));
  } catch (err) {
    // persistence is best effort; the run must never crash on it
  }
}

export async function clearProfile(): Promise<Profile> {
  try {
    await adapter.removeItem(KEY);
  } catch (err) {
    // ignore
  }
  return defaultProfile();
}

export type RunResult = {
  trailIndex: number;
  outcome: Outcome;
  stars: number;
  total: number;
  matched: Partial<Record<SpeciesId, number>>;
  tracksFound: number;
  answers: number;
  correctAnswers: number;
  bestStreakStep: number;
  daylightLeft: number;
};

/** Pure merge of a finished run into the stored profile. */
export function applyRun(profile: Profile, run: RunResult): Profile {
  const stars = profile.stars.slice();
  stars[run.trailIndex] = Math.max(stars[run.trailIndex] || 0, run.stars);

  const trailBest = profile.trailBest.slice();
  trailBest[run.trailIndex] = Math.max(trailBest[run.trailIndex] || 0, run.total);

  const matched: Partial<Record<SpeciesId, number>> = { ...profile.matched };
  (Object.keys(run.matched) as SpeciesId[]).forEach(id => {
    matched[id] = (matched[id] || 0) + (run.matched[id] || 0);
  });

  const won = run.outcome === 'win';
  const unlockedTrails = won
    ? Math.min(TRAILS.length, Math.max(profile.unlockedTrails, run.trailIndex + 2))
    : profile.unlockedTrails;

  return {
    ...profile,
    stars,
    trailBest,
    matched,
    unlockedTrails,
    bestScore: Math.max(profile.bestScore, run.total),
    expeditions: profile.expeditions + 1,
    wins: profile.wins + (won ? 1 : 0),
    tracksFound: profile.tracksFound + run.tracksFound,
    answers: profile.answers + run.answers,
    correctAnswers: profile.correctAnswers + run.correctAnswers,
    bestStreakStep: Math.max(profile.bestStreakStep, run.bestStreakStep),
    finishedInTime:
      profile.finishedInTime + (won && run.daylightLeft > 0 ? 1 : 0),
  };
}

export function unlockedSpecies(profile: Profile, threshold: number): SpeciesId[] {
  return (Object.keys(profile.matched) as SpeciesId[]).filter(
    id => (profile.matched[id] || 0) >= threshold,
  );
}
