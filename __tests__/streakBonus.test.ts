import {
  STREAK_MULTIPLIERS,
  STREAK_REFUND_AMOUNT,
  STREAK_REFUND_EVERY,
} from '../src/constants/config';
import { GameState } from '../src/game/gameReducer';
import { streakMultiplier } from '../src/game/scoring';
import { indexOfKind, makeState, sweepAndMatch } from './helpers';
import { gameReducer } from '../src/game/gameReducer';

describe('tracking streak', () => {
  it('climbs x1 -> x1.25 -> x1.5 -> x2 and stops there', () => {
    expect(STREAK_MULTIPLIERS).toEqual([1, 1.25, 1.5, 2]);
    expect(streakMultiplier(0)).toBe(1);
    expect(streakMultiplier(3)).toBe(2);
    expect(streakMultiplier(9)).toBe(2);
  });

  it('raises the score of each following match', () => {
    let state: GameState = makeState(4);
    state = sweepAndMatch(state, 0);
    const first = state.runScore;
    state = sweepAndMatch(state, 1);
    const second = state.runScore - first;
    expect(first).toBe(120);
    expect(second).toBe(150);
  });

  it('refunds daylight on every third correct match in a row', () => {
    let state: GameState = makeState(4);
    state = sweepAndMatch(state, 0);
    state = sweepAndMatch(state, 1);
    const before = state.daylight;
    state = sweepAndMatch(state, 2);
    expect(state.correctInARow).toBe(STREAK_REFUND_EVERY);
    expect(state.daylight).toBe(before - 1 + STREAK_REFUND_AMOUNT);
  });

  it('one bad input resets the streak to x1', () => {
    let state: GameState = makeState(4);
    state = sweepAndMatch(state, 0);
    expect(state.streakStep).toBe(1);
    const empty = indexOfKind(state, 'empty');
    state = gameReducer(state, { type: 'SWEEP', index: empty });
    expect(state.streakStep).toBe(0);
    expect(state.correctInARow).toBe(0);
  });
});
