import type { Producer, ProducerSpecialization } from '../types/game'
import { pick } from '../lib/random'

interface SpecDef {
  name: string
  description: string
  emoji: string
  effect: string
}

export const SPECIALIZATIONS: Record<ProducerSpecialization, SpecDef> = {
  talented: {
    name: 'Талановитий',
    description: '+5% до якості треків',
    emoji: '🎵',
    effect: 'qualityBonus',
  },
  shark: {
    name: 'Діляга',
    description: '+5% до прибутку',
    emoji: '🦈',
    effect: 'profitBonus',
  },
  maestro: {
    name: 'Метр',
    description: '-10% шанс скандалів',
    emoji: '🎼',
    effect: 'scandalReduction',
  },
  psychologist: {
    name: 'Психолог',
    description: '+10% до щастя артистів',
    emoji: '🧠',
    effect: 'happinessBonus',
  },
  scammer: {
    name: 'Аферист',
    description: '+10% до ризику, +15% до прибутку',
    emoji: '🎭',
    effect: 'riskProfitBonus',
  },
}

const PRODUCER_NAMES: string[] = [
  'Іван Бубен',
  'DJ Філармонія',
  'Толік Рингтон',
  'Маестро Гриша',
  'Пан Барабан',
  'Звукорежисер Жора',
  'Містер Семпл',
  'Льоня Бітмейкер',
  'Петро Нулі',
  'Сергій Фальцет',
]

export const generateProducer = (): Producer => {
  const specKeys = Object.keys(SPECIALIZATIONS) as ProducerSpecialization[]
  return {
    name: pick(PRODUCER_NAMES),
    portrait: '🎧',
    reputation: 50,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    specialization: pick(specKeys),
  }
}
