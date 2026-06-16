import type { NeedDef, ArtistNeed, Artist } from '../types/game'
import { pick, uid } from '../lib/random'

export const NEED_DEFS: NeedDef[] = [
  { id: 'vacation', title: 'Відпустка', description: 'Артист хоче відпочити на місяць', emoji: '🏖️', cost: 10000, happinessPenalty: 15 },
  { id: 'raise', title: 'Підвищення', description: 'Вимагає збільшення бюджету', emoji: '💰', cost: 20000, happinessPenalty: 12 },
  { id: 'costume', title: 'Новий костюм', description: 'Хоче сценічний образ від кутюр\'є', emoji: '👗', cost: 15000, happinessPenalty: 10 },
  { id: 'date', title: 'Побачення', description: 'Закохався, хоче романтики', emoji: '💞', cost: 8000, happinessPenalty: 14 },
  { id: 'psychologist', title: 'Психолог', description: 'Просить сеанси психотерапії', emoji: '🧠', cost: 12000, happinessPenalty: 18 },
  { id: 'new_instrument', title: 'Новий інструмент', description: 'Мріє про рідкісну гітару/синтезатор', emoji: '🎸', cost: 25000, happinessPenalty: 10 },
  { id: 'pet', title: 'Домашній улюбленець', description: 'Хоче завести собаку або кота', emoji: '🐕', cost: 5000, happinessPenalty: 8 },
  { id: 'tattoo', title: 'Нове татуювання', description: 'Хоче зробити тату на всю спину', emoji: '💉', cost: 10000, happinessPenalty: 6 },
]

/** Генерує випадкову потребу для артиста (якщо випав шанс) */
export const generateNeed = (_artist: Artist): ArtistNeed | null => {
  if (Math.random() > 0.3) return null // 30% шанс на потребу щотижня
  const def = pick(NEED_DEFS)
  return {
    id: uid(),
    title: def.title,
    description: def.description,
    emoji: def.emoji,
    happinessPenalty: def.happinessPenalty,
    cost: def.cost,
    weeksLeft: 2,
  }
}
