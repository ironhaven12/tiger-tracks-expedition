import {
  CELL_COUNT,
  MAX_CONSECUTIVE_BAD,
  SCANS_PER_TRAIL,
  SCAN_COST,
  Settings,
  SpeciesId,
  STREAK_MULTIPLIERS,
  STREAK_REFUND_AMOUNT,
  STREAK_REFUND_EVERY,
  SWEEP_COST,
  THORN_EXTRA_COST,
  TrailConfig,
  WRONG_ANSWER_COST,
  daylightFor,
} from '../constants/config';
import { Cell, generateLayout } from './levelGenerator';
import { makeSeed, mulberry32 } from './rng';
import { buildOptions } from './species';
import { buildBreakdown, computeStars, matchPoints, Outcome } from './scoring';

export type Phase = 'idle' | 'matching' | 'over';

export type PendingMatch = {
  cellIndex: number;
  species: SpeciesId;
  options: SpeciesId[];
};

export type FeedbackKind =
  | 'none'
  | 'sweep-empty'
  | 'sweep-track'
  | 'sweep-thorn'
  | 'correct'
  | 'wrong'
  | 'scan';

export type GameState = {
  trailIndex: number;
  cells: Cell[];
  revealed: boolean[];
  scanned: boolean[];
  seed: number;
  daylight: number;
  daylightTotal: number;
  routeIndex: number;
  routeLength: number;
  found: number;
  tracksTotal: number;
  misses: number;
  mistakes: number;
  answers: number;
  correctAnswers: number;
  consecutiveBad: number;
  streakStep: number;
  bestStreakStep: number;
  correctInARow: number;
  runScore: number;
  scansLeft: number;
  phase: Phase;
  pending: PendingMatch | null;
  outcome: Outcome | null;
  matched: Partial<Record<SpeciesId, number>>;
  feedback: FeedbackKind;
  feedbackAt: number;
  lastGain: number;
  hintsOn: boolean;
};

export type GameAction =
  | { type: 'SWEEP'; index: number }
  | { type: 'ANSWER'; species: SpeciesId }
  | { type: 'SCAN' }
  | { type: 'RESTART'; trail: TrailConfig; settings: Settings; attempt: number };

export function createGame(
  trail: TrailConfig,
  settings: Settings,
  attempt: number,
): GameState {
  const layout = generateLayout(trail, attempt);
  const budget = daylightFor(trail, settings.pace);
  return {
    trailIndex: trail.index,
    cells: layout.cells,
    revealed: new Array(CELL_COUNT).fill(false),
    scanned: new Array(CELL_COUNT).fill(false),
    seed: layout.seed,
    daylight: budget,
    daylightTotal: budget,
    routeIndex: 0,
    routeLength: trail.routeLength,
    found: 0,
    tracksTotal: trail.tracksTotal,
    misses: 0,
    mistakes: 0,
    answers: 0,
    correctAnswers: 0,
    consecutiveBad: 0,
    streakStep: 0,
    bestStreakStep: 0,
    correctInARow: 0,
    runScore: 0,
    scansLeft: SCANS_PER_TRAIL,
    phase: 'idle',
    pending: null,
    outcome: null,
    matched: {},
    feedback: 'none',
    feedbackAt: 0,
    lastGain: 0,
    hintsOn: settings.hints,
  };
}

function poolOf(state: GameState): SpeciesId[] {
  const pool: SpeciesId[] = [];
  state.cells.forEach(cell => {
    if (cell.kind === 'track' && cell.species && pool.indexOf(cell.species) === -1) {
      pool.push(cell.species);
    }
  });
  return pool;
}

function settle(state: GameState): GameState {
  if (state.outcome !== null) {
    return state;
  }
  if (state.routeIndex >= state.routeLength) {
    return { ...state, phase: 'over', outcome: 'win', pending: null };
  }
  if (state.daylight <= 0) {
    return {
      ...state,
      daylight: 0,
      phase: 'over',
      outcome: 'daylight',
      pending: null,
    };
  }
  if (state.consecutiveBad >= MAX_CONSECUTIVE_BAD) {
    return { ...state, phase: 'over', outcome: 'lost', pending: null };
  }
  return state;
}

function badInput(state: GameState): GameState {
  return {
    ...state,
    consecutiveBad: state.consecutiveBad + 1,
    streakStep: 0,
    correctInARow: 0,
  };
}

/** The scan reads the most informative unopened cell — the busiest neighbourhood. */
export function pickScanTarget(state: GameState): number {
  let best = -1;
  let bestScore = -1;
  for (let i = 0; i < CELL_COUNT; i++) {
    if (state.revealed[i] || state.scanned[i]) {
      continue;
    }
    if (state.cells[i].kind === 'track') {
      continue;
    }
    const score = state.cells[i].proximity;
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return best;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'RESTART':
      return createGame(action.trail, action.settings, action.attempt);

    case 'SWEEP': {
      const i = action.index;
      if (state.phase !== 'idle') {
        return state;
      }
      if (i < 0 || i >= CELL_COUNT || state.revealed[i]) {
        return state;
      }
      const cell = state.cells[i];
      const cost =
        cell.kind === 'thorn' ? SWEEP_COST + THORN_EXTRA_COST : SWEEP_COST;
      const revealed = state.revealed.slice();
      revealed[i] = true;

      const swept: GameState = {
        ...state,
        revealed,
        daylight: state.daylight - cost,
        feedbackAt: state.feedbackAt + 1,
      };

      if (cell.kind === 'track' && cell.species) {
        const rand = mulberry32(makeSeed(state.trailIndex, state.feedbackAt + i + 1));
        return settle({
          ...swept,
          found: state.found + 1,
          feedback: 'sweep-track',
          phase: 'matching',
          pending: {
            cellIndex: i,
            species: cell.species,
            options: buildOptions(rand, cell.species, poolOf(state)),
          },
        });
      }

      return settle(
        badInput({
          ...swept,
          misses: state.misses + 1,
          feedback: cell.kind === 'thorn' ? 'sweep-thorn' : 'sweep-empty',
        }),
      );
    }

    case 'ANSWER': {
      if (state.phase !== 'matching' || !state.pending) {
        return state;
      }
      const pending = state.pending;
      const revealed = state.revealed.slice();

      if (action.species !== pending.species) {
        // The same track closes again and is offered after one more sweep.
        revealed[pending.cellIndex] = false;
        return settle(
          badInput({
            ...state,
            revealed,
            found: Math.max(0, state.found - 1),
            daylight: state.daylight - WRONG_ANSWER_COST,
            mistakes: state.mistakes + 1,
            answers: state.answers + 1,
            phase: 'idle',
            pending: null,
            feedback: 'wrong',
            feedbackAt: state.feedbackAt + 1,
            lastGain: 0,
          }),
        );
      }

      const gain = matchPoints(state.streakStep, state.hintsOn);
      const streakStep = Math.min(
        STREAK_MULTIPLIERS.length - 1,
        state.streakStep + 1,
      );
      const correctInARow = state.correctInARow + 1;
      const refund =
        correctInARow % STREAK_REFUND_EVERY === 0 ? STREAK_REFUND_AMOUNT : 0;
      const matched = { ...state.matched };
      matched[pending.species] = (matched[pending.species] || 0) + 1;

      return settle({
        ...state,
        revealed,
        routeIndex: state.routeIndex + 1,
        runScore: state.runScore + gain,
        streakStep,
        bestStreakStep: Math.max(state.bestStreakStep, streakStep),
        correctInARow,
        consecutiveBad: 0,
        answers: state.answers + 1,
        correctAnswers: state.correctAnswers + 1,
        daylight: state.daylight + refund,
        matched,
        phase: 'idle',
        pending: null,
        feedback: 'correct',
        feedbackAt: state.feedbackAt + 1,
        lastGain: gain,
      });
    }

    case 'SCAN': {
      if (state.phase !== 'idle' || state.scansLeft <= 0) {
        return state;
      }
      if (state.daylight <= SCAN_COST) {
        return state;
      }
      const target = pickScanTarget(state);
      if (target < 0) {
        return state;
      }
      const scanned = state.scanned.slice();
      scanned[target] = true;
      return settle({
        ...state,
        scanned,
        scansLeft: state.scansLeft - 1,
        daylight: state.daylight - SCAN_COST,
        feedback: 'scan',
        feedbackAt: state.feedbackAt + 1,
      });
    }

    default:
      return state;
  }
}

export function summarize(state: GameState) {
  const outcome: Outcome = state.outcome || 'lost';
  const breakdown = buildBreakdown({
    outcome,
    runScore: state.runScore,
    daylightLeft: state.daylight,
    mistakes: state.mistakes,
  });
  const stars = computeStars({
    outcome,
    daylightLeft: state.daylight,
    daylightTotal: state.daylightTotal,
    mistakes: state.mistakes,
  });
  return { outcome, breakdown, stars };
}
