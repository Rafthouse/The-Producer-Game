import { TRAITS } from '../data/traits'

const sumTrait = (traits: string[], key: 'scoreMod' | 'chaosMod'): number =>
  traits.reduce((sum, name) => {
    const def = TRAITS.find((t) => t.name === name)
    return sum + (def?.[key] ?? 0)
  }, 0)

/** Сумарний вплив рис на бал релізу. */
export const traitScore = (traits: string[]): number => sumTrait(traits, 'scoreMod')

/** Сумарний «хаос» рис — впливає на кількість і тип подій. */
export const traitChaos = (traits: string[]): number => sumTrait(traits, 'chaosMod')
