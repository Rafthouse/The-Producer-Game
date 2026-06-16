import type { Artist, GenreId, ArchetypeId, TourPlan, ArtistHistoryPoint } from '../types/game'
import { GENRES } from '../data/genres'
import { PREFIXES, READY_NAMES, ROOTS, SUFFIXES } from '../data/names'
import { TRAITS } from '../data/traits'
import { chance, clamp, pick, pickMany, randInt, randNorm, uid } from './random'
import { generateLyrics, generateTitle } from './generateLyrics'

const ARCHETYPE_IDS: ArchetypeId[] = ['punk', 'workaholic', 'alcoholic', 'romantic', 'lazy', 'genius', 'diva', 'street']

const GENRE_BIAS: Record<GenreId, Partial<Record<string, number>>> = {
  punk: { charisma: 10, discipline: -10, popularity: -5, selfConfidence: 15 },
  rap: { charisma: 8, talent: 3, popularity: 5, selfConfidence: 12 },
  pop: { charisma: 12, talent: -3, discipline: 5, popularity: 8, selfConfidence: 8 },
  folk: { talent: 8, discipline: 8, charisma: -3, happiness: 3, selfConfidence: -5 },
  bard: { talent: 5, charisma: -5, discipline: 3, selfConfidence: -3 },
  electro: { discipline: 8, talent: 3, charisma: -3, selfConfidence: 2 },
}

const makeName = (): string => {
  if (chance(0.5)) return pick(READY_NAMES)
  return `${pick(PREFIXES)} ${pick(ROOTS)}${pick(SUFFIXES)}`
}

export const generateArtist = (): Artist => {
  const genre = pick(GENRES)
  const archetypeId: ArchetypeId = pick(ARCHETYPE_IDS)

  const baseTalent = randNorm(50, 15)
  const baseCharisma = randNorm(50, 15)
  const baseDiscipline = randNorm(50, 15)
  const baseHealth = randNorm(55, 15)
  const baseHappiness = randNorm(50, 15)
  const basePopularity = randNorm(35, 12)
  const baseAddiction = randNorm(30, 18)
  const baseReputation = randNorm(40, 15)
  const baseSelfConfidence = randNorm(50, 18)

  const genreBias = GENRE_BIAS[genre.id]

  const initialHistory: ArtistHistoryPoint[] = [{
    week: 0, month: 1, year: 2024,
    popularity: basePopularity,
    health: baseHealth,
    happiness: baseHappiness,
    money: 0,
  }]

  const noTour: TourPlan = { status: 'none', weeksLeft: 0, expectedRevenue: 0, expectedFans: 0 }

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
    selfConfidence: clamp(baseSelfConfidence + (genreBias.selfConfidence ?? 0), 10, 90),
    traits: pickMany(TRAITS, randInt(1, 3)).map((t) => t.name),
    archetype: archetypeId,
    songText: generateLyrics(),
    trackTitle: generateTitle(),
    localPop: clamp(basePopularity + randInt(-10, 10), 10, 90),
    nationalPop: clamp(Math.round(basePopularity * 0.5) + randInt(-10, 10), 0, 90),
    globalPop: clamp(Math.round(basePopularity * 0.2) + randInt(0, 10), 0, 80),
    signedWeek: 0,
    contractLength: randInt(8, 24),
    needs: [],
    history: initialHistory,
    tour: noTour,
    inRehab: false,
    rehabWeeksLeft: 0,
    pregnant: false,
    married: false,
  }
}

export const generateArtistPair = (): [Artist, Artist] => {
  return [generateArtist(), generateArtist()]
}
