import { CELL_COUNT, TRAILS } from '../src/constants/config';
import { gameReducer } from '../src/game/gameReducer';
import { generateLayout, neighboursOf } from '../src/game/levelGenerator';
import { indexOfKind, makeState } from './helpers';

describe('search grid', () => {
  it('builds a 4x5 board with the designed number of tracks and thorns', () => {
    TRAILS.forEach(trail => {
      const layout = generateLayout(trail, 1);
      expect(layout.cells).toHaveLength(CELL_COUNT);
      expect(layout.cells.filter(c => c.kind === 'track')).toHaveLength(
        trail.tracksTotal,
      );
      expect(layout.cells.filter(c => c.kind === 'thorn')).toHaveLength(
        trail.thorns,
      );
    });
  });

  it('never puts two tracks in one cell and never a track under thorns', () => {
    const layout = generateLayout(TRAILS[5], 3);
    layout.cells.forEach(cell => {
      if (cell.kind === 'track') {
        expect(cell.species).not.toBeNull();
      } else {
        expect(cell.species).toBeNull();
      }
    });
  });

  it('counts 8 neighbours in the middle and 3 in a corner', () => {
    expect(neighboursOf(5)).toHaveLength(8);
    expect(neighboursOf(0)).toHaveLength(3);
  });

  it('sweeping an empty cell costs one daylight step and counts as a miss', () => {
    const state = makeState(0);
    const empty = indexOfKind(state, 'empty');
    const next = gameReducer(state, { type: 'SWEEP', index: empty });
    expect(next.revealed[empty]).toBe(true);
    expect(next.daylight).toBe(state.daylight - 1);
    expect(next.misses).toBe(1);
  });

  it('ignores a second sweep of the same cell', () => {
    const state = makeState(0);
    const empty = indexOfKind(state, 'empty');
    const once = gameReducer(state, { type: 'SWEEP', index: empty });
    const twice = gameReducer(once, { type: 'SWEEP', index: empty });
    expect(twice.daylight).toBe(once.daylight);
  });

  it('two attempts of the same trail differ in placement', () => {
    const a = generateLayout(TRAILS[4], 1);
    const b = generateLayout(TRAILS[4], 2);
    const keyOf = (cells: typeof a.cells) =>
      cells.map(c => c.kind).join('');
    expect(keyOf(a.cells)).not.toEqual(keyOf(b.cells));
  });
});
