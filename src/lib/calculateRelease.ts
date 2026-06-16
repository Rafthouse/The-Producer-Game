import type { Artist, ReleaseResult, SuccessType, GenreTrend } from '../types/game'
import { clamp, randInt, randFloat } from './random'
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
  if (score < 25) return 'Провал'
  if (score < 50) return 'Локальний мем'
  if (score < 75) return 'Нормальний реліз'
  if (score < 100) return 'Хіт'
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
  scandalReduction?: number // Метр: -ризик скандалів
  happinessMod?: number     // Психолог: +щастя
}

/**
 * Розраховує результат релізу з усіма бонусами.
 * Формула: 70% впевненість (статистика), 15% бонуси,
 * 10% контекст (тренди/фрік), 5% випадковість.
 */
export const calculateRelease = (
  artist: Artist,
  context: ReleaseContext
): ReleaseResult => {
  // === БАЗОВА СТАТИСТИКА (70% результату) ===
  // Максимум: 90*0.35 + 90*0.20 + 90*0.10 + 90*0.10 = 31.5 + 18 + 9 + 9 = 67.5
  const base =
    artist.talent * 0.35 +
    artist.charisma * 0.20 +
    artist.popularity * 0.10 +
    artist.discipline * 0.10 +
    artist.reputation * 0.05 +
    artist.selfConfidence * 0.02 -
    artist.addiction * 0.15

  // === БОНУСИ (15% результату) ===
  const studioBonus = context.studioLevel * 2 + context.qualityBonus
  const techBonus = (context.equipBonus + context.staffBonus + context.producerBonus) * 0.4 + studioBonus * 0.3

  // Менеджер → дисципліна
  const managerBonus = (context.managerBonus ?? 0) * 0.4

  // PR-менеджер → популярність
  const prBonus = (context.prBonus ?? 0) * 0.3

  // Охоронець → -хаос
  const securityEffect = -(context.securityBonus ?? 0) * 0.15

  // Метр → -скандали (додатковий захист)
  const scandalReduction = context.scandalReduction ?? 0

  // === КОНТЕКСТ (10% результату) ===
  // Тренди
  let trendBonus = 0
  if (context.genreTrend) {
    trendBonus = clamp(context.genreTrend.popularityMod * 0.4, -8, 8)
  }

  // Фрік/треш бонус
  const freakBonus = clamp((context.freakPopBonus ?? 0) * 0.3, 0, 9)

  // === ТРЕЙТИ ===
  const traits = traitScore(artist.traits) // очікується ±10
  // Менше хаосу з охоронцем + Метром
  const totalSecurityBonus = 1 + securityEffect - scandalReduction * 0.5
  const chaos = traitChaos(artist.traits) * Math.max(0.1, totalSecurityBonus)

  // === ВИПАДКОВІСТЬ (5% результату = ±8) ===
  const luck = randInt(-8, 8)

  const score = clamp(
    base + techBonus + managerBonus + prBonus + trendBonus + freakBonus + traits + chaos * 0.3 + luck,
    0, 160
  )

  const successType = tierFromScore(score)
  const tier = TIERS[successType]

  const listeners = randInt(tier.listeners[0], tier.listeners[1])
  const fans = Math.round(listeners * randFloat(tier.fanRate[0], tier.fanRate[1]))
  const revenue = listeners * randFloat(tier.payRate[0], tier.payRate[1])
  const baseCost = randInt(tier.cost[0], tier.cost[1])
  const adjustedCost = Math.round(baseCost * (1 - (context.accountantBonus ?? 0)))
  const money = Math.round(revenue * context.profitMultiplier - adjustedCost)
  const tokens = randInt(tier.tokenReward[0], tier.tokenReward[1])

  return {
    title: artist.trackTitle,
    listeners,
    fans,
    money,
    tokens,
    successType,
    events: generateEvents(artist, successType, Math.round(chaos)),
    score: Math.round(score),
  }
}

/**
 * Розраховує результат туру.
 *
 * Формула:
 *   base = popularity*0.30 + charisma*0.15 + reputation*0.10 + genreTrend*0.15 + managerBonus*0.25
 *   healthPenalty = health < 40 ? (40-health)*0.25 : 0
 *   luck = randInt(-12, 12)
 *   total = clamp(base + luck - healthPenalty, 0, 100)
 *   success = total >= 40
 */
export const calculateTour = (
  artist: Artist,
  genreTrend?: GenreTrend,
  managerBonus: number = 0
): { revenue: number; fans: number; status: 'success' | 'failed' } => {
  const base =
    artist.popularity * 0.30 +
    artist.charisma * 0.15 +
    artist.reputation * 0.10 +
    (genreTrend?.popularityMod ?? 0) * 0.15 +
    managerBonus * 0.25

  const healthPenalty = artist.health < 40 ? (40 - artist.health) * 0.25 : 0
  const luck = randInt(-12, 12)
  const total = clamp(base + luck - healthPenalty, 0, 100)

  if (total < 40) {
    return {
      revenue: clamp(artist.popularity * 300 + randInt(-5000, 5000), 0, 50000),
      fans: randInt(50, Math.round(artist.popularity * 50)),
      status: 'failed',
    }
  }

  return {
    revenue: clamp(
      Math.round(artist.popularity * 3000 + total * 4000 + randInt(-10000, 10000)),
      20000, 500000
    ),
    fans: Math.round(clamp(artist.popularity * 300 + total * 200, 1000, 100000)),
    status: 'success',
  }
}
