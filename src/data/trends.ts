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

export const GENRE_META: Record<GenreId, { name: string; emoji: string; color: string }> = {
  punk: { name: 'Панк', emoji: '🤘', color: '#ef4444' },
  rap: { name: 'Реп', emoji: '🎤', color: '#a855f7' },
  pop: { name: 'Поп', emoji: '💅', color: '#ec4899' },
  folk: { name: 'Фолк', emoji: '🌾', color: '#22c55e' },
  bard: { name: 'Бард', emoji: '🎸', color: '#f59e0b' },
  electro: { name: 'Електроніка', emoji: '🎛️', color: '#06b6d4' },
}

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
 * Популярність жанру змінюється щотижня.
 * Базова лінія дрейфує +- випадкове число, плюс вплив трендів.
 */
const GENRE_DRIFT: Record<GenreId, number> = {
  punk: 3,     // нестабільний, часто злітає/падає
  rap: 2,
  pop: 1,      // стабільний
  folk: -1,    // повільно втрачає
  bard: -2,
  electro: 4,  // дуже мінливий
}

/**
 * Генерує тренди (теми/вікна Овертона).
 */
export const generateTrends = (oldTrends?: Trend[]): Trend[] => {
  return TREND_TOPICS.map((t) => {
    const old = oldTrends?.find((ot) => ot.topic === t.topic)
    let pop: number
    let dir: 'rising' | 'peaking' | 'falling'

    if (old) {
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
 * Генерує популярність жанрів на основі трендів + власної динаміки.
 * Приймає попередній стан, щоб зробити плавний дрейф.
 */
export const generateGenreTrends = (
  trends: Trend[],
  oldGenreTrends?: GenreTrend[]
): GenreTrend[] => {
  const genreIds: GenreId[] = ['punk', 'rap', 'pop', 'folk', 'bard', 'electro']

  return genreIds.map((gid) => {
    const affinities = GENRE_AFFINITY[gid]
    const drift = GENRE_DRIFT[gid]

    // Минуле значення популярності
    const oldPop = oldGenreTrends?.find((g) => g.genreId === gid)?.popularity ?? 50

    // Базовий дрейф
    let newPop = oldPop + randInt(-4, 4) + drift * 0.5

    // Вплив трендів
    for (const aff of affinities) {
      const trend = trends.find((t) => t.topic === aff)
      if (trend) {
        if (trend.popularity > 60) newPop += 2
        else if (trend.popularity < 30) newPop -= 1
        if (trend.direction === 'rising') newPop += 1.5
        else if (trend.direction === 'falling') newPop -= 1.5
      }
    }

    // Невеликий випадковий стрибок
    if (chance(0.1)) newPop += randInt(-15, 15)

    newPop = clamp(Math.round(newPop), 5, 100)

    // popularityMod — похідна від зміни
    const popDiff = newPop - oldPop
    let mod = clamp(Math.round(popDiff * 1.5 + randInt(-5, 5)), -20, 20)

    // Найгарячіша тема для жанру
    let hottest = affinities[0]
    let hottestPop = -1
    for (const aff of affinities) {
      const trend = trends.find((t) => t.topic === aff)
      if (trend && trend.popularity > hottestPop) {
        hottestPop = trend.popularity
        hottest = aff
      }
    }

    return {
      genreId: gid,
      hotTopic: hottest,
      popularity: newPop,
      popularityMod: mod,
    }
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
