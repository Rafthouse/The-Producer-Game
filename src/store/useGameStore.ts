import { create } from 'zustand'
import type {
  Artist, GamePhase, LabelStats, ReleaseResult, Producer,
  StudioLevel, Equipment, StaffMember, Calendar, WeekEvent, Charts,
  GameTab, Trend, GenreTrend, OvertonWindow, NewsItem,
  FreakStatus, TourStatus,
} from '../types/game'
import { generateArtistPair } from '../lib/generateArtist'
import { calculateRelease, calculateTour, type ReleaseContext } from '../lib/calculateRelease'
import { generateProducer, SPECIALIZATIONS } from '../data/producer'
import { ARCHETYPES } from '../data/archetypes'
import { STUDIO_UPGRADES, LABEL_SLOTS, EQUIPMENT_LIST, generateStaffPool } from '../data/studio'
import { generateWeekEvents } from '../data/weekEvents'
import { generateTrends, generateGenreTrends, generateOvertonWindow } from '../data/trends'
import { generateNews } from '../data/news'
import { generateNeed } from '../data/needs'
import { clamp, randInt, chance } from '../lib/random'

interface GameStore {
  phase: GamePhase
  activeTab: GameTab
  producer: Producer | null
  artistPair: [Artist, Artist] | null
  artists: Artist[]
  currentArtist: Artist | null
  label: LabelStats
  labelSlotIndex: number
  studioLevel: StudioLevel
  equipment: Equipment[]
  staffPool: Omit<StaffMember, 'hired' | 'weekHired'>[]
  hiredStaff: StaffMember[]
  calendar: Calendar
  result: ReleaseResult | null
  weekEvents: WeekEvent[]
  trends: Trend[]
  genreTrends: GenreTrend[]
  overtonWindow: OvertonWindow[]
  news: NewsItem[]
  charts: Charts
  rejectedThisWeek: number
  freakStatuses: Record<string, FreakStatus>

  startGame: (specialization: string) => void
  setTab: (tab: GameTab) => void
  signArtist: (index: 0 | 1) => void
  rejectBoth: () => void
  selectArtistForRelease: (artistId: string) => void
  release: () => void
  fulfillNeed: (artistId: string, needId: string) => void
  ignoreNeed: (artistId: string, needId: string) => void
  startTour: (artistId: string) => void
  sendToRehab: (artistId: string) => void
  fireArtist: (artistId: string) => void
  hireStaff: (id: string) => void
  fireStaff: (id: string) => void
  buyEquipment: (id: string) => void
  upgradeStudio: () => void
  upgradeLabel: () => void
  endWeek: () => void
  restart: () => void
}

const initialLabel: LabelStats = { money: 5000, fans: 0, signed: 0, releases: 0, tokens: 3 }
const initialCalendar: Calendar = { week: 1, month: 1, year: 2024 }

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'intro',
  activeTab: 'studio',
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
  trends: generateTrends(),
  genreTrends: [],
  overtonWindow: [],
  news: [],
  charts: { topArtists: [], topSingles: [] },
  rejectedThisWeek: 0,
  freakStatuses: {},

  startGame: (specialization) => {
    const producer = generateProducer()
    producer.specialization = specialization as any
    const trends = generateTrends()
    const genreTrends = generateGenreTrends(trends)
    const overtonWindow = generateOvertonWindow(trends)
    const news = generateNews(1, 1, 2024, trends, 3)
    const pair = generateArtistPair()
    set({
      phase: 'playing', activeTab: 'studio', producer,
      artistPair: pair, artists: [], currentArtist: null,
      label: { ...initialLabel }, calendar: { ...initialCalendar },
      studioLevel: 1,
      equipment: EQUIPMENT_LIST.map((e) => ({ ...e, owned: false })),
      staffPool: generateStaffPool(), hiredStaff: [],
      result: null, weekEvents: [],
      trends, genreTrends, overtonWindow, news,
      charts: { topArtists: [], topSingles: [] },
      rejectedThisWeek: 0, freakStatuses: {},
    })
  },

  setTab: (tab) => set({ activeTab: tab }),

  signArtist: (index) => {
    const state = get()
    if (!state.artistPair) return
    const artist = state.artistPair[index]
    const slotCount = LABEL_SLOTS[state.labelSlotIndex].slots
    if (state.artists.length >= slotCount) return
    const signedArtist: Artist = { ...artist, signedWeek: state.calendar.week }
    const pair = generateArtistPair()
    set({
      currentArtist: signedArtist,
      artists: [...state.artists, signedArtist],
      artistPair: pair,
      label: { ...state.label, signed: state.label.signed + 1 },
      rejectedThisWeek: 0,
    })
  },

  rejectBoth: () => {
    set((s) => ({ artistPair: generateArtistPair(), rejectedThisWeek: s.rejectedThisWeek + 2 }))
  },

  selectArtistForRelease: (artistId) => {
    const artist = get().artists.find((a) => a.id === artistId)
    if (artist) set({ currentArtist: artist })
  },

  release: () => {
    const state = get()
    if (!state.currentArtist || !state.producer) return
    if (state.label.tokens < 1) return

    const producer = state.producer
    const spec = SPECIALIZATIONS[producer.specialization]
    const equipBonus = state.equipment.filter((e) => e.owned).reduce((s, e) => s + e.bonus, 0)
    const soundEngineer = state.hiredStaff.find((s) => s.role === 'soundEngineer')
    const staffBonus = soundEngineer?.bonus ?? 0
    const levelMult = 1 + (producer.level - 1) * 0.1
    let producerBonus = 0
    let profitMultiplier = 1.0
    switch (spec.effect) {
      case 'qualityBonus': producerBonus = Math.round(5 * levelMult); break
      case 'profitBonus': profitMultiplier = 1.0 + 0.05 * levelMult; break
      case 'scandalReduction': producerBonus = Math.round(2 * levelMult); break
      case 'happinessBonus': producerBonus = Math.round(3 * levelMult); break
      case 'riskProfitBonus': profitMultiplier = 1.0 + 0.15 * levelMult; break
    }
    const studioUpgrade = STUDIO_UPGRADES[state.studioLevel - 1]
    const artist = state.currentArtist
    const genreTrend = artist ? state.genreTrends.find((g) => g.genreId === artist.genre.id) : undefined
    const freak = artist ? state.freakStatuses[artist.id] : undefined
    const prStaff = state.hiredStaff.find((s) => s.role === 'pr')
    const prBonus = prStaff ? prStaff.bonus : 0
    const lawyerStaff = state.hiredStaff.find((s) => s.role === 'lawyer')
    const lawyerBonus = lawyerStaff ? lawyerStaff.bonus * 0.01 : 0
    const accountantStaff = state.hiredStaff.find((s) => s.role === 'accountant')
    const accountantBonus = accountantStaff ? accountantStaff.bonus * 0.01 : 0
    const managerStaff = state.hiredStaff.find((s) => s.role === 'manager')
    const managerBonus = managerStaff ? managerStaff.bonus * 0.5 : 0
    const securityStaff = state.hiredStaff.find((s) => s.role === 'security')
    const securityBonus = securityStaff ? securityStaff.bonus * 0.3 : 0

    const context: ReleaseContext & { prBonus: number; managerBonus: number; securityBonus: number; accountantBonus: number } = {
      studioLevel: state.studioLevel,
      qualityBonus: studioUpgrade.qualityBonus,
      equipBonus, staffBonus, producerBonus,
      profitMultiplier: profitMultiplier * (1 + lawyerBonus),
      genreTrend, freakPopBonus: freak?.trashPopBonus ?? 0,
      prBonus, managerBonus, securityBonus, accountantBonus,
    }

    const result = calculateRelease(state.currentArtist, context)
    const popBoost = clamp(Math.round((result.score - 40) / 5), -3, 10)

    const updatedArtists = state.artists.map((a) => {
      if (a.id !== state.currentArtist!.id) return a
      return {
        ...a,
        popularity: clamp(a.popularity + popBoost, 10, 90),
        localPop: clamp(a.localPop + randInt(0, 5), 10, 90),
        nationalPop: clamp(a.nationalPop + (result.successType === 'Хіт' || result.successType === 'Культовий шедевр' ? randInt(3, 10) : randInt(0, 3)), 0, 90),
        globalPop: clamp(a.globalPop + (result.successType === 'Культовий шедевр' ? randInt(2, 8) : 0), 0, 80),
        history: [...a.history, {
          week: state.calendar.week, month: state.calendar.month, year: state.calendar.year,
          popularity: clamp(a.popularity + popBoost, 10, 90),
          health: a.health, happiness: a.happiness,
          money: state.label.money + result.money,
        }],
      }
    })

    // Досвід продюсера + репутація
    const expGain = result.successType === 'Провал' ? 5 : result.successType === 'Локальний мем' ? 10
      : result.successType === 'Нормальний реліз' ? 20 : result.successType === 'Хіт' ? 40 : 80

    const updatedProducer = { ...state.producer }
    updatedProducer.experience += expGain
    while (updatedProducer.experience >= updatedProducer.experienceToNext) {
      updatedProducer.experience -= updatedProducer.experienceToNext
      updatedProducer.level += 1
      updatedProducer.experienceToNext = Math.round(updatedProducer.experienceToNext * 1.5)
    }

    const repChange = result.successType === 'Культовий шедевр' ? 3
      : result.successType === 'Хіт' ? 1 : result.successType === 'Провал' ? -2 : 0
    updatedProducer.reputation = clamp(updatedProducer.reputation + repChange, 0, 100)

    set({
      result, artists: updatedArtists, currentArtist: null,
      label: {
        ...state.label,
        money: state.label.money + result.money,
        fans: Math.max(0, state.label.fans + result.fans),
        tokens: state.label.tokens + result.tokens - 1,
        releases: state.label.releases + 1,
      },
      producer: updatedProducer,
    })
  },

  fulfillNeed: (artistId, needId) => {
    const state = get()
    const artist = state.artists.find((a) => a.id === artistId)
    const need = artist?.needs.find((n) => n.id === needId)
    if (!need || state.label.money < need.cost) return
    set({
      artists: state.artists.map((a) => a.id !== artistId ? a : {
        ...a,
        needs: a.needs.filter((n) => n.id !== needId),
        happiness: clamp(a.happiness + 10, 10, 90),
      }),
      label: { ...state.label, money: state.label.money - need.cost },
    })
  },

  ignoreNeed: (artistId, needId) => {
    set((s) => ({
      artists: s.artists.map((a) => a.id !== artistId ? a : {
        ...a,
        needs: a.needs.filter((n) => n.id !== needId),
        happiness: clamp(a.happiness - (a.needs.find((n) => n.id === needId)?.happinessPenalty ?? 10), 10, 90),
      }),
    }))
  },

  startTour: (artistId) => {
    const state = get()
    const artist = state.artists.find((a) => a.id === artistId)
    if (!artist) return

    // Тур коштує грошей
    const tourCost = 15000 + Math.round(artist.popularity * 500)
    if (state.label.money < tourCost) return

    const genreTrend = state.genreTrends.find((g) => g.genreId === artist.genre.id)
    const managerStaff = state.hiredStaff.find((s) => s.role === 'manager')
    const managerBonus = managerStaff ? managerStaff.bonus : 0
    const tourResult = calculateTour(artist, genreTrend, managerBonus)

    const updatedArtists = state.artists.map((a) => {
      if (a.id !== artistId) return a
      return {
        ...a,
        tour: {
          status: tourResult.status as TourStatus,
          weeksLeft: 0,
          expectedRevenue: tourResult.revenue,
          expectedFans: tourResult.fans,
        },
        popularity: tourResult.status === 'success' ? clamp(a.popularity + randInt(2, 5), 10, 90) : clamp(a.popularity - randInt(1, 3), 10, 90),
        happiness: tourResult.status === 'success' ? clamp(a.happiness + 5, 10, 90) : clamp(a.happiness - 8, 10, 90),
        health: tourResult.status === 'success' ? a.health : clamp(a.health - 5, 10, 90),
        history: [...a.history, {
          week: state.calendar.week, month: state.calendar.month, year: state.calendar.year,
          popularity: tourResult.status === 'success' ? clamp(a.popularity + randInt(2, 5), 10, 90) : a.popularity,
          health: tourResult.status === 'success' ? a.health : clamp(a.health - 5, 10, 90),
          happiness: tourResult.status === 'success' ? clamp(a.happiness + 5, 10, 90) : clamp(a.happiness - 8, 10, 90),
          money: state.label.money - tourCost + tourResult.revenue,
        }],
      }
    })

    set({
      artists: updatedArtists,
      label: {
        ...state.label,
        money: state.label.money - tourCost + tourResult.revenue,
        fans: state.label.fans + tourResult.fans,
      },
    })
  },

  sendToRehab: (artistId) => {
    const rehabCost = 20000
    const state = get()
    if (state.label.money < rehabCost) return
    set({
      artists: state.artists.map((a) => a.id !== artistId ? a : {
        ...a, inRehab: true, rehabWeeksLeft: 4, addiction: clamp(a.addiction - 30, 10, 90),
      }),
      label: { ...state.label, money: state.label.money - rehabCost },
    })
  },

  fireArtist: (artistId) => set((s) => ({ artists: s.artists.filter((a) => a.id !== artistId) })),

  hireStaff: (id) => {
    const state = get()
    const candidate = state.staffPool.find((s) => s.id === id)
    if (!candidate || state.hiredStaff.some((s) => s.role === candidate.role)) return
    set({
      hiredStaff: [...state.hiredStaff, { ...candidate, hired: true, weekHired: state.calendar.week }],
      staffPool: state.staffPool.filter((s) => s.id !== id),
    })
  },

  fireStaff: (id) => {
    const state = get()
    const fired = state.hiredStaff.find((s) => s.id === id)
    if (!fired) return
    set({
      hiredStaff: state.hiredStaff.filter((s) => s.id !== id),
      staffPool: [...state.staffPool, { id: fired.id, name: fired.name, role: fired.role, salary: fired.salary, bonus: fired.bonus, personality: fired.personality }],
    })
  },

  buyEquipment: (id) => {
    const state = get()
    const item = state.equipment.find((e) => e.id === id)
    if (!item || item.owned || state.label.money < item.cost) return
    set({
      equipment: state.equipment.map((e) => e.id === id ? { ...e, owned: true } : e),
      label: { ...state.label, money: state.label.money - item.cost },
    })
  },

  upgradeStudio: () => {
    const state = get()
    if (state.studioLevel >= 6) return
    const upgrade = STUDIO_UPGRADES[state.studioLevel]
    if (state.label.money < upgrade.cost) return
    set({ studioLevel: (state.studioLevel + 1) as StudioLevel, label: { ...state.label, money: state.label.money - upgrade.cost } })
  },

  upgradeLabel: () => {
    const state = get()
    const nextIndex = state.labelSlotIndex + 1
    if (nextIndex >= LABEL_SLOTS.length) return
    const upgrade = LABEL_SLOTS[nextIndex]
    if (state.label.money < upgrade.cost) return
    set({ labelSlotIndex: nextIndex, label: { ...state.label, money: state.label.money - upgrade.cost } })
  },

  endWeek: () => {
    const state = get()
    const { week, month, year } = state.calendar
    let newWeek = week + 1
    let newMonth = month
    let newYear = year
    if (newWeek > 4) { newWeek = 1; newMonth = month + 1; if (newMonth > 12) { newMonth = 1; newYear = year + 1 } }

    const staffCost = state.hiredStaff.reduce((s, st) => s + st.salary, 0)

    const updatedArtists = state.artists.map((a) => {
      let { talent, discipline, charisma, health, happiness, popularity, addiction, selfConfidence } = a

      const archDef = ARCHETYPES[a.archetype]
      if (archDef) {
        if (archDef.effects.talent) talent += archDef.effects.talent
        if (archDef.effects.discipline) discipline += archDef.effects.discipline
        if (archDef.effects.charisma) charisma += archDef.effects.charisma
        if (archDef.effects.health) health += archDef.effects.health
        if (archDef.effects.happiness) happiness += archDef.effects.happiness
        if (archDef.effects.popularity) popularity += archDef.effects.popularity
      }

      health += randInt(-2, 2); happiness += randInt(-2, 2)
      popularity += randInt(-1, 1); addiction += randInt(-1, 1); selfConfidence += randInt(-1, 2)
      if (happiness < 30) discipline -= 2
      if (health < 25) { happiness -= 3; discipline -= 2 }
      if (addiction > 70) { health -= 3; happiness -= 2 }
      if (a.pregnant) health -= 2

      const freak = state.freakStatuses[a.id]
      let trashPopBonus = freak?.trashPopBonus ?? 0
      if (selfConfidence > 70 && talent < 35 && chance(0.1)) {
        trashPopBonus = clamp(trashPopBonus + randInt(2, 5), 0, 30)
        popularity += randInt(1, 3)
      }

      let rehabWeeksLeft = a.rehabWeeksLeft
      if (a.inRehab) {
        rehabWeeksLeft--
        health = clamp(health + 5, 10, 90)
        addiction = clamp(addiction - 5, 10, 90)
      }

      const needsUpdated = a.needs
        .map((n) => ({ ...n, weeksLeft: n.weeksLeft - 1 }))
        .filter((n) => n.weeksLeft > 0)

      if (!a.inRehab && chance(0.3)) {
        const newNeed = generateNeed(a)
        if (newNeed) needsUpdated.push(newNeed)
      }

      return {
        ...a, talent: clamp(talent, 10, 90), discipline: clamp(discipline, 10, 90),
        charisma: clamp(charisma, 10, 90), health: clamp(health, 10, 90),
        happiness: clamp(happiness, 10, 90), popularity: clamp(popularity, 10, 90),
        addiction: clamp(addiction, 10, 90), selfConfidence: clamp(selfConfidence, 10, 90),
        needs: needsUpdated, inRehab: rehabWeeksLeft > 0, rehabWeeksLeft,
        history: [...a.history, {
          week: newWeek, month: newMonth, year: newYear,
          popularity: clamp(popularity, 10, 90), health: clamp(health, 10, 90),
          happiness: clamp(happiness, 10, 90), money: state.label.money,
        }],
      }
    })

    const newFreakStatuses: Record<string, FreakStatus> = {}
    for (const a of updatedArtists) {
      const old = state.freakStatuses[a.id]
      newFreakStatuses[a.id] = {
        isFreak: (old?.isFreak ?? false) || (a.selfConfidence > 70 && a.talent < 35),
        isTrashStar: (old?.isTrashStar ?? false) || (a.selfConfidence > 80 && a.talent < 30),
        trashPopBonus: old?.trashPopBonus ?? 0,
        repPenalty: old?.repPenalty ?? 0,
      }
    }

    const weekEvents = generateWeekEvents()
    const trends = generateTrends(state.trends)
    const genreTrends = generateGenreTrends(trends)
    const overtonWindow = generateOvertonWindow(trends)
    const news = generateNews(newWeek, newMonth, newYear, trends, 3)

    let moneyDelta = -staffCost
    let fanDelta = 0, repDelta = 0, tokenDelta = 0
    for (const ev of weekEvents) {
      moneyDelta += ev.moneyChange ?? 0; fanDelta += ev.fanChange ?? 0
      repDelta += ev.repChange ?? 0; tokenDelta += ev.tokenChange ?? 0
    }

    const newMoney = state.label.money + moneyDelta
    const newFans = Math.max(0, state.label.fans + fanDelta)
    const newTokens = Math.max(0, state.label.tokens + tokenDelta)
    const newRep = clamp((state.producer?.reputation ?? 50) + repDelta, 0, 100)

    let newPhase: GamePhase = 'playing'
    if (newMoney < -50000) newPhase = 'gameOver'
    else if (updatedArtists.length === 0 && state.rejectedThisWeek > 6) newPhase = 'gameOver'
    else if (newRep <= 0) newPhase = 'gameOver'

    const yearsActive = newYear - 2024
    if (newFans >= 100_000_000 || (yearsActive >= 10 && updatedArtists.length > 0)) newPhase = 'victory'

    set({
      phase: newPhase, calendar: { week: newWeek, month: newMonth, year: newYear },
      artists: updatedArtists,
      label: { money: newMoney, fans: newFans, tokens: newTokens, signed: state.label.signed, releases: state.label.releases },
      producer: state.producer ? { ...state.producer, reputation: newRep } : null,
      weekEvents, result: null, currentArtist: null, artistPair: generateArtistPair(),
      rejectedThisWeek: 0, trends, genreTrends, overtonWindow, news, freakStatuses: newFreakStatuses,
    })
  },

  restart: () => {
    set({
      phase: 'intro', activeTab: 'studio',
      producer: null, artistPair: null, artists: [], currentArtist: null,
      label: { ...initialLabel }, labelSlotIndex: 0, studioLevel: 1,
      equipment: EQUIPMENT_LIST.map((e) => ({ ...e, owned: false })),
      staffPool: generateStaffPool(), hiredStaff: [],
      calendar: { ...initialCalendar }, result: null, weekEvents: [],
      trends: generateTrends(), genreTrends: [], overtonWindow: [], news: [],
      charts: { topArtists: [], topSingles: [] },
      rejectedThisWeek: 0, freakStatuses: {},
    })
  },
}))
