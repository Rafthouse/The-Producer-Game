import type { Archetype } from '../types/game'

export const ARCHETYPES: Record<string, Archetype> = {
  punk: {
    id: 'punk',
    name: 'Панк',
    effects: { charisma: 5, health: -3, discipline: -2, happiness: 1 },
    eventChance: 0.15,
  },
  workaholic: {
    id: 'workaholic',
    name: 'Трудоголік',
    effects: { discipline: 5, talent: 2, happiness: -2, health: -2 },
    eventChance: 0.05,
  },
  alcoholic: {
    id: 'alcoholic',
    name: 'Алкоголік',
    effects: { health: -5, discipline: -3, charisma: 2, happiness: -1 },
    eventChance: 0.2,
  },
  romantic: {
    id: 'romantic',
    name: 'Романтик',
    effects: { charisma: 3, happiness: 2, discipline: -1, health: 1 },
    eventChance: 0.1,
  },
  lazy: {
    id: 'lazy',
    name: 'Ледар',
    effects: { discipline: -5, happiness: 3, talent: -1, health: 2 },
    eventChance: 0.08,
  },
  genius: {
    id: 'genius',
    name: 'Геній',
    effects: { talent: 4, charisma: -2, happiness: -1, discipline: 1 },
    eventChance: 0.12,
  },
  diva: {
    id: 'diva',
    name: 'Діва',
    effects: { charisma: 4, discipline: -3, happiness: -1, health: 1 },
    eventChance: 0.14,
  },
  street: {
    id: 'street',
    name: 'Вуличний',
    effects: { charisma: 2, health: 2, discipline: -2, talent: 1 },
    eventChance: 0.1,
  },
}
