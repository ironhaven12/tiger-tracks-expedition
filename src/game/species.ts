import { SpeciesId } from '../constants/config';
import { shuffle } from './rng';

export type Species = {
  id: SpeciesId;
  name: string;
  spriteIndex: number; // 0..4 -> sprite_1..sprite_5
  note: string;
  habitat: string;
};

export const SPECIES: Species[] = [
  {
    id: 'TIGER',
    name: 'TIGER',
    spriteIndex: 0,
    note: 'PAD WIDE AS A PALM, NO CLAW MARKS',
    habitat: 'DENSE SAL FOREST AND TALL GRASS',
  },
  {
    id: 'CHITAL',
    name: 'CHITAL',
    spriteIndex: 1,
    note: 'TWO SHARP CRESCENTS, POINTING THE WAY IT RAN',
    habitat: 'OPEN GLADES NEAR WATER',
  },
  {
    id: 'LANGUR',
    name: 'LANGUR',
    spriteIndex: 2,
    note: 'A LONG HAND PRINT WITH FIVE SPREAD DIGITS',
    habitat: 'HIGH CANOPY, DOWN TO DRINK AT DAWN',
  },
  {
    id: 'PEACOCK',
    name: 'PEACOCK',
    spriteIndex: 3,
    note: 'THREE THIN FORWARD CLAWS AND ONE BEHIND',
    habitat: 'SCRUB EDGES AND DUSTY FOREST ROADS',
  },
  {
    id: 'BOAR',
    name: 'BOAR',
    spriteIndex: 4,
    note: 'CLOVEN SLOTS WITH TWO DEW DOTS BEHIND',
    habitat: 'MUDDY WALLOWS AND ROOTED-UP BANKS',
  },
];

const BY_ID: Record<string, Species> = SPECIES.reduce((acc, s) => {
  acc[s.id] = s;
  return acc;
}, {} as Record<string, Species>);

export function getSpecies(id: SpeciesId): Species {
  return BY_ID[id] || SPECIES[0];
}

/** The true species plus two decoys drawn from the trail pool. */
export function buildOptions(
  rand: () => number,
  truth: SpeciesId,
  pool: SpeciesId[],
): SpeciesId[] {
  const others = pool.filter(id => id !== truth);
  const fallback = SPECIES.map(s => s.id).filter(id => id !== truth);
  const source = others.length >= 2 ? others : fallback;
  const decoys = shuffle(rand, source).slice(0, 2);
  return shuffle(rand, [truth, ...decoys]);
}
