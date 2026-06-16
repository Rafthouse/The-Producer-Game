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

// --- Архетипи поведінки артистів ---
export type ArchetypeId =
  | 'punk'
  | 'workaholic'
  | 'alcoholic'
  | 'romantic'
  | 'lazy'
  | 'genius'
  | 'diva'
  | 'street'

export interface Archetype {
  id: ArchetypeId
  name: string
  /** Щомісячне змінення статів */
  effects: Partial<Record<StatKey, number>>
  /** Шанс особливих подій цього архетипу (0–1) */
  eventChance: number
}

// --- Характеристики ---
export type StatKey = 'talent' | 'discipline' | 'charisma' | 'health' | 'happiness' | 'popularity'

export interface Artist {
  id: string
  name: string
  genre: Genre
  age: number
  /** 10–90, середнє ~50 */
  talent: number
  /** 10–90 */
  discipline: number
  /** 10–90 */
  charisma: number
  /** 10–90 */
  health: number
  /** 10–90 */
  happiness: number
  /** 10–90 */
  popularity: number
  addiction: number // 10–90, окрема шкала
  reputation: number // 10–90, окрема шкала
  traits: string[]
  archetype: ArchetypeId
  songText: string
  trackTitle: string
  // Рейтинги
  localPop: number
  nationalPop: number
  globalPop: number
  // Контрактні умови
  signedWeek: number
  contractLength: number // в тижнях
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
  tokens: number
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
  tokens: number
}

// --- Продюсер ---
export type ProducerSpecialization =
  | 'talented'
  | 'shark'
  | 'maestro'
  | 'psychologist'
  | 'scammer'

export interface Producer {
  name: string
  portrait: string // emoji-based portrait
  reputation: number
  specialization: ProducerSpecialization
}

// --- Студія ---
export type StudioLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface StudioUpgrade {
  level: StudioLevel
  name: string
  qualityBonus: number
  cost: number
  description: string
}

// --- Обладнання ---
export type EquipmentType =
  | 'microphone'
  | 'monitor'
  | 'compressor'
  | 'synth'
  | 'acoustic'
  | 'lighting'

export interface Equipment {
  id: string
  type: EquipmentType
  name: string
  cost: number
  bonus: number // бонус до якості
  owned: boolean
}

// --- Персонал ---
export type StaffRole =
  | 'manager'
  | 'soundEngineer'
  | 'pr'
  | 'lawyer'
  | 'accountant'
  | 'security'

export interface StaffMember {
  id: string
  name: string
  role: StaffRole
  salary: number // щотижнева зарплата
  bonus: number // бонус до відповідних механік
  hired: boolean
  weekHired: number
}

// --- Календар ---
export interface Calendar {
  week: number
  month: number
  year: number
}

// --- Лейбл ---
export interface LabelUpgrade {
  slots: number
  cost: number
  name: string
}

// --- Тиждень подій ---
export interface WeekEvent {
  id: string
  title: string
  description: string
  type: 'positive' | 'negative' | 'neutral'
  emoji: string
  // Ефекти
  moneyChange?: number
  fanChange?: number
  tokenChange?: number
  repChange?: number
  targetArtistId?: string
}

// --- Чарти ---
export interface ChartEntry {
  artistId: string
  artistName: string
  trackTitle: string
  genreName: string
  plays: number
  rank: number
}

export interface Charts {
  topArtists: ChartEntry[]
  topSingles: ChartEntry[]
}

export type GamePhase =
  | 'intro'           // створення продюсера
  | 'pickArtist'      // вибір з пари артистів
  | 'release'         // студія
  | 'weekEnd'         // результати тижня + події
  | 'gameOver'        // поразка
  | 'victory'         // перемога
