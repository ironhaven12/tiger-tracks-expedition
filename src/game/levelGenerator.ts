import {
  CELL_COUNT,
  GRID_COLS,
  GRID_ROWS,
  SpeciesId,
  TrailConfig,
} from '../constants/config';
import { makeSeed, mulberry32, pickIndex, shuffle } from './rng';

export type CellKind = 'empty' | 'track' | 'thorn';

export type Cell = {
  kind: CellKind;
  species: SpeciesId | null;
  proximity: number;
};

export type Layout = {
  cells: Cell[];
  seed: number;
  attempts: number;
  fromFallback: boolean;
};

const CORNERS = [0, GRID_COLS - 1, CELL_COUNT - GRID_COLS, CELL_COUNT - 1];

export function neighboursOf(index: number): number[] {
  const row = Math.floor(index / GRID_COLS);
  const col = index % GRID_COLS;
  const out: number[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) {
        continue;
      }
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLS) {
        out.push(r * GRID_COLS + c);
      }
    }
  }
  return out;
}

export function computeProximity(cells: Cell[]): Cell[] {
  return cells.map((cell, index) => ({
    ...cell,
    proximity: neighboursOf(index).filter(n => cells[n].kind === 'track')
      .length,
  }));
}

function emptyBoard(): Cell[] {
  const cells: Cell[] = [];
  for (let i = 0; i < CELL_COUNT; i++) {
    cells.push({ kind: 'empty', species: null, proximity: 0 });
  }
  return cells;
}

/**
 * A layout is playable when every designed track is on the board, no track
 * shares a cell with a thorn, and at least one track sits outside the corners
 * (so the first sweeps have something to deduce from).
 */
export function isPlayable(cells: Cell[], trail: TrailConfig): boolean {
  const trackIndices: number[] = [];
  cells.forEach((cell, index) => {
    if (cell.kind === 'track') {
      trackIndices.push(index);
    }
  });
  if (trackIndices.length !== trail.tracksTotal) {
    return false;
  }
  if (trackIndices.some(i => cells[i].species === null)) {
    return false;
  }
  const thorns = cells.filter(c => c.kind === 'thorn').length;
  if (thorns !== Math.min(trail.thorns, CELL_COUNT - trail.tracksTotal)) {
    return false;
  }
  return trackIndices.some(i => CORNERS.indexOf(i) === -1);
}

function fallbackLayout(trail: TrailConfig): Cell[] {
  const cells = emptyBoard();
  const spots = [5, 9, 6, 13, 10, 17, 2, 18];
  for (let i = 0; i < trail.tracksTotal; i++) {
    const at = spots[i % spots.length];
    cells[at] = {
      kind: 'track',
      species: trail.speciesPool[i % trail.speciesPool.length],
      proximity: 0,
    };
  }
  const thornSpots = [0, 3, 16, 19];
  const thorns = Math.min(trail.thorns, thornSpots.length);
  for (let i = 0; i < thorns; i++) {
    const at = thornSpots[i];
    if (cells[at].kind === 'empty') {
      cells[at] = { kind: 'thorn', species: null, proximity: 0 };
    }
  }
  return computeProximity(cells);
}

export function generateLayout(
  trail: TrailConfig,
  attempt: number,
  maxTries = 20,
): Layout {
  for (let tries = 0; tries < maxTries; tries++) {
    const seed = makeSeed(trail.index, attempt * maxTries + tries);
    const rand = mulberry32(seed);
    const cells = emptyBoard();
    const order = shuffle(
      rand,
      Array.from({ length: CELL_COUNT }, (_, i) => i),
    );

    let cursor = 0;
    const pool: SpeciesId[] = trail.speciesPool;
    // Every species of the pool appears at least once, then the rest is random.
    for (let i = 0; i < trail.tracksTotal; i++) {
      const at = order[cursor++];
      const species = i < pool.length ? pool[i] : pool[pickIndex(rand, pool.length)];
      cells[at] = { kind: 'track', species, proximity: 0 };
    }
    const thorns = Math.min(trail.thorns, CELL_COUNT - trail.tracksTotal);
    for (let i = 0; i < thorns; i++) {
      const at = order[cursor++];
      cells[at] = { kind: 'thorn', species: null, proximity: 0 };
    }

    const withProximity = computeProximity(cells);
    if (isPlayable(withProximity, trail)) {
      return { cells: withProximity, seed, attempts: tries + 1, fromFallback: false };
    }
  }

  return {
    cells: fallbackLayout(trail),
    seed: makeSeed(trail.index, attempt),
    attempts: maxTries,
    fromFallback: true,
  };
}

/** The order in which tracks are offered to the route map. */
export function trackOrder(cells: Cell[]): number[] {
  const out: number[] = [];
  cells.forEach((cell, index) => {
    if (cell.kind === 'track') {
      out.push(index);
    }
  });
  return out;
}
