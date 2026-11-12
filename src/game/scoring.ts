import {
  HINTS_OFF_MULTIPLIER,
  NO_MISTAKE_BONUS,
  SCORE_PER_DAYLIGHT,
  SCORE_PER_MATCH,
  STREAK_MULTIPLIERS,
} from '../constants/config';

export function streakMultiplier(streakStep: number): number {
  const clamped = Math.max(0, Math.min(STREAK_MULTIPLIERS.length - 1, streakStep));
  return STREAK_MULTIPLIERS[clamped];
}

export function matchPoints(streakStep: number, hintsOn: boolean): number {
  const base = SCORE_PER_MATCH * streakMultiplier(streakStep);
  return Math.round(hintsOn ? base : base * HINTS_OFF_MULTIPLIER);
}

export type Outcome = 'win' | 'daylight' | 'lost';

export type ScoreBreakdown = {
  matchPoints: number;
  daylightPoints: number;
  noMistakeBonus: number;
  total: number;
};

export function buildBreakdown(params: {
  outcome: Outcome;
  runScore: number;
  daylightLeft: number;
  mistakes: number;
}): ScoreBreakdown {
  const daylightPoints =
    params.outcome === 'win'
      ? Math.max(0, params.daylightLeft) * SCORE_PER_DAYLIGHT
      : 0;
  const noMistakeBonus =
    params.outcome === 'win' && params.mistakes === 0 ? NO_MISTAKE_BONUS : 0;
  return {
    matchPoints: params.runScore,
    daylightPoints,
    noMistakeBonus,
    total: params.runScore + daylightPoints + noMistakeBonus,
  };
}

/** 3 stars: win with >=50% daylight and <=1 mistake. 2: win with >=25%. 1: any win. */
export function computeStars(params: {
  outcome: Outcome;
  daylightLeft: number;
  daylightTotal: number;
  mistakes: number;
}): number {
  if (params.outcome !== 'win') {
    return 0;
  }
  const share =
    params.daylightTotal > 0 ? params.daylightLeft / params.daylightTotal : 0;
  if (share >= 0.5 && params.mistakes <= 1) {
    return 3;
  }
  if (share >= 0.25) {
    return 2;
  }
  return 1;
}

export function outcomeTitle(outcome: Outcome): string {
  if (outcome === 'win') {
    return 'TRAIL COMPLETE';
  }
  if (outcome === 'daylight') {
    return 'DAYLIGHT GONE';
  }
  return 'TRAIL LOST';
}

export function outcomeSubtitle(outcome: Outcome): string {
  if (outcome === 'win') {
    return 'YOU REACHED THE NEXT CLEARING';
  }
  if (outcome === 'daylight') {
    return 'THE LIGHT FELL BEFORE THE TRAIL DID';
  }
  return 'THE TRACKS WENT COLD';
}
