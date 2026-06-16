import { create } from 'zustand'
import type {
  Artist,
  GamePhase,
  LabelStats,
  ReleaseResult,
  Producer,
  StudioLevel,
  Equipment,
  StaffMember,
  Calendar,
  WeekEvent,
  Charts,
} from '../types/game'
import { generateArtistPair } from '../lib/generateArtist'
import { calculateRelease, type ReleaseContext } from '../lib/calculateRelease'
import { generateProducer, SPECIALIZATIONS } from '../data/producer'
import { ARCHETYPES } from '../data/archetypes'
import { STUDIO_UPGRADES, LABEL_SLOTS, EQUIPMENT_LIST, generateStaffPool } from '../data/studio'
import { generateWeekEvents } from '../data/weekEvents'
import { clamp, randInt } from '../lib/random'

interface GameStore {
  phase: GamePhase

  // Продюсер
  producer: Producer | null

  // Артисти
  artistPair: [Artist, Artist] | null
  artists: Artist[] // підписані артисти
  currentArtist: Artist | null

  // Лейбл
  label: LabelStats
  labelSlotIndex: number // індекс у LABEL_SLOTS

  // Студія
  studioLevel: StudioLevel

  // Обладнання
  equipment: Equipment[]

  // Персонал
  staffPool: Omit<StaffMember, 'hired' | 'weekHired'>[]
  hiredStaff: StaffMember[]

  // Календар
  calendar: Calendar

  // Результат
  result: ReleaseResult | null

  // Події тижня
  weekEvents: WeekEvent[]

  // Чарти (поки заглушка)
  charts: Charts

  // Лічильники
  rejectedThisWeek: number
  weeksWithoutArtist: number

  // --- Дії ---

  // Старт гри: обрати спеціалізацію
  startGame: (specialization: string) => void

  // Обрати артиста з пари
  signArtist: (index: 0 | 1) => void

  // Відмовити обом
  rejectBoth: () => void

  // Випустити сингл
  release: () => void

  // Завершити тиждень
  endWeek: () => void

  // Купити апгрейд лейблу
  upgradeLabel: () => void

  // Купити апгрейд студії
  upgradeStudio: () => void

  // Купити обладнання
  buyEquipment: (id: string) => void

  // Найняти персонал
  hireStaff: (id: string) => void

  // Звільнити персонал
  fireStaff: (id: string) => void

  // Звільнити артиста
  fireArtist: (id: string) => void

  // Рестарт
  restart: () => void
}

const initialLabel: LabelStats = { money: 5000, fans: 0, signed: 0, releases: 0, tokens: 3 }

const initialCalendar: Calendar = { week: 1, month: 1, year: 2024 }

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'intro',
  producer: null,
  artistPair: null,
  artists: [],
  currentArtist: null,
  label: { ...initialLabel },
  labelSlotIndex: 0,
  studioLevel: 1,
  equipment: EQUIPMENT_LIST.map((e) => ({ ...e, owned: false })),
  staffPool: generateStaffPool(),
  hiredStaff: [],
  calendar: { ...initialCalendar },
  result: null,
  weekEvents: [],
  charts: { topArtists: [], topSingles: [] },
  rejectedThisWeek: 0,
  weeksWithoutArtist: 0,

  startGame: (specialization) => {
    const specKey = specialization as keyof typeof SPECIALIZATIONS
    const producer = generateProducer()
    producer.specialization = specKey
    const pair = generateArtistPair()
    set({
      phase: 'pickArtist',
      producer,
      artistPair: pair,
      label: { ...initialLabel },
      calendar: { ...initialCalendar },
      studioLevel: 1,
      equipment: EQUIPMENT_LIST.map((e) => ({ ...e, owned: false })),
      staffPool: generateStaffPool(),
      hiredStaff: [],
      result: null,
      weekEvents: [],
      charts: { topArtists: [], topSingles: [] },
      rejectedThisWeek: 0,
      weeksWithoutArtist: 0,
      artists: [],
    })
  },

  signArtist: (index) => {
    const state = get()
    if (!state.artistPair) return
    const artist = state.artistPair[index]
    const signedArtist: Artist = { ...artist, signedWeek: state.calendar.week }
    const slotCount = LABEL_SLOTS[state.labelSlotIndex].slots
    if (state.artists.length >= slotCount) return

    const pair = generateArtistPair()
    set({
      phase: 'release',
      currentArtist: signedArtist,
      artists: [...state.artists, signedArtist],
      artistPair: pair,
      label: {
        ...state.label,
        signed: state.label.signed + 1,
      },
      rejectedThisWeek: 0,
    })
  },

  rejectBoth: () => {
    const pair = generateArtistPair()
    set((s) => ({
      artistPair: pair,
      rejectedThisWeek: s.rejectedThisWeek + 2,
    }))
  },

  release: () => {
    const state = get()
    if (!state.currentArtist || !state.producer) return

    const producer = state.producer
    const spec = SPECIALIZATIONS[producer.specialization]

    // Вартість токенів
    const tokenCost = 1
    if (state.label.tokens < tokenCost) return

    // Збираємо контекст
    const equipBonus = state.equipment
      .filter((e) => e.owned)
      .reduce((sum, e) => sum + e.bonus, 0)

    const soundEngineer = state.hiredStaff.find((s) => s.role === 'soundEngineer')
    const staffBonus = soundEngineer?.bonus ?? 0

    const studioUpgrade = STUDIO_UPGRADES[state.studioLevel - 1]

    // Бонуси продюсера
    let producerBonus = 0
    let profitMultiplier = 1.0

    switch (spec.effect) {
      case 'qualityBonus':
        producerBonus = 5
        break
      case 'profitBonus':
        profitMultiplier = 1.05
        break
      case 'scandalReduction':
        producerBonus = 2
        break
      case 'happinessBonus':
        producerBonus = 3
        break
      case 'riskProfitBonus':
        profitMultiplier = 1.15
        break
    }

    const context: ReleaseContext = {
      studioLevel: state.studioLevel,
      qualityBonus: studioUpgrade.qualityBonus,
      equipBonus,
      staffBonus,
      producerBonus,
      profitMultiplier,
    }

    const result = calculateRelease(state.currentArtist, context)

    // Оновлюємо популярність артистів
    const popBoost = clamp(Math.round((result.score - 40) / 5), -3, 10)

    const updatedArtists = state.artists.map((a) => {
      if (a.id === state.currentArtist!.id) {
        return {
          ...a,
          popularity: clamp(a.popularity + popBoost, 10, 90),
          localPop: clamp(a.localPop + randInt(0, 5), 10, 90),
          nationalPop: clamp(a.nationalPop + (result.successType === 'Хіт' || result.successType === 'Культовий шедевр' ? randInt(3, 10) : randInt(0, 3)), 0, 90),
          globalPop: clamp(a.globalPop + (result.successType === 'Культовий шедевр' ? randInt(2, 8) : 0), 0, 80),
        }
      }
      return a
    })

    // Репутація продюсера
    const repChange = result.successType === 'Культовий шедевр' ? 3
      : result.successType === 'Хіт' ? 1
      : result.successType === 'Провал' ? -2
      : 0

    const updatedProducer = {
      ...producer,
      reputation: clamp(producer.reputation + repChange, 0, 100),
    }

    set({
      phase: 'weekEnd',
      result,
      artists: updatedArtists,
      currentArtist: null,
      label: {
        ...state.label,
        money: state.label.money + result.money,
        fans: Math.max(0, state.label.fans + result.fans),
        tokens: state.label.tokens + result.tokens - tokenCost,
        releases: state.label.releases + 1,
      },
      producer: updatedProducer,
    })
  },

  endWeek: () => {
    const state = get()

    const { week, month, year } = state.calendar
    let newWeek = week + 1
    let newMonth = month
    let newYear = year

    if (newWeek > 4) {
      newWeek = 1
      newMonth = month + 1
      if (newMonth > 12) {
        newMonth = 1
        newYear = year + 1
      }
    }

    // Зарплата персоналу
    const staffCost = state.hiredStaff.reduce((sum, s) => sum + s.salary, 0)

    // Зміна станів артистів (архетипи)
    const updatedArtists = state.artists.map((a) => {
      const archDef = ARCHETYPES[a.archetype]
      if (!archDef) return a

      let talent = a.talent
      let discipline = a.discipline
      let charisma = a.charisma
      let health = a.health
      let happiness = a.happiness
      let popularity = a.popularity
      let addiction = a.addiction

      // Ефекти архетипу
      if (archDef.effects.talent) talent += archDef.effects.talent
      if (archDef.effects.discipline) discipline += archDef.effects.discipline
      if (archDef.effects.charisma) charisma += archDef.effects.charisma
      if (archDef.effects.health) health += archDef.effects.health
      if (archDef.effects.happiness) {
        // Продюсер-психолог дає +10%
        const psyBonus = state.producer?.specialization === 'psychologist' && archDef.effects.happiness > 0
          ? Math.round(archDef.effects.happiness * 0.1)
          : 0
        happiness += archDef.effects.happiness + psyBonus
      }
      if (archDef.effects.popularity) popularity += archDef.effects.popularity

      // Випадкові невеликі зміни
      health += randInt(-2, 2)
      happiness += randInt(-2, 2)
      popularity += randInt(-1, 1)
      addiction += randInt(-1, 1)

      // Щастя впливає на ефективність
      if (happiness < 30) discipline -= 2
      if (happiness > 70) discipline += 1

      // Здоров'я
      if (health < 25) {
        happiness -= 3
        discipline -= 2
      }

      return {
        ...a,
        talent: clamp(talent, 10, 90),
        discipline: clamp(discipline, 10, 90),
        charisma: clamp(charisma, 10, 90),
        health: clamp(health, 10, 90),
        happiness: clamp(happiness, 10, 90),
        popularity: clamp(popularity, 10, 90),
        addiction: clamp(addiction, 10, 90),
      }
    })

    // Події тижня
    const weekEvents = generateWeekEvents()

    // Застосувати події
    let moneyDelta = -staffCost
    let fanDelta = 0
    let repDelta = 0
    let tokenDelta = 0

    for (const ev of weekEvents) {
      moneyDelta += ev.moneyChange ?? 0
      fanDelta += ev.fanChange ?? 0
      repDelta += ev.repChange ?? 0
      tokenDelta += ev.tokenChange ?? 0
    }

    // Перевірка умов програшу
    let newPhase: GamePhase = 'pickArtist'
    const newMoney = state.label.money + moneyDelta
    const newFans = Math.max(0, state.label.fans + fanDelta)
    const newTokens = Math.max(0, state.label.tokens + tokenDelta)
    const newRep = clamp((state.producer?.reputation ?? 50) + repDelta, 0, 100)

    // Умови програшу
    if (newMoney < -50000) {
      newPhase = 'gameOver'
    } else if (updatedArtists.length === 0 && state.rejectedThisWeek > 4) {
      newPhase = 'gameOver'
    } else if (newRep <= 0) {
      newPhase = 'gameOver'
    }

    // Умова перемоги
    const totalFans = newFans
    const yearsActive = newYear - 2024
    if (totalFans >= 100_000_000 || (yearsActive >= 10 && updatedArtists.length > 0)) {
      newPhase = 'victory'
    }

    const pair = generateArtistPair()

    set({
      phase: newPhase,
      calendar: { week: newWeek, month: newMonth, year: newYear },
      artists: updatedArtists,
      label: { ...state.label, money: newMoney, fans: newFans, tokens: newTokens },
      producer: state.producer ? { ...state.producer, reputation: newRep } : null,
      weekEvents,
      result: null,
      artistPair: pair,
      rejectedThisWeek: 0,
    })
  },

  upgradeLabel: () => {
    const state = get()
    const nextIndex = state.labelSlotIndex + 1
    if (nextIndex >= LABEL_SLOTS.length) return
    const upgrade = LABEL_SLOTS[nextIndex]
    if (state.label.money < upgrade.cost) return

    set({
      labelSlotIndex: nextIndex,
      label: { ...state.label, money: state.label.money - upgrade.cost },
    })
  },

  upgradeStudio: () => {
    const state = get()
    const nextLevel = (state.studioLevel + 1) as StudioLevel
    if (nextLevel > 6) return
    const upgrade = STUDIO_UPGRADES[nextLevel - 1]
    if (state.label.money < upgrade.cost) return

    set({
      studioLevel: nextLevel,
      label: { ...state.label, money: state.label.money - upgrade.cost },
    })
  },

  buyEquipment: (id) => {
    const state = get()
    const item = state.equipment.find((e) => e.id === id)
    if (!item || item.owned) return
    if (state.label.money < item.cost) return

    set({
      equipment: state.equipment.map((e) => (e.id === id ? { ...e, owned: true } : e)),
      label: { ...state.label, money: state.label.money - item.cost },
    })
  },

  hireStaff: (id) => {
    const state = get()
    const candidate = state.staffPool.find((s) => s.id === id)
    if (!candidate) return
    const alreadyHired = state.hiredStaff.some((s) => s.role === candidate.role)
    if (alreadyHired) return

    const hired: StaffMember = {
      ...candidate,
      hired: true,
      weekHired: state.calendar.week,
    }
    set({
      hiredStaff: [...state.hiredStaff, hired],
      staffPool: state.staffPool.filter((s) => s.id !== id),
    })
  },

  fireStaff: (id) => {
    const state = get()
    const fired = state.hiredStaff.find((s) => s.id === id)
    if (!fired) return
    set({
      hiredStaff: state.hiredStaff.filter((s) => s.id !== id),
      staffPool: [...state.staffPool, { ...fired }],
    })
  },

  fireArtist: (id) => {
    const state = get()
    set({
      artists: state.artists.filter((a) => a.id !== id),
    })
  },

  restart: () => {
    set({
      phase: 'intro',
      producer: null,
      artistPair: null,
      artists: [],
      currentArtist: null,
      label: { ...initialLabel },
      labelSlotIndex: 0,
      studioLevel: 1,
      equipment: EQUIPMENT_LIST.map((e) => ({ ...e, owned: false })),
      staffPool: generateStaffPool(),
      hiredStaff: [],
      calendar: { ...initialCalendar },
      result: null,
      weekEvents: [],
      charts: { topArtists: [], topSingles: [] },
      rejectedThisWeek: 0,
      weeksWithoutArtist: 0,
    })
  },
}))
