import { WRONG_ANSWER_COST } from '../src/constants/config';
import { gameReducer } from '../src/game/gameReducer';
import { SPECIES } from '../src/game/species';
import { indexOfKind, makeState } from './helpers';

describe('track matching', () => {
  it('offers the true species plus two decoys', () => {
    const state = makeState(2);
    const at = indexOfKind(state, 'track');
    const swept = gameReducer(state, { type: 'SWEEP', index: at });
    expect(swept.phase).toBe('matching');
    expect(swept.pending).not.toBeNull();
    expect(swept.pending!.options).toHaveLength(3);
    expect(swept.pending!.options).toContain(swept.pending!.species);
    expect(new Set(swept.pending!.options).size).toBe(3);
  });

  it('a correct chip scores, advances the route and clears the bad counter', () => {
    const state = makeState(0);
    const at = indexOfKind(state, 'track');
    const swept = gameReducer(state, { type: 'SWEEP', index: at });
    const answered = gameReducer(swept, {
      type: 'ANSWER',
      species: swept.pending!.species,
    });
    expect(answered.runScore).toBe(120);
    expect(answered.routeIndex).toBe(1);
    expect(answered.consecutiveBad).toBe(0);
    expect(answered.phase).toBe('idle');
  });

  it('a wrong chip costs daylight, resets the streak and re-closes the cell', () => {
    const state = makeState(0);
    const at = indexOfKind(state, 'track');
    const swept = gameReducer(state, { type: 'SWEEP', index: at });
    const wrong = SPECIES.map(s => s.id).find(
      id => id !== swept.pending!.species,
    )!;
    const answered = gameReducer(swept, { type: 'ANSWER', species: wrong });
    expect(answered.daylight).toBe(swept.daylight - WRONG_ANSWER_COST);
    expect(answered.streakStep).toBe(0);
    expect(answered.mistakes).toBe(1);
    expect(answered.revealed[at]).toBe(false);
  });

  it('answers are ignored while the board is idle', () => {
    const state = makeState(0);
    const same = gameReducer(state, { type: 'ANSWER', species: 'TIGER' });
    expect(same).toBe(state);
  });
});
