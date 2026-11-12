import { MAX_CONSECUTIVE_BAD, TRAILS } from '../src/constants/config';
import { gameReducer, GameState, summarize } from '../src/game/gameReducer';
import { computeStars } from '../src/game/scoring';
import { indexOfKind, makeState, sweepAndMatch } from './helpers';

function sweepEmpties(state: GameState, count: number, startSkip = 0): GameState {
  let next = state;
  let skip = startSkip;
  for (let i = 0; i < count; i++) {
    const at = indexOfKind(next, 'empty', skip);
    skip += 1;
    next = gameReducer(next, { type: 'SWEEP', index: at });
  }
  return next;
}

describe('round outcome', () => {
  it('three consecutive bad inputs lose the trail', () => {
    const state = sweepEmpties(makeState(0), MAX_CONSECUTIVE_BAD);
    expect(state.outcome).toBe('lost');
    expect(state.phase).toBe('over');
  });

  it('a correct match clears the bad counter before the third strike', () => {
    let state = sweepEmpties(makeState(0), 2);
    expect(state.outcome).toBeNull();
    state = sweepAndMatch(state, 0);
    expect(state.consecutiveBad).toBe(0);
    state = sweepEmpties(state, 2, 2);
    expect(state.outcome).toBeNull();
  });

  it('nothing ends the round on its own: no action, no outcome', () => {
    const state = makeState(0);
    expect(state.outcome).toBeNull();
    expect(state.daylight).toBe(TRAILS[0].daylight);
  });

  it('summarize reports a win with stars and a total', () => {
    let state: GameState = makeState(0);
    for (let i = 0; i < TRAILS[0].routeLength; i++) {
      state = sweepAndMatch(state, i);
    }
    const result = summarize(state);
    expect(result.outcome).toBe('win');
    expect(result.stars).toBeGreaterThanOrEqual(1);
    expect(result.breakdown.total).toBeGreaterThan(result.breakdown.matchPoints);
  });

  it('stars follow the daylight and mistake thresholds', () => {
    expect(
      computeStars({ outcome: 'win', daylightLeft: 20, daylightTotal: 22, mistakes: 0 }),
    ).toBe(3);
    expect(
      computeStars({ outcome: 'win', daylightLeft: 7, daylightTotal: 22, mistakes: 0 }),
    ).toBe(2);
    expect(
      computeStars({ outcome: 'win', daylightLeft: 1, daylightTotal: 22, mistakes: 4 }),
    ).toBe(1);
    expect(
      computeStars({ outcome: 'lost', daylightLeft: 20, daylightTotal: 22, mistakes: 0 }),
    ).toBe(0);
  });
});
