import { AnimatePresence, motion } from 'framer-motion'
import type { ComponentType } from 'react'
import { Layout } from './components/Layout'
import { useGameStore } from './store/useGameStore'
import { ScreenNewArtist } from './components/screens/ScreenNewArtist'
import { ScreenRelease } from './components/screens/ScreenRelease'
import { ScreenResult } from './components/screens/ScreenResult'
import type { GamePhase } from './types/game'

const SCREENS: Record<GamePhase, ComponentType> = {
  newArtist: ScreenNewArtist,
  release: ScreenRelease,
  result: ScreenResult,
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
