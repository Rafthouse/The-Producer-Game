import type { Artist, SuccessType } from '../types/game'
import { BAD_EVENTS, GOOD_EVENTS, WILD_EVENTS } from '../data/events'
import { chance, clamp, shuffle } from './random'

/**
 * Генерує 1–3 події після релізу.
 */
export const generateEvents = (_artist: Artist, success: SuccessType, chaos: number): string[] => {
  const count = clamp(1 + (chance(0.5) ? 1 : 0) + (chaos >= 6 ? 1 : 0), 1, 3)

  const pool: string[] = []
  switch (success) {
    case 'Хіт':
    case 'Культовий шедевр':
      pool.push(...GOOD_EVENTS, ...GOOD_EVENTS)
      break
    case 'Нормальний реліз':
    case 'Локальний мем':
      pool.push(...GOOD_EVENTS, ...BAD_EVENTS)
      break
    case 'Провал':
      pool.push(...BAD_EVENTS, ...BAD_EVENTS)
      break
  }

  const wildWeight = clamp(1 + Math.round(chaos / 2), 1, 5)
  for (let i = 0; i < wildWeight; i++) pool.push(...WILD_EVENTS)

  return [...new Set(shuffle(pool))].slice(0, count)
}
