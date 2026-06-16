import type { Genre } from '../types/game'

export const GENRES: Genre[] = [
  { id: 'punk', name: 'Панк', role: 'панк-ікона', emoji: '🤘', accent: '#ef4444' },
  { id: 'rap', name: 'Реп', role: 'репер', emoji: '🎤', accent: '#a855f7' },
  { id: 'pop', name: 'Поп', role: 'поп-діва', emoji: '💅', accent: '#ec4899' },
  { id: 'folk', name: 'Фолк', role: 'фолк-співачка', emoji: '🌾', accent: '#22c55e' },
  { id: 'bard', name: 'Бард', role: 'бард', emoji: '🎸', accent: '#f59e0b' },
  { id: 'electro', name: 'Електроніка', role: 'електронний музикант', emoji: '🎛️', accent: '#06b6d4' },
]
