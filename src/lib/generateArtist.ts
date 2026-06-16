import type { Artist, GenreId } from '../types/game'
import { GENRES } from '../data/genres'
import { PREFIXES, READY_NAMES, ROOTS, SUFFIXES } from '../data/names'
import { TRAITS } from '../data/traits'
import { chance, clamp, pick, pickMany, randInt, uid } from './random'
import { generateLyrics, generateTitle } from './generateLyrics'

type StatKey = 'charisma' | 'talent' | 'discipline' | 'addiction' | 'reputation'

// Жанрові схильності: відхилення від базового кидка для кожної характеристики.
const GENRE_BIAS: Record<GenreId, Partial<Record<StatKey, number>>> = {
  punk: { charisma: 15, discipline: -20, addiction: 20, reputation: -10 },
  rap: { charisma: 12, talent: 5, addiction: 8, discipline: -5, reputation: -5 },
  pop: { charisma: 20, talent: -5, discipline: 10, addiction: 5, reputation: 5 },
  folk: { talent: 12, discipline: 10, charisma: -5, addiction: -15, reputation: 8 },
  bard: { talent: 8, charisma: -8, discipline: 5, addiction: 5 },
  electro: { discipline: 12, talent: 5, charisma: -5 },
}

const rollStat = (genre: GenreId, key: StatKey): number => {
  const base = randInt(25, 80)
  const bias = GENRE_BIAS[genre][key] ?? 0
  return clamp(base + bias, 5, 99)
}

const makeName = (): string => {
  if (chance(0.5)) return pick(READY_NAMES)
  return `${pick(PREFIXES)} ${pick(ROOTS)}${pick(SUFFIXES)}`
}

/** Генерує нового випадкового артиста разом із треком і текстом пісні. */
export const generateArtist = (): Artist => {
  const genre = pick(GENRES)
  return {
    id: uid(),
    name: makeName(),
    genre,
    age: randInt(17, 64),
    charisma: rollStat(genre.id, 'charisma'),
    talent: rollStat(genre.id, 'talent'),
    discipline: rollStat(genre.id, 'discipline'),
    addiction: rollStat(genre.id, 'addiction'),
    reputation: rollStat(genre.id, 'reputation'),
    traits: pickMany(TRAITS, randInt(1, 3)).map((t) => t.name),
    songText: generateLyrics(),
    trackTitle: generateTitle(),
  }
}
