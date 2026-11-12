import {
  __setAdapterForTests,
  applyRun,
  clearProfile,
  defaultProfile,
  loadProfile,
  saveProfile,
} from '../src/game/storage';

function inMemory() {
  const store: Record<string, string> = {};
  return {
    store,
    getItem: (k: string) => Promise.resolve(store[k] ?? null),
    setItem: (k: string, v: string) => {
      store[k] = v;
      return Promise.resolve();
    },
    removeItem: (k: string) => {
      delete store[k];
      return Promise.resolve();
    },
  };
}

describe('persistence', () => {
  beforeEach(() => {
    __setAdapterForTests(inMemory());
  });

  it('returns a fresh profile when nothing was stored', async () => {
    const profile = await loadProfile();
    expect(profile.bestScore).toBe(0);
    expect(profile.stars).toHaveLength(6);
  });

  it('restores stars, records and the collection after a reopen', async () => {
    const played = applyRun(defaultProfile(), {
      trailIndex: 1,
      outcome: 'win',
      stars: 3,
      total: 1475,
      matched: { LANGUR: 3 },
      tracksFound: 5,
      answers: 6,
      correctAnswers: 5,
      bestStreakStep: 3,
      daylightLeft: 9,
    });
    await saveProfile(played);

    const restored = await loadProfile();
    expect(restored.bestScore).toBe(1475);
    expect(restored.stars[1]).toBe(3);
    expect(restored.matched.LANGUR).toBe(3);
    expect(restored.unlockedTrails).toBe(3);
    expect(restored.settings.pace).toBe('STANDARD');
  });

  it('merges a stored profile that misses newer fields', async () => {
    const adapter = inMemory();
    __setAdapterForTests(adapter);
    adapter.store['tigertracks.profile.v1'] = JSON.stringify({ bestScore: 50 });
    const restored = await loadProfile();
    expect(restored.bestScore).toBe(50);
    expect(restored.stars).toHaveLength(6);
    expect(restored.settings.hints).toBe(true);
  });

  it('survives corrupted storage instead of crashing', async () => {
    const adapter = inMemory();
    __setAdapterForTests(adapter);
    adapter.store['tigertracks.profile.v1'] = 'not json';
    const restored = await loadProfile();
    expect(restored.bestScore).toBe(0);
  });

  it('clearing wipes stars, records and the collection', async () => {
    const fresh = await clearProfile();
    expect(fresh.bestScore).toBe(0);
    expect(fresh.matched).toEqual({});
    expect(fresh.unlockedTrails).toBe(1);
  });
});
