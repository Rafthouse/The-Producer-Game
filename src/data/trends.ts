import type { Trend, TrendTopic, GenreTrend, OvertonWindow } from '../types/game'
import type { GenreId } from '../types/game'
import { clamp, randInt, chance } from '../lib/random'

export const TREND_TOPICS: { topic: TrendTopic; name: string; emoji: string }[] = [
  { topic: 'protest', name: 'Протест', emoji: '✊' },
  { topic: 'absurd_humor', name: 'Абсурдний гумор', emoji: '🤪' },
  { topic: 'nostalgia', name: 'Ностальгія', emoji: '🕰️' },
  { topic: 'pathos', name: 'Пафос', emoji: '🎭' },
  { topic: 'romance', name: 'Романтика', emoji: '💕' },
  { topic: 'politics', name: 'Політика', emoji: '🏛️' },
  { topic: 'party', name: 'Тусовка', emoji: '🎉' },
  { topic: 'depression', name: 'Депресія', emoji: '🌧️' },
  { topic: 'nature', name: 'Природа', emoji: '🌿' },
  { topic: 'space', name: 'Космос', emoji: '🚀' },
]

/**
 * Зв'язок жанру з темами, які йому пасують.
 */
const GENRE_AFFINITY: Record<GenreId, TrendTopic[]> = {
  punk: ['protest', 'absurd_humor', 'politics', 'party'],
  rap: ['protest', 'politics', 'party', 'depression'],
  pop: ['romance', 'pathos', 'party', 'absurd_humor'],
  folk: ['nature', 'nostalgia', 'protest', 'depression'],
  bard: ['nostalgia', 'romance', 'depression', 'nature'],
  electro: ['space', 'party', 'absurd_humor', 'depression'],
}

/**
 * Генерує поточний стан трендів на основі попереднього стану.
 */
export const generateTrends = (oldTrends?: Trend[]): Trend[] => {
  return TREND_TOPICS.map((t) => {
    const old = oldTrends?.find((ot) => ot.topic === t.topic)
    let pop: number
    let dir: 'rising' | 'peaking' | 'falling'

    if (old) {
      // Дрейф
      const drift = randInt(-8, 8)
      pop = clamp(old.popularity + drift, 5, 95)
      if (old.direction === 'rising' && pop > 70) dir = 'peaking'
      else if (old.direction === 'peaking' && chance(0.4)) dir = 'falling'
      else if (old.direction === 'falling' && pop < 30) dir = 'rising'
      else dir = old.direction
    } else {
      pop = randInt(20, 80)
      dir = chance(0.4) ? 'rising' : chance(0.3) ? 'falling' : 'peaking'
    }

    return { topic: t.topic, name: t.name, emoji: t.emoji, popularity: pop, direction: dir }
  })
}

/**
 * Генерує модифікатори популярності жанрів на основі трендів.
 */
export const generateGenreTrends = (trends: Trend[]): GenreTrend[] => {
  const genreIds: GenreId[] = ['punk', 'rap', 'pop', 'folk', 'bard', 'electro']
  return genreIds.map((gid) => {
    const affinities = GENRE_AFFINITY[gid]
    let mod = 0
    let hottest = affinities[0]
    let hottestPop = -1

    for (const aff of affinities) {
      const trend = trends.find((t) => t.topic === aff)
      if (trend && trend.popularity > hottestPop) {
        hottestPop = trend.popularity
        hottest = aff
      }
      if (trend) {
        // Якщо тренд росте — додаємо, падає — віднімаємо
        if (trend.popularity > 60) mod += 3
        else if (trend.popularity > 40) mod += 1
        else mod -= 1
        if (trend.direction === 'rising') mod += 2
        else if (trend.direction === 'falling') mod -= 2
      }
    }

    return { genreId: gid, hotTopic: hottest, popularityMod: clamp(mod, -20, 20) }
  })
}

export const generateOvertonWindow = (trends: Trend[]): OvertonWindow[] => {
  return TREND_TOPICS.map((t) => {
    const trend = trends.find((tr) => tr.topic === t.topic)
    return {
      topic: t.topic,
      name: t.name,
      emoji: t.emoji,
      popularity: trend?.popularity ?? 50,
    }
  })
}
