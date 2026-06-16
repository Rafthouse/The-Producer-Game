import type { Artist, ReleaseResult, SuccessType } from '../types/game'
import { clamp, randFloat, randInt } from './random'
import { traitScore } from './traitEffects'
import { generateEvents } from './generateEvents'

interface Tier {
  listeners: [number, number]
  /** частка слухачів, що стають фанами (може бути від’ємною — втрата фанів) */
  fanRate: [number, number]
  /** дохід за одного слухача, ₴ */
  payRate: [number, number]
  /** витрати на реліз, ₴ */
  cost: [number, number]
}

const TIERS: Record<SuccessType, Tier> = {
  'Провал': {
    listeners: [50, 3_000],
    fanRate: [-0.01, 0.01],
    payRate: [0.001, 0.003],
    cost: [3_000, 12_000],
  },
  'Локальний мем': {
    listeners: [3_000, 60_000],
    fanRate: [0.01, 0.05],
    payRate: [0.002, 0.004],
    cost: [2_000, 8_000],
  },
  'Нормальний реліз': {
    listeners: [60_000, 400_000],
    fanRate: [0.02, 0.06],
    payRate: [0.003, 0.005],
    cost: [3_000, 10_000],
  },
  'Хіт': {
    listeners: [400_000, 4_000_000],
    fanRate: [0.03, 0.08],
    payRate: [0.003, 0.006],
    cost: [5_000, 20_000],
  },
  'Культовий шедевр': {
    listeners: [4_000_000, 40_000_000],
    fanRate: [0.04, 0.1],
    payRate: [0.004, 0.007],
    cost: [8_000, 30_000],
  },
}

const tierFromScore = (score: number): SuccessType => {
  if (score < 20) return 'Провал'
  if (score < 45) return 'Локальний мем'
  if (score < 70) return 'Нормальний реліз'
  if (score < 95) return 'Хіт'
  return 'Культовий шедевр'
}

/**
 * Розраховує результат релізу.
 * На бал впливають: талант, харизма, репутація, залежність, риси та фактор удачі.
 */
export const calculateRelease = (artist: Artist): ReleaseResult => {
  const base =
    artist.talent * 0.4 +
    artist.charisma * 0.3 +
    artist.reputation * 0.2 -
    artist.addiction * 0.25

  const luck = randInt(-15, 40)
  const score = clamp(base + traitScore(artist.traits) + luck, 0, 140)

  const successType = tierFromScore(score)
  const tier = TIERS[successType]

  const listeners = randInt(tier.listeners[0], tier.listeners[1])
  const fans = Math.round(listeners * randFloat(tier.fanRate[0], tier.fanRate[1]))
  const revenue = listeners * randFloat(tier.payRate[0], tier.payRate[1])
  const cost = randInt(tier.cost[0], tier.cost[1])
  const money = Math.round(revenue - cost)

  return {
    title: artist.trackTitle,
    listeners,
    fans,
    money,
    successType,
    events: generateEvents(artist, successType),
    score: Math.round(score),
  }
}
