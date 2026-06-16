import { AnimatePresence, motion } from 'framer-motion'
import type { ComponentType } from 'react'
import { Layout } from './components/Layout'
import { useGameStore } from './store/useGameStore'
import { ScreenIntro } from './components/screens/ScreenIntro'
import { ScreenGameOver } from './components/screens/ScreenGameOver'
import { ScreenVictory } from './components/screens/ScreenVictory'
import { TabStudio } from './components/tabs/TabStudio'
import { TabLabel } from './components/tabs/TabLabel'
import { TabWorld } from './components/tabs/TabWorld'
import type { GamePhase, GameTab } from './types/game'

const PHASE_SCREENS: Partial<Record<GamePhase, ComponentType>> = {
  intro: ScreenIntro,
  gameOver: ScreenGameOver,
  victory: ScreenVictory,
}

const TAB_COMPONENTS: Record<GameTab, ComponentType> = {
  studio: TabStudio,
  label: TabLabel,
  world: TabWorld,
}

export default function App() {
  const phase = useGameStore((s) => s.phase)
  const activeTab = useGameStore((s) => s.activeTab)
  const setTab = useGameStore((s) => s.setTab)

  const PhaseScreen = PHASE_SCREENS[phase]

  if (PhaseScreen) {
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
            <PhaseScreen />
          </motion.div>
        </AnimatePresence>
      </Layout>
    )
  }

  // Основний геймплей — вкладки
  const TabComponent = TAB_COMPONENTS[activeTab]
  const tabs: { key: GameTab; label: string; emoji: string }[] = [
    { key: 'studio', label: 'Студія', emoji: '🎛️' },
    { key: 'label', label: 'Лейбл', emoji: '🏢' },
    { key: 'world', label: 'Світ', emoji: '🌍' },
  ]

  return (
    <Layout>
      {/* Таб-навігація */}
      <div className="mb-4 flex gap-1 rounded-2xl border border-studio-600 bg-studio-800/80 p-1.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-xl px-4 py-2.5 text-center font-display text-sm transition-all ${
              activeTab === t.key
                ? 'bg-gradient-to-b from-amber-400 to-orange-500 text-studio-950 shadow-stamp'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex flex-1 flex-col"
        >
          <TabComponent />
        </motion.div>
      </AnimatePresence>
    </Layout>
  )
}
