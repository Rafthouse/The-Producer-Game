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
    description: '+5% якості релізів. +2% за рівень.',
    emoji: '🎵',
    effect: 'qualityBonus',
  },
  shark: {
    name: 'Діляга',
    description: '+5% прибутку. +3% за рівень.',
    emoji: '🦈',
    effect: 'profitBonus',
  },
  maestro: {
    name: 'Метр',
    description: '-10% ризику скандалів. -2% за рівень.',
    emoji: '🎼',
    effect: 'scandalReduction',
  },
  psychologist: {
    name: 'Психолог',
    description: '+10% щастя артистів. +2% за рівень.',
    emoji: '🧠',
    effect: 'happinessBonus',
  },
  scammer: {
    name: 'Аферист',
    description: '+15% прибутку. -5% репутації.',
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
