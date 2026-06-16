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
  staffBonus: number
  producerBonus: number
  profitMultiplier: number
  genreTrend?: GenreTrend      // тренд жанру
  freakPopBonus?: number        // бонус від треш-популярності
}

export const calculateRelease = (
  artist: Artist,
  context: ReleaseContext
): ReleaseResult => {
  const base =
    artist.talent * 0.30 +
    artist.charisma * 0.20 +
    artist.popularity * 0.15 +
    artist.discipline * 0.10 +
    artist.reputation * 0.10 +
    artist.selfConfidence * 0.05 -
    artist.addiction * 0.15

  // Бонуси студії та обладнання
  const studioBonus = context.studioLevel * 3 + context.qualityBonus
  const totalBonus = (context.equipBonus + context.staffBonus + context.producerBonus) * 0.5 + studioBonus

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
  const variation = randNorm(0, 8)

  const score = clamp(base + traits + totalBonus + trendBonus + freakBonus + luck + variation, 0, 160)

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
    events: generateEvents(artist, successType, traitChaos(artist.traits)),
    score: Math.round(score),
  }
}

/** Розраховує тур */
export const calculateTour = (
  artist: Artist,
  genreTrend?: GenreTrend
): { revenue: number; fans: number; status: 'success' | 'failed' } => {
  const base = artist.popularity * 0.3 + artist.charisma * 0.2 + (genreTrend?.popularityMod ?? 0) * 0.2
  const luck = randInt(-10, 20)
  const total = clamp(base + luck, 0, 100)

  if (total < 40) {
    const revenue = randInt(5_000, 30_000)
    return { revenue, fans: randInt(100, 1000), status: 'failed' }
  }

  const revenue = randInt(50_000, 500_000) + Math.round(total * 5000)
  const fans = randInt(5000, 50000) + Math.round(total * 500)
  return { revenue, fans, status: 'success' }
}
