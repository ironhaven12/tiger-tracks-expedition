/** Deterministic PRNG — one seed per attempt, so any run is reproducible. */

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** seed = levelIndex * 7919 ^ attempt * 104729 */
export function makeSeed(levelIndex: number, attempt: number): number {
  return ((levelIndex + 1) * 7919) ^ ((attempt + 1) * 104729);
}

export function pickIndex(rand: () => number, length: number): number {
  return Math.min(length - 1, Math.floor(rand() * length));
}

export function shuffle<T>(rand: () => number, input: T[]): T[] {
  const out = input.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}
