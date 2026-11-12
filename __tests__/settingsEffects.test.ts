import {
  BOARD_TILE,
  daylightFor,
  DEFAULT_SETTINGS,
  HINTS_OFF_MULTIPLIER,
  TRAILS,
} from '../src/constants/config';
import { matchPoints } from '../src/game/scoring';
import { makeState } from './helpers';

describe('settings effects', () => {
  it('daylight pace changes the step budget', () => {
    const trail = TRAILS[0];
    expect(daylightFor(trail, 'RELAXED')).toBeGreaterThan(
      daylightFor(trail, 'STANDARD'),
    );
    expect(daylightFor(trail, 'EXPERT')).toBeLessThan(
      daylightFor(trail, 'STANDARD'),
    );
    expect(daylightFor(trail, 'STANDARD')).toBe(trail.daylight);
  });

  it('the pace is applied to the started run', () => {
    expect(makeState(0, { pace: 'EXPERT' }).daylightTotal).toBe(
      daylightFor(TRAILS[0], 'EXPERT'),
    );
  });

  it('turning hints off raises the match score', () => {
    expect(matchPoints(0, false)).toBe(Math.round(120 * HINTS_OFF_MULTIPLIER));
    expect(matchPoints(0, true)).toBe(120);
  });

  it('the hints flag reaches the run state', () => {
    expect(makeState(0, { hints: false }).hintsOn).toBe(false);
    expect(makeState(0, { hints: true }).hintsOn).toBe(true);
  });

  it('board size maps to two different tile sizes', () => {
    expect(BOARD_TILE.COMFORT).toBeGreaterThan(BOARD_TILE.COMPACT);
  });

  it('the defaults are the documented ones', () => {
    expect(DEFAULT_SETTINGS).toEqual({
      hints: true,
      pace: 'STANDARD',
      boardSize: 'COMFORT',
      reducedMotion: false,
    });
  });
});
