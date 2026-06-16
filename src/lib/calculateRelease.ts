import type { Artist, ReleaseResult, SuccessType, GenreTrend } from '../types/game'
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
  qualityBonus: number
  equipBonus: number
  staffBonus: number        // звукорежисер
  producerBonus: number     // продюсер (з рівнем)
  profitMultiplier: number  // продюсер + юрист
  genreTrend?: GenreTrend
  freakPopBonus?: number
  prBonus?: number          // PR-менеджер
  managerBonus?: number     // менеджер (дисципліна)
  securityBonus?: number    // охоронець (скандали)
  accountantBonus?: number  // бухгалтер (знижка)
}

/**
 * Розраховує результат релізу з усіма бонусами.
 */
export const calculateRelease = (
  artist: Artist,
  context: ReleaseContext
): ReleaseResult => {
  // Базова формула з усіма статами
  const base =
    artist.talent * 0.25 +
    artist.charisma * 0.15 +
    artist.popularity * 0.10 +
    artist.discipline * 0.10 +
    artist.reputation * 0.05 +
    artist.selfConfidence * 0.05 -
    artist.addiction * 0.15

  // Бонуси студії + обладнання
  const studioBonus = context.studioLevel * 3 + context.qualityBonus
  const techBonus = (context.equipBonus + context.staffBonus + context.producerBonus) * 0.5 + studioBonus

  // Бонус менеджера (покращує дисципліну)
  const managerBonus = (context.managerBonus ?? 0) * 0.5

  // Бонус PR (покращує популярність)
  const prBonus = (context.prBonus ?? 0) * 0.3

  // Бонус охоронця (знижує хаос)
  const securityEffect = -(context.securityBonus ?? 0) * 0.2

  // Знижка бухгалтера (знижує витрати)
  const accountantDiscount = 1 - (context.accountantBonus ?? 0)

  // Тренди
  let trendBonus = 0
  if (context.genreTrend) {
    trendBonus = context.genreTrend.popularityMod * 0.3
  }

  // Фрік/треш бонус
  const freakBonus = (context.freakPopBonus ?? 0) * 0.5

  // Випадковість
  const luck = randInt(-15, 40)
  const traits = traitScore(artist.traits)
  const securityChaos = traitChaos(artist.traits) * (1 + securityEffect)
  const variation = randNorm(0, 8)

  const score = clamp(
    base + traits + techBonus + managerBonus + prBonus + trendBonus + freakBonus + luck + securityChaos * 0.5 + variation,
    0, 160
  )

  const successType = tierFromScore(score)
  const tier = TIERS[successType]

  const listeners = randInt(tier.listeners[0], tier.listeners[1])
  const fans = Math.round(listeners * randFloat(tier.fanRate[0], tier.fanRate[1]))
  const revenue = listeners * randFloat(tier.payRate[0], tier.payRate[1])
  const baseCost = randInt(tier.cost[0], tier.cost[1])
  const adjustedCost = Math.round(baseCost * accountantDiscount)
  const money = Math.round(revenue * context.profitMultiplier - adjustedCost)
  const tokens = randInt(tier.tokenReward[0], tier.tokenReward[1])

  return {
    title: artist.trackTitle,
    listeners,
    fans,
    money,
    tokens,
    successType,
    events: generateEvents(artist, successType, Math.round(traitChaos(artist.traits) * (1 + securityEffect))),
    score: Math.round(score),
  }
}

/**
 * Розраховує результат туру з урахуванням менеджера.
 */
export const calculateTour = (
  artist: Artist,
  genreTrend?: GenreTrend,
  managerBonus: number = 0
): { revenue: number; fans: number; status: 'success' | 'failed' } => {
  const base = artist.popularity * 0.3 + artist.charisma * 0.15 + (genreTrend?.popularityMod ?? 0) * 0.2 + managerBonus * 0.5
  const healthPenalty = artist.health < 40 ? (40 - artist.health) * 0.3 : 0
  const luck = randInt(-15, 25)
  const total = clamp(base + luck - healthPenalty, 0, 100)

  if (total < 40) {
    return {
      revenue: clamp(artist.popularity * 500 + randInt(-10000, 10000), 0, 80000),
      fans: randInt(100, artist.popularity * 100),
      status: 'failed',
    }
  }

  return {
    revenue: clamp(Math.round(artist.popularity * 5000 + total * 5000 + randInt(-20000, 20000)), 20000, 500000),
    fans: Math.round(clamp(artist.popularity * 500 + total * 300, 1000, 100000)),
    status: 'success',
  }
}
