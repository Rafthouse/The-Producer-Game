// ---- Core domain types for Producer Tycoon ----

export type GenreId = 'punk' | 'rap' | 'pop' | 'folk' | 'bard' | 'electro'

export interface Genre {
  id: GenreId
  name: string
  role: string
  emoji: string
  accent: string
}

export type ArchetypeId =
  | 'punk' | 'workaholic' | 'alcoholic' | 'romantic'
  | 'lazy' | 'genius' | 'diva' | 'street'

export interface Archetype {
  id: ArchetypeId
  name: string
  effects: Partial<Record<StatKey, number>>
  eventChance: number
}

export type StatKey = 'talent' | 'discipline' | 'charisma' | 'health' | 'happiness' | 'popularity'

export interface ArtistNeed {
  id: string
  title: string
  description: string
  emoji: string
  /** Якщо не виконати — скільки щастя втратить */
  happinessPenalty: number
  /** Якщо виконати — скільки грошей коштує */
  cost: number
  /** Тижнів залишилось до виконання */
  weeksLeft: number
}

export interface ArtistHistoryPoint {
  week: number
  month: number
  year: number
  popularity: number
  health: number
  happiness: number
  money: number
}

export type TourStatus = 'none' | 'planning' | 'ongoing' | 'success' | 'failed'

export interface TourPlan {
  status: TourStatus
  weeksLeft: number
  expectedRevenue: number
  expectedFans: number
}

export interface Artist {
  id: string
  name: string
  genre: Genre
  age: number
  talent: number       // 10-90
  discipline: number   // 10-90
  charisma: number     // 10-90
  health: number       // 10-90
  happiness: number    // 10-90
  popularity: number   // 10-90
  addiction: number    // 10-90
  reputation: number   // 10-90
  selfConfidence: number // 10-90 — нова: самовпевненість (треш-зірки)
  traits: string[]
  archetype: ArchetypeId
  songText: string
  trackTitle: string
  localPop: number
  nationalPop: number
  globalPop: number
  signedWeek: number
  contractLength: number
  // Нове v0.3
  needs: ArtistNeed[]
  history: ArtistHistoryPoint[]
  tour: TourPlan
  inRehab: boolean
  rehabWeeksLeft: number
  pregnant: boolean      // для романтиків/подій
  married: boolean
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
  score: number
}

export interface LabelStats {
  money: number
  fans: number
  signed: number
  releases: number
  tokens: number
}

export type ProducerSpecialization =
  | 'talented' | 'shark' | 'maestro' | 'psychologist' | 'scammer'

export interface Producer {
  name: string
  portrait: string
  reputation: number
  specialization: ProducerSpecialization
  level: number
  experience: number
  experienceToNext: number
}

export type StudioLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface StudioUpgrade {
  level: StudioLevel
  name: string
  qualityBonus: number
  cost: number
  description: string
}

export type EquipmentType =
  | 'microphone' | 'monitor' | 'compressor' | 'synth' | 'acoustic' | 'lighting'

export interface Equipment {
  id: string
  type: EquipmentType
  name: string
  cost: number
  bonus: number
  owned: boolean
}

export type StaffRole =
  | 'manager' | 'soundEngineer' | 'pr' | 'lawyer' | 'accountant' | 'security'

export interface StaffMember {
  id: string
  name: string
  role: StaffRole
  salary: number
  bonus: number
  hired: boolean
  weekHired: number
  /** Нова риса характеру */
  personality: string
}

export interface Calendar {
  week: number
  month: number
  year: number
}

export interface LabelUpgrade {
  slots: number
  cost: number
  name: string
}

export interface WeekEvent {
  id: string
  title: string
  description: string
  type: 'positive' | 'negative' | 'neutral'
  emoji: string
  moneyChange?: number
  fanChange?: number
  tokenChange?: number
  repChange?: number
  targetArtistId?: string
}

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

// --- Тренди / Вікна Овертона ---
export type TrendTopic =
  | 'protest' | 'absurd_humor' | 'nostalgia'
  | 'pathos' | 'romance' | 'politics'
  | 'party' | 'depression' | 'nature' | 'space'

export interface Trend {
  topic: TrendTopic
  name: string
  emoji: string
  /** +- вплив на популярність жанру, що грає на цій темі */
  popularity: number // 0-100, наскільки тренд актуальний
  direction: 'rising' | 'peaking' | 'falling'
}

export interface GenreTrend {
  genreId: GenreId
  /** Яка тема зараз популярна для цього жанру (якщо артист під неї підходить) */
  hotTopic: TrendTopic
  /** Модифікатор популярності цього жанру загалом (-20 до +20) */
  popularityMod: number
}

export interface OvertonWindow {
  topic: TrendTopic
  name: string
  emoji: string
  /** Наскільки популярна тема зараз. Оновлюється щотижня */
  popularity: number // 0-100
}

// --- Новини ---
export interface NewsItem {
  id: string
  week: number
  month: number
  year: number
  title: string
  description: string
  emoji: string
  type: 'trend' | 'artist' | 'world' | 'label'
}

// --- Потреби артистів ---
export type NeedType =
  | 'vacation' | 'raise' | 'costume' | 'date'
  | 'psychologist' | 'new_instrument' | 'pet' | 'tattoo'

export interface NeedDef {
  id: NeedType
  title: string
  description: string
  emoji: string
  cost: number
  happinessPenalty: number
}

// --- Фрік / треш-механіка ---
export interface FreakStatus {
  /** Чи став артист інтернет-фріком */
  isFreak: boolean
  /** Чи став треш-зіркою */
  isTrashStar: boolean
  /** Бонус до популярності за рахунок трешу */
  trashPopBonus: number
  /** Штраф до репутації */
  repPenalty: number
}

export type GameTab = 'studio' | 'label' | 'world'

export type GamePhase =
  | 'intro'
  | 'playing'       // основний геймплей з трьома вкладками
  | 'gameOver'
  | 'victory'
