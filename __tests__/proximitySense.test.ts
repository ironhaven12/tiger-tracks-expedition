import { computeProximity, neighboursOf } from '../src/game/levelGenerator';
import { Cell } from '../src/game/levelGenerator';
import { CELL_COUNT } from '../src/constants/config';
import { gameReducer } from '../src/game/gameReducer';
import { indexOfKind, makeState } from './helpers';

function board(trackAt: number[]): Cell[] {
  const cells: Cell[] = [];
  for (let i = 0; i < CELL_COUNT; i++) {
    cells.push({
      kind: trackAt.indexOf(i) === -1 ? 'empty' : 'track',
      species: trackAt.indexOf(i) === -1 ? null : 'TIGER',
      proximity: 0,
    });
  }
  return computeProximity(cells);
}

describe('proximity sense', () => {
  it('counts the tracks among the 8 neighbours', () => {
    const cells = board([0, 1, 4]);
    expect(cells[5].proximity).toBe(3);
    expect(cells[19].proximity).toBe(0);
  });

  it('a cell never counts itself', () => {
    const cells = board([5]);
    expect(cells[5].proximity).toBe(0);
    neighboursOf(5).forEach(n => expect(cells[n].proximity).toBe(1));
  });

  it('a swept empty cell exposes its proximity number', () => {
    const state = makeState(3);
    const at = indexOfKind(state, 'empty');
    const next = gameReducer(state, { type: 'SWEEP', index: at });
    expect(next.revealed[at]).toBe(true);
    expect(next.cells[at].proximity).toBeGreaterThanOrEqual(0);
    expect(next.cells[at].proximity).toBeLessThanOrEqual(8);
  });

  it('with hints off the run is still playable and scores more', () => {
    const off = makeState(0, { hints: false });
    expect(off.hintsOn).toBe(false);
    const at = indexOfKind(off, 'track');
    const swept = gameReducer(off, { type: 'SWEEP', index: at });
    const answered = gameReducer(swept, {
      type: 'ANSWER',
      species: swept.pending!.species,
    });
    expect(answered.runScore).toBe(150);
  });
});
