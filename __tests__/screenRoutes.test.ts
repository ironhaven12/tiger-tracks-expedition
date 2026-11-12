import { MENU_ROUTES, SCREEN_IDS } from '../src/constants/config';

const BANNED_GLYPHS = /[‹›▸▶▾▴→←⇒⟶⟵]/;

describe('screen routes', () => {
  it('declares a gameover/result state in the screen machine', () => {
    expect(SCREEN_IDS).toContain('loader');
    expect(SCREEN_IDS).toContain('menu');
    expect(SCREEN_IDS).toContain('game');
    expect(SCREEN_IDS).toContain('gameover');
    expect(SCREEN_IDS).toContain('result');
  });

  it('every menu route points at a real screen', () => {
    MENU_ROUTES.forEach(route => {
      expect(SCREEN_IDS).toContain(route.screen);
    });
  });

  it('route labels are plain uppercase ASCII the UI harness can tap', () => {
    MENU_ROUTES.forEach(route => {
      expect(route.label).toBe(route.label.toUpperCase());
      expect(BANNED_GLYPHS.test(route.label)).toBe(false);
      expect(/^[A-Z0-9 ]+$/.test(route.label)).toBe(true);
    });
  });

  it('offers the four documented sub-screens', () => {
    expect(MENU_ROUTES.map(r => r.label)).toEqual([
      'LEVELS',
      'COLLECTION',
      'PROGRESS',
      'SETTINGS',
    ]);
  });
});
