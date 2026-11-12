import { SWEEP_COST, THORN_EXTRA_COST, TRAILS } from '../src/constants/config';
import { gameReducer } from '../src/game/gameReducer';
import { generateLayout } from '../src/game/levelGenerator';
import { indexOfKind, makeState } from './helpers';

describe('thorn thickets', () => {
  it('the designed trails carry 0 to 4 thorn cells', () => {
    TRAILS.forEach(trail => {
      expect(trail.thorns).toBeGreaterThanOrEqual(0);
      expect(trail.thorns).toBeLessThanOrEqual(4);
      const layout = generateLayout(trail, 2);
      expect(layout.cells.filter(c => c.kind === 'thorn')).toHaveLength(
        trail.thorns,
      );
    });
  });

  it('the first trail is thorn free so the game opens gently', () => {
    expect(TRAILS[0].thorns).toBe(0);
  });

  it('sweeping thorns costs three daylight steps in total', () => {
    const state = makeState(5);
    const at = indexOfKind(state, 'thorn');
    expect(at).toBeGreaterThanOrEqual(0);
    const next = gameReducer(state, { type: 'SWEEP', index: at });
    expect(next.daylight).toBe(state.daylight - SWEEP_COST - THORN_EXTRA_COST);
  });

  it('thorns count as a bad input and feed the three-strike loss', () => {
    const state = makeState(5);
    const at = indexOfKind(state, 'thorn');
    const next = gameReducer(state, { type: 'SWEEP', index: at });
    expect(next.misses).toBe(1);
    expect(next.consecutiveBad).toBe(1);
    expect(next.feedback).toBe('sweep-thorn');
  });
});
