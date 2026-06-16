import { create } from 'zustand'
import type { Artist, GamePhase, LabelStats, ReleaseResult } from '../types/game'
import { generateArtist } from '../lib/generateArtist'
import { calculateRelease } from '../lib/calculateRelease'

interface GameStore {
  phase: GamePhase
  artist: Artist
  result: ReleaseResult | null
  label: LabelStats
  rejected: number

  /** Відмовити поточному артисту й згенерувати нового. */
  reject: () => void
  /** Підписати поточного артиста та перейти до релізу. */
  sign: () => void
  /** Випустити сингл і порахувати результат. */
  release: () => void
  /** Перейти до наступного артиста після перегляду результату. */
  next: () => void
}

const initialLabel: LabelStats = { money: 0, fans: 0, signed: 0, releases: 0 }

export const useGameStore = create<GameStore>((set) => ({
  phase: 'newArtist',
  artist: generateArtist(),
  result: null,
  label: initialLabel,
  rejected: 0,

  reject: () =>
    set((s) => ({ artist: generateArtist(), rejected: s.rejected + 1 })),

  sign: () =>
    set((s) => ({
      phase: 'release',
      label: { ...s.label, signed: s.label.signed + 1 },
    })),

  release: () =>
    set((s) => {
      const result = calculateRelease(s.artist)
      return {
        phase: 'result',
        result,
        label: {
          money: s.label.money + result.money,
          fans: Math.max(0, s.label.fans + result.fans),
          signed: s.label.signed,
          releases: s.label.releases + 1,
        },
      }
    }),

  next: () =>
    set(() => ({ phase: 'newArtist', artist: generateArtist(), result: null })),
}))
