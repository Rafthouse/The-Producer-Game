import type { Artist, GenreId, ArchetypeId, TourPlan, ArtistHistoryPoint } from '../types/game'
import { GENRES } from '../data/genres'
import { PREFIXES, READY_NAMES, ROOTS, SUFFIXES } from '../data/names'
import { TRAITS } from '../data/traits'
import { chance, clamp, pick, pickMany, randInt, randNorm, uid } from './random'
import { generateLyricsFromPrompt, generateTitle } from './generateLyrics'

const ARCHETYPE_IDS: ArchetypeId[] = ['punk', 'workaholic', 'alcoholic', 'romantic', 'lazy', 'genius', 'diva', 'street']

// Помірні зсуви — жоден не дає більше ±8
const GENRE_BIAS: Record<GenreId, Partial<Record<string, number>>> = {
  punk: { charisma: 6, discipline: -6, popularity: -3, selfConfidence: 8 },
  rap: { charisma: 5, talent: 2, popularity: 3, selfConfidence: 7 },
  pop: { charisma: 7, talent: -2, discipline: 3, popularity: 5, selfConfidence: 5 },
  folk: { talent: 5, discipline: 5, charisma: -2, selfConfidence: -3 },
  bard: { talent: 3, charisma: -3, discipline: 2, selfConfidence: -2 },
  electro: { discipline: 5, talent: 2, charisma: -2, selfConfidence: 1 },
}

const makeName = (): string => {
  if (chance(0.5)) return pick(READY_NAMES)
  return `${pick(PREFIXES)} ${pick(ROOTS)}${pick(SUFFIXES)}`
}

export const generateArtist = (): Artist => {
  const genre = pick(GENRES)
  const archetypeId: ArchetypeId = pick(ARCHETYPE_IDS)

  // Середній рівень 40-60. Максимум 90, мінімум 10.
  const baseTalent = clamp(randNorm(50, 12), 10, 90)
  const baseCharisma = clamp(randNorm(50, 12), 10, 90)
  const baseDiscipline = clamp(randNorm(50, 12), 10, 90)
  const baseHealth = clamp(randNorm(55, 12), 10, 90)
  const baseHappiness = clamp(randNorm(50, 12), 10, 90)
  const basePopularity = clamp(randNorm(40, 10), 10, 90)
  const baseAddiction = clamp(randNorm(30, 15), 10, 90)
  const baseReputation = clamp(randNorm(45, 12), 10, 90)
  const baseSelfConfidence = clamp(randNorm(50, 15), 10, 90)

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
    songText: generateLyricsFromPrompt('', genre.id),
    trackTitle: generateTitle(),
    lyricsPrompt: `${genre.role}: ${genre.name.toLowerCase()} музика`,  // дефолтний промпт
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
    currentEvent: null,
  }
}

export const generateArtistPair = (): [Artist, Artist] => {
  return [generateArtist(), generateArtist()]
}
