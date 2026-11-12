import { TRAILS } from '../src/constants/config';
import { GameState } from '../src/game/gameReducer';
import { makeState, sweepAndMatch } from './helpers';

describe('route map', () => {
  it('lights one clearing per correct match', () => {
    let state: GameState = makeState(2);
    expect(state.routeIndex).toBe(0);
    state = sweepAndMatch(state, 0);
    expect(state.routeIndex).toBe(1);
    state = sweepAndMatch(state, 1);
    expect(state.routeIndex).toBe(2);
  });

  it('reaching the last clearing wins at once without sweeping the rest', () => {
    let state: GameState = makeState(0);
    const route = TRAILS[0].routeLength;
    for (let i = 0; i < route; i++) {
      state = sweepAndMatch(state, i);
    }
    expect(state.routeIndex).toBe(route);
    expect(state.outcome).toBe('win');
    expect(state.phase).toBe('over');
    expect(state.revealed.filter(Boolean).length).toBeLessThan(20);
  });
});
