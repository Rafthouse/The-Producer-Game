import type { Artist, GenreId, ArchetypeId } from '../types/game'
import { GENRES } from '../data/genres'
import { PREFIXES, READY_NAMES, ROOTS, SUFFIXES } from '../data/names'
import { TRAITS } from '../data/traits'
import { chance, clamp, pick, pickMany, randInt, randNorm, uid } from './random'
import { generateLyrics, generateTitle } from './generateLyrics'

type StatKey = 'talent' | 'discipline' | 'charisma' | 'health' | 'happiness' | 'popularity'

const ARCHETYPE_IDS: ArchetypeId[] = ['punk', 'workaholic', 'alcoholic', 'romantic', 'lazy', 'genius', 'diva', 'street']

/** Жанрові схильності для нових статів (крім репутації/залежності, які лишаються) */
const GENRE_BIAS: Record<GenreId, Partial<Record<StatKey, number>>> = {
  punk: { charisma: 10, discipline: -10, popularity: -5 },
  rap: { charisma: 8, talent: 3, popularity: 5 },
  pop: { charisma: 12, talent: -3, discipline: 5, popularity: 8 },
  folk: { talent: 8, discipline: 8, charisma: -3, happiness: 3 },
  bard: { talent: 5, charisma: -5, discipline: 3 },
  electro: { discipline: 8, talent: 3, charisma: -3 },
}

const makeName = (): string => {
  if (chance(0.5)) return pick(READY_NAMES)
  return `${pick(PREFIXES)} ${pick(ROOTS)}${pick(SUFFIXES)}`
}

/** Генерує нового випадкового артиста зі збалансованими статами. */
export const generateArtist = (): Artist => {
  const genre = pick(GENRES)
  const archetypeId: ArchetypeId = pick(ARCHETYPE_IDS)

  // Базова генерація через randNorm — середнє ~50, жодних крайнощів
  const baseTalent = randNorm(50, 15)
  const baseCharisma = randNorm(50, 15)
  const baseDiscipline = randNorm(50, 15)
  const baseHealth = randNorm(55, 15)
  const baseHappiness = randNorm(50, 15)
  const basePopularity = randNorm(35, 12)
  const baseAddiction = randNorm(30, 18)
  const baseReputation = randNorm(40, 15)

  // Жанрові зсуви
  const genreBias = GENRE_BIAS[genre.id]

  return {
    id: uid(),
    name: makeName(),
    genre,
    age: randInt(17, 64),
    talent: clamp(baseTalent + (genreBias.talent ?? 0), 10, 90),
    discipline: clamp(baseDiscipline + (genreBias.discipline ?? 0), 10, 90),
    charisma: clamp(baseCharisma + (genreBias.charisma ?? 0), 10, 90),
    health: clamp(baseHealth, 10, 90),
    happiness: clamp(baseHappiness + (genreBias.happiness ?? 0), 10, 90),
    popularity: clamp(basePopularity + (genreBias.popularity ?? 0), 10, 90),
    addiction: clamp(baseAddiction, 10, 90),
    reputation: clamp(baseReputation, 10, 90),
    traits: pickMany(TRAITS, randInt(1, 3)).map((t) => t.name),
    archetype: archetypeId,
    songText: generateLyrics(),
    trackTitle: generateTitle(),
    localPop: clamp(basePopularity + randInt(-10, 10), 10, 90),
    nationalPop: clamp(Math.round(basePopularity * 0.5) + randInt(-10, 10), 0, 90),
    globalPop: clamp(Math.round(basePopularity * 0.2) + randInt(0, 10), 0, 80),
    signedWeek: 0,
    contractLength: randInt(8, 24), // 8-24 тижні контракту
  }
}

/** Генерує пару артистів для вибору */
export const generateArtistPair = (): [Artist, Artist] => {
  return [generateArtist(), generateArtist()]
}
