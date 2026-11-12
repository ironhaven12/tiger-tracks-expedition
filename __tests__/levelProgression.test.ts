import { TRAILS } from '../src/constants/config';
import { applyRun, defaultProfile } from '../src/game/storage';

describe('level progression', () => {
  it('starts with only trail 01 unlocked', () => {
    expect(defaultProfile().unlockedTrails).toBe(1);
  });

  it('a win unlocks the next trail and stores the best stars', () => {
    const after = applyRun(defaultProfile(), {
      trailIndex: 0,
      outcome: 'win',
      stars: 2,
      total: 900,
      matched: { TIGER: 2 },
      tracksFound: 4,
      answers: 4,
      correctAnswers: 4,
      bestStreakStep: 2,
      daylightLeft: 8,
    });
    expect(after.unlockedTrails).toBe(2);
    expect(after.stars[0]).toBe(2);
    expect(after.trailBest[0]).toBe(900);
  });

  it('a loss unlocks nothing', () => {
    const after = applyRun(defaultProfile(), {
      trailIndex: 0,
      outcome: 'lost',
      stars: 0,
      total: 120,
      matched: {},
      tracksFound: 1,
      answers: 1,
      correctAnswers: 1,
      bestStreakStep: 1,
      daylightLeft: 0,
    });
    expect(after.unlockedTrails).toBe(1);
  });

  it('never unlocks past the last trail and keeps the better star count', () => {
    let profile = defaultProfile();
    for (let i = 0; i < TRAILS.length + 2; i++) {
      profile = applyRun(profile, {
        trailIndex: Math.min(TRAILS.length - 1, i),
        outcome: 'win',
        stars: 3,
        total: 100,
        matched: {},
        tracksFound: 1,
        answers: 1,
        correctAnswers: 1,
        bestStreakStep: 1,
        daylightLeft: 1,
      });
    }
    expect(profile.unlockedTrails).toBe(TRAILS.length);

    const weaker = applyRun(profile, {
      trailIndex: 0,
      outcome: 'win',
      stars: 1,
      total: 10,
      matched: {},
      tracksFound: 0,
      answers: 0,
      correctAnswers: 0,
      bestStreakStep: 0,
      daylightLeft: 0,
    });
    expect(weaker.stars[0]).toBe(3);
  });
});
