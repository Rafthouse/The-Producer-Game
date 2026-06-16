import { motion } from 'framer-motion'
import { useGameStore } from '../../store/useGameStore'
import { SPECIALIZATIONS } from '../../data/producer'
import type { ProducerSpecialization } from '../../types/game'
const specs = Object.entries(SPECIALIZATIONS) as [ProducerSpecialization, typeof SPECIALIZATIONS[ProducerSpecialization]][]

export function ScreenIntro() {
  const startGame = useGameStore((s) => s.startGame)

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-7xl mb-4">💿</div>
        <h1 className="font-display text-4xl text-white sm:text-5xl">
          PRODUCER <span className="text-amber-400">TYCOON</span>
        </h1>
        <p className="mt-3 text-sm text-zinc-400 max-w-md mx-auto">
          Ви — продюсер. Підписуйте артистів, записуйте хіти, ризикуйте,
          розбудовуйте імперію звуку. Або прогоріть з тріском.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-lg"
      >
        <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
          Оберіть спеціалізацію продюсера
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {specs.map(([key, spec]) => (
            <motion.button
              key={key}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => startGame(key)}
              className="rounded-2xl border border-studio-600 bg-studio-800/80 p-5 text-left shadow-glow transition-colors hover:border-amber-500/50 hover:bg-studio-700/80"
            >
              <div className="text-3xl mb-2">{spec.emoji}</div>
              <div className="font-display text-lg text-white">{spec.name}</div>
              <div className="mt-1 text-xs text-zinc-400">{spec.description}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xs text-zinc-600 text-center max-w-sm"
      >
        Керуйте лейблом, наймайте персонал, купуйте обладнання — і не дайте артистам зійти з розуму.
      </motion.p>
    </div>
  )
}
