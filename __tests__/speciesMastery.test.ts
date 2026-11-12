import { MASTERY_THRESHOLD } from '../src/constants/config';
import { applyRun, defaultProfile, unlockedSpecies } from '../src/game/storage';
import { buildOptions, getSpecies, SPECIES } from '../src/game/species';
import { mulberry32 } from '../src/game/rng';

describe('species mastery', () => {
  it('ships five species, each with a sprite and a field note', () => {
    expect(SPECIES).toHaveLength(5);
    const sprites = SPECIES.map(s => s.spriteIndex);
    expect(new Set(sprites).size).toBe(5);
    SPECIES.forEach(s => {
      expect(s.note.length).toBeGreaterThan(10);
      expect(s.habitat.length).toBeGreaterThan(10);
    });
  });

  it('counts matches across expeditions and unlocks at three', () => {
    let profile = defaultProfile();
    expect(unlockedSpecies(profile, MASTERY_THRESHOLD)).toHaveLength(0);

    for (let i = 0; i < 3; i++) {
      profile = applyRun(profile, {
        trailIndex: 0,
        outcome: 'win',
        stars: 1,
        total: 120,
        matched: { TIGER: 1 },
        tracksFound: 1,
        answers: 1,
        correctAnswers: 1,
        bestStreakStep: 1,
        daylightLeft: 2,
      });
    }
    expect(profile.matched.TIGER).toBe(3);
    expect(unlockedSpecies(profile, MASTERY_THRESHOLD)).toEqual(['TIGER']);
  });

  it('always offers the true species among three distinct options', () => {
    const rand = mulberry32(42);
    for (let i = 0; i < 20; i++) {
      const options = buildOptions(rand, 'CHITAL', ['CHITAL', 'TIGER', 'BOAR']);
      expect(options).toHaveLength(3);
      expect(options).toContain('CHITAL');
      expect(new Set(options).size).toBe(3);
    }
  });

  it('falls back to the full roster when the trail pool is too small', () => {
    const rand = mulberry32(7);
    const options = buildOptions(rand, 'TIGER', ['TIGER']);
    expect(options).toHaveLength(3);
    expect(options).toContain('TIGER');
    expect(new Set(options).size).toBe(3);
  });

  it('resolves a species by id', () => {
    expect(getSpecies('PEACOCK').name).toBe('PEACOCK');
  });
});
