import { useCallback, useEffect, useReducer, useRef } from 'react';
import { Settings, SpeciesId, TrailConfig } from '../constants/config';
import {
  createGame,
  gameReducer,
  GameState,
  summarize,
} from '../game/gameReducer';

/**
 * The reducer owns the ground truth; a ref mirrors it so animation callbacks
 * read live values instead of a captured closure.
 */
export function useGameEngine(
  trail: TrailConfig,
  settings: Settings,
  attempt: number,
) {
  const [state, dispatch] = useReducer(
    gameReducer,
    { trail, settings, attempt },
    init => createGame(init.trail, init.settings, init.attempt),
  );

  const stateRef = useRef<GameState>(state);
  stateRef.current = state;

  const sweep = useCallback((index: number) => {
    dispatch({ type: 'SWEEP', index });
  }, []);

  const answer = useCallback((species: SpeciesId) => {
    dispatch({ type: 'ANSWER', species });
  }, []);

  const scan = useCallback(() => {
    dispatch({ type: 'SCAN' });
  }, []);

  const restart = useCallback(
    (nextTrail: TrailConfig, nextSettings: Settings, nextAttempt: number) => {
      dispatch({
        type: 'RESTART',
        trail: nextTrail,
        settings: nextSettings,
        attempt: nextAttempt,
      });
    },
    [],
  );

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      // the reducer was already initialised with these values
      mounted.current = true;
      return;
    }
    dispatch({ type: 'RESTART', trail, settings, attempt });
  }, [trail, settings, attempt]);

  return { state, stateRef, sweep, answer, scan, restart, summarize };
}

export default useGameEngine;
