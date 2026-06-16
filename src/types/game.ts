// ---- Core domain types for Producer Tycoon ----

export type GenreId = 'punk' | 'rap' | 'pop' | 'folk' | 'bard' | 'electro'

export interface Genre {
  id: GenreId
  /** Коротка назва жанру, напр. "Панк" */
  name: string
  /** Роль артиста, напр. "поп-діва" */
  role: string
  emoji: string
  /** HEX-колір акценту для картки */
  accent: string
}

export interface Artist {
  id: string
  name: string
  genre: Genre
  age: number
  /** 0–100 */
  charisma: number
  /** 0–100 */
  talent: number
  /** 0–100 */
  discipline: number
  /** 0–100 */
  addiction: number
  /** 0–100 */
  reputation: number
  traits: string[]
  songText: string
  trackTitle: string
}

export type SuccessType =
  | 'Провал'
  | 'Локальний мем'
  | 'Нормальний реліз'
  | 'Хіт'
  | 'Культовий шедевр'

export interface ReleaseResult {
  title: string
  listeners: number
  fans: number
  money: number
  successType: SuccessType
  events: string[]
  /** Сирий бал розрахунку (для відлагодження/відчуття) */
  score: number
}

export interface LabelStats {
  money: number
  fans: number
  signed: number
  releases: number
}

export type GamePhase = 'newArtist' | 'release' | 'result'
