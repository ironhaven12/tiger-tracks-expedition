import { DEFAULT_SETTINGS, Settings, TRAILS } from '../src/constants/config';
import { createGame, gameReducer, GameState } from '../src/game/gameReducer';

export function makeState(
  trailIndex = 0,
  patch: Partial<Settings> = {},
  attempt = 1,
): GameState {
  return createGame(TRAILS[trailIndex], { ...DEFAULT_SETTINGS, ...patch }, attempt);
}

export function indexOfKind(state: GameState, kind: string, skip = 0): number {
  let seen = 0;
  for (let i = 0; i < state.cells.length; i++) {
    if (state.cells[i].kind === kind) {
      if (seen === skip) {
        return i;
      }
      seen += 1;
    }
  }
  return -1;
}

export function sweepAndMatch(state: GameState, trackSkip = 0): GameState {
  const at = indexOfKind(state, 'track', trackSkip);
  const swept = gameReducer(state, { type: 'SWEEP', index: at });
  if (!swept.pending) {
    return swept;
  }
  return gameReducer(swept, { type: 'ANSWER', species: swept.pending.species });
}
