import type { Artist, ReleaseResult, SuccessType } from '../types/game'
import { clamp, randFloat, randInt, randNorm } from './random'
import { traitScore, traitChaos } from './traitEffects'
import { generateEvents } from './generateEvents'

interface Tier {
  listeners: [number, number]
  fanRate: [number, number]
  payRate: [number, number]
  cost: [number, number]
  tokenReward: [number, number]
}

const TIERS: Record<SuccessType, Tier> = {
  'Провал': {
    listeners: [50, 3_000],
    fanRate: [-0.01, 0.01],
    payRate: [0.001, 0.003],
    cost: [3_000, 12_000],
    tokenReward: [0, 1],
  },
  'Локальний мем': {
    listeners: [3_000, 60_000],
    fanRate: [0.01, 0.05],
    payRate: [0.002, 0.004],
    cost: [2_000, 8_000],
    tokenReward: [1, 2],
  },
  'Нормальний реліз': {
    listeners: [60_000, 400_000],
    fanRate: [0.02, 0.06],
    payRate: [0.003, 0.005],
    cost: [3_000, 10_000],
    tokenReward: [2, 3],
  },
  'Хіт': {
    listeners: [400_000, 4_000_000],
    fanRate: [0.03, 0.08],
    payRate: [0.003, 0.006],
    cost: [5_000, 20_000],
    tokenReward: [3, 5],
  },
  'Культовий шедевр': {
    listeners: [4_000_000, 40_000_000],
    fanRate: [0.04, 0.1],
    payRate: [0.004, 0.007],
    cost: [8_000, 30_000],
    tokenReward: [5, 8],
  },
}

const tierFromScore = (score: number): SuccessType => {
  if (score < 20) return 'Провал'
  if (score < 45) return 'Локальний мем'
  if (score < 70) return 'Нормальний реліз'
  if (score < 95) return 'Хіт'
  return 'Культовий шедевр'
}

export interface ReleaseContext {
  studioLevel: number
  qualityBonus: number        // від студії
  equipBonus: number          // від обладнання
  staffBonus: number          // від звукорежисера (якщо найнятий)
  producerBonus: number       // від продюсера
  profitMultiplier: number    // від продюсера-діляги
}

/**
 * Розраховує результат релізу з урахуванням усіх бонусів.
 */
export const calculateRelease = (
  artist: Artist,
  context: ReleaseContext
): ReleaseResult => {
  // База: талант 35%, харизма 25%, популярність 20%, дисципліна 10%, репутація 10%
  const base =
    artist.talent * 0.35 +
    artist.charisma * 0.25 +
    artist.popularity * 0.2 +
    artist.discipline * 0.1 +
    artist.reputation * 0.1 -
    artist.addiction * 0.2

  // Бонуси
  const studioBonus = context.studioLevel * 3 + context.qualityBonus
  const totalBonus = (context.equipBonus + context.staffBonus + context.producerBonus) * 0.5 + studioBonus

  const luck = randInt(-15, 40)

  // Риси
  const traits = traitScore(artist.traits)
  const chaos = traitChaos(artist.traits)

  // Випадкоа норма з центром 0 для невеликої варіації
  const variation = randNorm(0, 8)

  const score = clamp(base + traits + totalBonus + luck + variation, 0, 160)

  const successType = tierFromScore(score)
  const tier = TIERS[successType]

  const listeners = randInt(tier.listeners[0], tier.listeners[1])
  const fans = Math.round(listeners * randFloat(tier.fanRate[0], tier.fanRate[1]))
  const revenue = listeners * randFloat(tier.payRate[0], tier.payRate[1])
  const cost = randInt(tier.cost[0], tier.cost[1])
  const money = Math.round(revenue * context.profitMultiplier - cost)
  const tokens = randInt(tier.tokenReward[0], tier.tokenReward[1])

  return {
    title: artist.trackTitle,
    listeners,
    fans,
    money,
    tokens,
    successType,
    events: generateEvents(artist, successType, chaos),
    score: Math.round(score),
  }
}
