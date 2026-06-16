import { AnimatePresence, motion } from 'framer-motion'
import type { ComponentType } from 'react'
import { Layout } from './components/Layout'
import { useGameStore } from './store/useGameStore'
import { ScreenIntro } from './components/screens/ScreenIntro'
import { ScreenNewArtist } from './components/screens/ScreenNewArtist'
import { ScreenRelease } from './components/screens/ScreenRelease'
import { ScreenWeekEnd } from './components/screens/ScreenWeekEnd'
import { ScreenGameOver } from './components/screens/ScreenGameOver'
import { ScreenVictory } from './components/screens/ScreenVictory'
import type { GamePhase } from './types/game'

const SCREENS: Record<GamePhase, ComponentType> = {
  intro: ScreenIntro,
  pickArtist: ScreenNewArtist,
  release: ScreenRelease,
  weekEnd: ScreenWeekEnd,
  gameOver: ScreenGameOver,
  victory: ScreenVictory,
}

export default function App() {
  const phase = useGameStore((s) => s.phase)
  const Screen = SCREENS[phase]

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="flex flex-1 flex-col"
        >
          <Screen />
        </motion.div>
      </AnimatePresence>
    </Layout>
  )
}
