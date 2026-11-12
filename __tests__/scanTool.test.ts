import { SCANS_PER_TRAIL, SCAN_COST } from '../src/constants/config';
import { gameReducer, pickScanTarget } from '../src/game/gameReducer';
import { makeState } from './helpers';

describe('scan tool', () => {
  it('starts with two scans per trail', () => {
    expect(makeState(0).scansLeft).toBe(SCANS_PER_TRAIL);
  });

  it('reveals the number of one unopened cell without sweeping it', () => {
    const state = makeState(2);
    const target = pickScanTarget(state);
    const next = gameReducer(state, { type: 'SCAN' });
    expect(next.scanned[target]).toBe(true);
    expect(next.revealed[target]).toBe(false);
    expect(next.scansLeft).toBe(SCANS_PER_TRAIL - 1);
    expect(next.daylight).toBe(state.daylight - SCAN_COST);
  });

  it('never spends a scan twice on the same cell', () => {
    const first = gameReducer(makeState(2), { type: 'SCAN' });
    const second = gameReducer(first, { type: 'SCAN' });
    expect(second.scanned.filter(Boolean)).toHaveLength(2);
    expect(second.scansLeft).toBe(0);
  });

  it('is a no-op once the scans are gone', () => {
    let state = gameReducer(makeState(2), { type: 'SCAN' });
    state = gameReducer(state, { type: 'SCAN' });
    const again = gameReducer(state, { type: 'SCAN' });
    expect(again).toBe(state);
  });

  it('never costs the last daylight steps', () => {
    const state = { ...makeState(0), daylight: SCAN_COST };
    expect(gameReducer(state, { type: 'SCAN' })).toBe(state);
  });
});
